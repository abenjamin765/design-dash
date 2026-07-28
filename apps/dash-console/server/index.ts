/**
 * server/index.ts
 *
 * Hono-based local API server for the Dash Workshop Console.
 * Binds to 127.0.0.1:8787 only — never exposes to the network.
 */

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { execSync } from 'node:child_process'
import { readConfig, writeConfig, isAllowedPath, type ConsoleConfig } from './config.js'
import { scanWorkspaceRoot, scanWorkshop } from './scanWorkshops.js'
import { startPrompt, resumePrompt } from './prompts.js'

const app = new Hono()

app.use('*', cors({ origin: 'http://127.0.0.1:5173' }))

// ── Config ──────────────────────────────────────────────────────────────────

app.get('/api/config', async (c) => {
  const config = await readConfig()
  return c.json(config)
})

app.post('/api/config', async (c) => {
  const body = await c.req.json<Partial<ConsoleConfig>>()
  const current = await readConfig()
  const next: ConsoleConfig = {
    workspaceRoots: body.workspaceRoots ?? current.workspaceRoots,
    skillsRepo: body.skillsRepo ?? current.skillsRepo,
  }
  await writeConfig(next)
  return c.json({ ok: true })
})

// ── Workshops ────────────────────────────────────────────────────────────────

app.get('/api/workshops', async (c) => {
  const config = await readConfig()
  const all = await Promise.all(config.workspaceRoots.map(scanWorkspaceRoot))
  return c.json(all.flat())
})

app.get('/api/workshops/:slug', async (c) => {
  const { slug } = c.req.param()
  const config = await readConfig()

  for (const root of config.workspaceRoots) {
    const workshopsDir = path.join(root, 'dashes')
    const slugDir = path.join(workshopsDir, slug)
    if (!isAllowedPath(slugDir, config.workspaceRoots)) {
      return c.json({ error: 'Access denied' }, 403)
    }
    try {
      await fs.access(slugDir)
      const workshop = await scanWorkshop(slugDir, root)
      return c.json(workshop)
    } catch {
      continue
    }
  }

  return c.json({ error: 'Workshop not found' }, 404)
})

// ── Prompts ──────────────────────────────────────────────────────────────────

app.get('/api/workshops/:slug/prompt/start', async (c) => {
  const { slug } = c.req.param()
  const config = await readConfig()
  const workshop = await findWorkshop(slug, config)
  if (!workshop) return c.json({ error: 'Not found' }, 404)

  return c.json({
    prompt: startPrompt({
      slug,
      workspace: workshop.dir.replace(path.join('dashes', slug), '').replace(/\/$/, ''),
      sessionMode: workshop.sessionMode === 'unknown' ? 'interactive' : workshop.sessionMode,
    }),
  })
})

app.get('/api/workshops/:slug/prompt/resume', async (c) => {
  const { slug } = c.req.param()
  const config = await readConfig()
  const workshop = await findWorkshop(slug, config)
  if (!workshop) return c.json({ error: 'Not found' }, 404)

  return c.json({
    prompt: resumePrompt({
      slug,
      workspace: workshop.workspaceRoot,
      sessionMode: workshop.sessionMode === 'unknown' ? 'interactive' : workshop.sessionMode,
      resumePhase: workshop.suggestedResumePhase,
    }),
  })
})

// ── Create workshop stub ─────────────────────────────────────────────────────

app.post('/api/workshops', async (c) => {
  const config = await readConfig()
  const body = await c.req.json<{
    slug: string
    dashName: string
    owner: string
    sessionMode?: string
    workspaceRoot: string
  }>()

  if (!config.workspaceRoots.includes(body.workspaceRoot)) {
    return c.json({ error: 'Workspace root not in allowlist' }, 403)
  }

  const slugDir = path.join(body.workspaceRoot, 'dashes', body.slug)
  if (!isAllowedPath(slugDir, config.workspaceRoots)) {
    return c.json({ error: 'Access denied' }, 403)
  }

  await fs.mkdir(slugDir, { recursive: true })

  // Write seeded dash-config.yaml
  const today = new Date().toISOString().slice(0, 10)
  const dashConfig = `# Dash Configuration — created by Dash Console
# One file per Design Dash (see templates/dash-config.yaml).
# Do NOT edit mid-dash to lower the tier — promotion is allowed, demotion is not.

dash-name: "${body.dashName}"
dash-id: "${body.slug}"
owner: "${body.owner}"
start-date: "${today}"
artifact_root: "dashes"
prototype_workspace: ""
session-mode: "${body.sessionMode ?? 'interactive'}"

# Tier is RULE-DERIVED, not chosen — the P0 classifier fills this.
tier: ""
computed-tier-rationale: ""
tier-confirmed-by: ""
tier-confirmation-date: ""

phases-active:
  - P0

gates-required:
  - P6   # Ethics/equity floor — never waived

artifacts-required:
  - assumptions.md
  - glossary.md
  - ethics-equity-checklist.md

cross-functional-sign-off:
  required-disciplines: []
  simulation-allowed: true

tier-override-log: []
`
  await fs.writeFile(path.join(slugDir, 'dash-config.yaml'), dashConfig, 'utf8')

  // Seed assumptions.md
  const assumptionsMd = `# Assumptions — ${body.dashName}

> Managed by the Design Dash orchestrator. Every unvalidated decision becomes a row here.

| id | statement | type | confidence | validation-method | owner | status | linked-decision |
|---|---|---|---|---|---|---|---|
`
  await fs.writeFile(path.join(slugDir, 'assumptions.md'), assumptionsMd, 'utf8')

  return c.json({ ok: true, dir: slugDir })
})

// ── Preview (serve HTML artifacts) ──────────────────────────────────────────

app.get('/preview/:slug/*', async (c) => {
  const { slug } = c.req.param()
  const subPath = c.req.path.replace(`/preview/${slug}/`, '')
  const config = await readConfig()

  for (const root of config.workspaceRoots) {
    const filePath = path.join(root, 'dashes', slug, subPath)
    if (!isAllowedPath(filePath, config.workspaceRoots)) {
      return c.text('Access denied', 403)
    }
    try {
      const content = await fs.readFile(filePath, 'utf8')
      const ext = path.extname(filePath)
      const mimeMap: Record<string, string> = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
      }
      return new Response(content, {
        headers: { 'Content-Type': mimeMap[ext] ?? 'text/plain' },
      })
    } catch {
      continue
    }
  }

  return c.text('Not found', 404)
})

// ── Open in Finder ───────────────────────────────────────────────────────────

app.post('/api/workshops/:slug/open', async (c) => {
  const { slug } = c.req.param()
  const config = await readConfig()
  const workshop = await findWorkshop(slug, config)
  if (!workshop) return c.json({ error: 'Not found' }, 404)

  if (process.platform === 'darwin') {
    execSync(`open "${workshop.dir}"`)
  }
  return c.json({ ok: true })
})

// ── Validate workspace path ──────────────────────────────────────────────────

app.post('/api/validate-workspace', async (c) => {
  const { path: p } = await c.req.json<{ path: string }>()
  const resolved = p.replace(/^~/, os.homedir())
  try {
    await fs.access(path.join(resolved, 'dashes'))
    return c.json({ valid: true, resolved })
  } catch {
    return c.json({ valid: false, resolved })
  }
})

// ── Helpers ──────────────────────────────────────────────────────────────────

async function findWorkshop(
  slug: string,
  config: ConsoleConfig
): Promise<Awaited<ReturnType<typeof scanWorkshop>> | null> {
  for (const root of config.workspaceRoots) {
    const slugDir = path.join(root, 'dashes', slug)
    if (!isAllowedPath(slugDir, config.workspaceRoots)) continue
    try {
      await fs.access(slugDir)
      return await scanWorkshop(slugDir, root)
    } catch {
      continue
    }
  }
  return null
}

// ── Start ────────────────────────────────────────────────────────────────────

const PORT = 8787

serve({ fetch: app.fetch, hostname: '127.0.0.1', port: PORT }, (info) => {
  console.log(`Dash Console API: http://${info.address}:${info.port}`)
})
