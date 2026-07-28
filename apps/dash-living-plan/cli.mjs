#!/usr/bin/env node
/**
 * dash-living-plan CLI
 *
 * Commands:
 *   serve    --dir <path> [--open]
 *   check    --dir <path>
 *   export   --dir <path>
 *   seed     --dir <path> --slug <s> [--tier <t>] [--session-mode <m>]
 *   retro    add    --dir <workshopDir> --severity <high|medium|low>
 *                   --phase <P0-P8|cross-cutting> --status <open|fixed|wont-fix>
 *                   --summary <text> [--fix-commit <sha>]
 *   retro    report [--workspace <dir>]
 *   index           [--workspace <dir>]
 *   learning-close  check  [--workspace <dir>]
 *   learning-close  record --dir <workshopDir> --owner <name> --due <YYYY-MM-DD>
 *                          --test-ran <true|false> [--assumptions-validated <n>]
 *   scaffold <artifact>    --dir <workshopDir> [--force]
 */

import path from 'path'
import fs from 'fs'
import net from 'net'
import { fileURLToPath } from 'url'
import { parseArgs } from 'util'
import { spawn } from 'child_process'
import { parse as parseYaml, stringify as stringifyYaml, parseDocument as parseYamlDocument } from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TODAY = new Date().toISOString().slice(0, 10)

const { values: args, positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  options: {
    // existing
    dir:            { type: 'string' },
    slug:           { type: 'string' },
    tier:           { type: 'string' },
    'session-mode': { type: 'string' },
    open:           { type: 'boolean', default: false },
    help:           { type: 'boolean', short: 'h', default: false },
    // retro add
    severity:       { type: 'string' },
    phase:          { type: 'string' },
    status:         { type: 'string' },
    summary:        { type: 'string' },
    'fix-commit':   { type: 'string' },
    // index + retro report + learning-close check
    workspace:      { type: 'string' },
    // learning-close record
    owner:          { type: 'string' },
    due:            { type: 'string' },
    'test-ran':     { type: 'string' },
    'assumptions-validated': { type: 'string' },
    // scaffold
    force:          { type: 'boolean', default: false },
    // tier
    answers:        { type: 'string' },
  },
})

const TIERS = ['express', 'standard', 'high-stakes']
const SESSION_MODES = ['interactive', 'solo']
const DEFAULT_TIER = 'standard'
const DEFAULT_SESSION_MODE = 'interactive'

const SCAFFOLD_ARTIFACTS = ['edge-state-matrix', 'assumptions', 'sign-off-ledger', 'glossary', 'metrics', 'research-plan']
const TEMPLATE_MAP = {
  'edge-state-matrix': 'edge-state-matrix.md',
  'assumptions':       'assumptions.md',
  'sign-off-ledger':   'sign-off-ledger.md',
  'glossary':          'glossary.md',
  'metrics':           'metrics.md',
  'research-plan':     'ux-research-plan.md',
}

const command = positionals[0]
const subcommand = positionals[1]

if (args.help || !command) {
  console.log(`
dash-living-plan CLI

Commands:
  serve --dir <living-plan-dir> [--open]
  check --dir <living-plan-dir>
  export --dir <living-plan-dir>
  seed  --dir <workshop-dir> --slug <slug> [--tier <tier>] [--session-mode <mode>]

  retro add    --dir <workshop-dir> --severity <high|medium|low>
               --phase <P0-P8|cross-cutting> --status <open|fixed|wont-fix>
               --summary <text> [--fix-commit <sha>]
  retro report [--workspace <dir>]

  index        [--workspace <dir>]

  learning-close check  [--workspace <dir>]
  learning-close record --dir <workshop-dir> --owner <name> --due <YYYY-MM-DD>
                        --test-ran <true|false> [--assumptions-validated <n>]

  scaffold <artifact> --dir <workshop-dir> [--force]
    artifacts: ${SCAFFOLD_ARTIFACTS.join(' | ')}

  status  --dir <workshop-dir>
  lint    --dir <workshop-dir>
  tier    --dir <workshop-dir> --answers <json-file>

seed options:
  --tier          ${TIERS.join(' | ')}   (default: ${DEFAULT_TIER})
  --session-mode  ${SESSION_MODES.join(' | ')}   (default: ${DEFAULT_SESSION_MODE})
`)
  process.exit(0)
}

const resolveDir = (d) => {
  if (!d) {
    console.error('ERROR: --dir is required')
    process.exit(1)
  }
  return path.resolve(d)
}

const resolveWorkspace = (w) => path.resolve(w || process.cwd())

/** Prefer `dashes/` (OSS); fall back to `docs/workshops/` for older layouts. */
function resolveDashesDir(workspaceDir, { required = true } = {}) {
  const primary = path.join(workspaceDir, 'dashes')
  if (fs.existsSync(primary)) return primary
  const legacy = path.join(workspaceDir, 'docs', 'workshops')
  if (fs.existsSync(legacy)) return legacy
  if (required) {
    console.error(`ERROR: No dashes directory found at ${primary}`)
    process.exit(1)
  }
  return null
}

// ─── serve ────────────────────────────────────────────────────────────────────

/**
 * Serve one workshop's living plan.
 *
 * Two servers: Hono for the API, Vite for the UI. A dash workspace holds many
 * workshops, and a designer reviewing one while an agent runs another is normal,
 * so neither port can be assumed. Each server asks for an OS-assigned port (0),
 * reports the port it actually bound into the plan directory, and nothing is
 * printed until both have: a URL guessed before the bind is worse than no URL,
 * because the browser then shows a different workshop's plan and looks healthy
 * doing it.
 */
async function serve(planDir, openBrowser) {
  planDir = resolveDir(planDir)

  if (!fs.existsSync(planDir)) {
    console.warn(`WARN: plan dir not found: ${planDir}. Skipping viewer.`)
    process.exit(0)
  }

  const apiPortFile = path.join(planDir, '.api-port')
  const uiPortFile = path.join(planDir, '.ui-port')
  for (const file of [apiPortFile, uiPortFile]) fs.rmSync(file, { force: true })

  const childEnv = { ...process.env, DASH_LIVING_PLAN_DIR: planDir }

  // API first, on an OS-assigned port, so Vite's proxy can be pointed at the
  // real one rather than a hardcoded guess.
  const serverProc = spawn('npx', ['tsx', path.join(__dirname, 'server/index.ts')], {
    cwd: __dirname,
    env: { ...childEnv, DASH_LIVING_PLAN_API_PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  serverProc.stdout?.on('data', (buf) => process.stdout.write(buf))
  serverProc.stderr?.on('data', (buf) => process.stderr.write(buf))
  serverProc.on('error', (err) => {
    console.warn(`WARN: API server failed to start: ${err.message}. Continuing without viewer.`)
  })

  const apiPort = await waitForPortFile(apiPortFile)
  if (!apiPort) {
    serverProc.kill()
    console.warn('\nWARN: living-plan API did not start. Viewer unavailable — continue the dash in chat.\n')
    return
  }

  // Pre-bind a free port and pass it explicitly. Vite treats `port: 0` as
  // "use the default (5173)" in some versions, which reintroduces collisions
  // when 5173 is free but another workshop already owns a different viewer
  // (Dash 5 finding). A real ephemeral bind here is unambiguous.
  const uiPortReserved = await reserveFreePort()
  const viteProc = spawn('npx', ['vite'], {
    cwd: __dirname,
    env: {
      ...childEnv,
      DASH_LIVING_PLAN_API_PORT: String(apiPort),
      DASH_LIVING_PLAN_UI_PORT: String(uiPortReserved),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  // Surface real errors; suppress Vite's own Local URL (CLI prints the bound one).
  viteProc.stdout?.on('data', (buf) => {
    const s = buf.toString()
    if (/Local:\s+http/i.test(s) || /ready in \d/i.test(s)) return
    process.stdout.write(buf)
  })
  viteProc.stderr?.on('data', (buf) => process.stderr.write(buf))
  viteProc.on('error', (err) => {
    console.warn(`WARN: vite failed to start: ${err.message}. Continuing without viewer.`)
  })

  const cleanup = () => {
    serverProc.kill()
    viteProc.kill()
    process.exit(0)
  }
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  const uiPort = await waitForPortFile(uiPortFile)
  if (!uiPort) {
    console.warn('\nWARN: living-plan UI did not start. Viewer unavailable — continue the dash in chat.\n')
    return
  }

  const url = `http://127.0.0.1:${uiPort}`
  fs.writeFileSync(path.join(planDir, '.living-plan-url'), url, 'utf8')

  const slug = path.basename(path.dirname(planDir))
  console.log(`\nDash Living Plan: ${url}   → ${slug}   (API ${apiPort})`)
  console.log(`URL written to: ${path.join(planDir, '.living-plan-url')}\n`)

  if (openBrowser) {
    try {
      const { default: open } = await import('open')
      await open(url)
    } catch {
      console.warn(`WARN: Could not open browser. Visit ${url} manually.`)
    }
  }
}

/**
 * Wait for a child to report its bound port. Reading the port back from the
 * process that owns it is the only way to be sure the URL belongs to this plan.
 */
async function waitForPortFile(file, timeoutMs = 45000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (fs.existsSync(file)) {
      const port = Number(fs.readFileSync(file, 'utf8').trim())
      if (Number.isInteger(port) && port > 0) return port
    }
    await new Promise(r => setTimeout(r, 250))
  }
  return null
}

/** Bind ephemeral port 0, close, return the number for a child to re-bind. */
function reserveFreePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer()
    s.listen(0, '127.0.0.1', () => {
      const addr = s.address()
      const port = typeof addr === 'object' && addr ? addr.port : 0
      s.close((err) => (err ? reject(err) : resolve(port)))
    })
    s.on('error', reject)
  })
}

// ─── check ────────────────────────────────────────────────────────────────────

async function check(planDir) {
  planDir = resolveDir(planDir)
  const { runCheck } = await import('./check.mjs')
  const result = runCheck(planDir)
  if (!result.ok) {
    console.error(`\n❌ check failed:\n${result.errors.join('\n')}\n`)
    process.exit(1)
  }
  console.log(`\n✓ check passed (${result.warnings.length} warning(s))\n`)
  if (result.warnings.length) console.warn(result.warnings.join('\n'))
}

// ─── export ───────────────────────────────────────────────────────────────────

async function exportPlan(planDir) {
  planDir = resolveDir(planDir)

  const { runCheck } = await import('./check.mjs')
  const result = runCheck(planDir)
  if (!result.ok) {
    console.error(`\n❌ export aborted: check failed\n${result.errors.join('\n')}\n`)
    process.exit(1)
  }

  const { runExport } = await import('./export.mjs')
  await runExport(planDir)
  console.log('\n✓ export complete\n')
}

// ─── seed ─────────────────────────────────────────────────────────────────────

async function seed(workshopDir, slug, tierFlag, sessionModeFlag) {
  workshopDir = resolveDir(workshopDir)
  if (!slug) {
    console.error('ERROR: --slug is required for seed')
    process.exit(1)
  }

  const templateDir = path.join(__dirname, '../../templates/living-plan')
  if (!fs.existsSync(templateDir)) {
    console.error(`ERROR: template not found at ${templateDir}`)
    process.exit(1)
  }

  const destDir = path.join(workshopDir, 'living-plan')
  if (fs.existsSync(destDir)) {
    console.warn(`WARN: ${destDir} already exists. Skipping seed.`)
    process.exit(0)
  }

  const config = readDashConfig(workshopDir)
  const tier = resolveSeedValue('tier', tierFlag, config.tier, TIERS, DEFAULT_TIER)
  const sessionMode = resolveSeedValue('session-mode', sessionModeFlag, config.sessionMode, SESSION_MODES, DEFAULT_SESSION_MODE)

  fs.mkdirSync(destDir, { recursive: true })
  copyDir(templateDir, destDir, {
    SLUG: slug,
    TIER: tier.value,
    SESSION_MODE: sessionMode.value,
  })

  console.log(`\n✓ Living plan seeded at ${destDir}`)
  console.log(`  tier:         ${tier.value} (from ${tier.source})`)
  console.log(`  session mode: ${sessionMode.value} (from ${sessionMode.source})\n`)
  console.log(`  Next: node ${path.relative(process.cwd(), path.join(__dirname, 'cli.mjs'))} serve --dir ${destDir} --open\n`)
}

// ─── retro add ────────────────────────────────────────────────────────────────

async function retroAdd(workshopDir, { severity, phase, status, summary, fixCommit }) {
  workshopDir = resolveDir(workshopDir)

  const SEVERITIES = ['high', 'medium', 'low']
  const STATUSES = ['open', 'fixed', 'wont-fix']

  if (!severity || !SEVERITIES.includes(severity)) {
    console.error(`ERROR: --severity must be one of: ${SEVERITIES.join(', ')}`)
    process.exit(1)
  }
  if (!phase) {
    console.error('ERROR: --phase is required (e.g. P0, P2, cross-cutting)')
    process.exit(1)
  }
  if (!status || !STATUSES.includes(status)) {
    console.error(`ERROR: --status must be one of: ${STATUSES.join(', ')}`)
    process.exit(1)
  }
  if (!summary) {
    console.error('ERROR: --summary is required')
    process.exit(1)
  }

  const dashSlug = path.basename(workshopDir)
  const retroPath = path.join(workshopDir, 'retro.yaml')

  let retro = { findings: [] }
  if (fs.existsSync(retroPath)) {
    retro = parseYaml(fs.readFileSync(retroPath, 'utf8')) || { findings: [] }
    if (!retro.findings) retro.findings = []
  }

  const seq = String(retro.findings.length + 1).padStart(3, '0')
  const id = `${dashSlug}-${seq}`

  const finding = {
    id,
    dash: dashSlug,
    severity,
    phase,
    status,
    summary,
    fix_commit: fixCommit || null,
    created: TODAY,
  }

  retro.findings.push(finding)
  fs.writeFileSync(retroPath, stringifyYaml(retro))

  console.log(`\n✓ Added finding ${id} to ${retroPath}`)
  console.log(`  severity: ${severity}`)
  console.log(`  phase:    ${phase}`)
  console.log(`  status:   ${status}`)
  console.log(`  summary:  ${summary}\n`)
}

// ─── retro report ─────────────────────────────────────────────────────────────

async function retroReport(workspaceDir) {
  workspaceDir = resolveWorkspace(workspaceDir)
  const workshopsDir = resolveDashesDir(workspaceDir, { required: false })

  if (!workshopsDir) {
    console.log(`No dashes directory found under ${workspaceDir}`)
    return
  }

  const allFindings = []
  const dirs = fs.readdirSync(workshopsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => path.join(workshopsDir, d.name))

  for (const workshopDir of dirs) {
    const retroPath = path.join(workshopDir, 'retro.yaml')
    if (!fs.existsSync(retroPath)) continue
    const retro = parseYaml(fs.readFileSync(retroPath, 'utf8'))
    if (!retro?.findings?.length) continue
    allFindings.push(...retro.findings)
  }

  if (!allFindings.length) {
    console.log('No findings found.')
    return
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const open = allFindings.filter(f => f.status === 'open')
  const recentlyFixed = allFindings.filter(
    f => f.status === 'fixed' && f.fix_commit && f.created >= thirtyDaysAgo
  )
  const wontFix = allFindings.filter(f => f.status === 'wont-fix')

  const sevLabel = { high: 'HIGH', medium: 'MED ', low: 'LOW ' }
  const pad = (s, n) => String(s).padEnd(n)

  const openHigh = open.filter(f => f.severity === 'high').length
  const openMed  = open.filter(f => f.severity === 'medium').length
  const openLow  = open.filter(f => f.severity === 'low').length

  console.log(`\nRetro report — ${TODAY}`)
  console.log(`${'─'.repeat(70)}`)

  if (open.length) {
    console.log(`\nOpen findings (${open.length}):`)
    for (const f of open) {
      const sev = sevLabel[f.severity] || f.severity.toUpperCase().padEnd(4)
      const id  = pad(f.id, 44)
      const ph  = pad(f.phase, 14)
      const summary = f.summary.length > 60 ? f.summary.slice(0, 57) + '...' : f.summary
      console.log(`  ${sev}  ${id}  ${ph}  "${summary}"`)
    }
  } else {
    console.log('\nOpen findings: none')
  }

  if (recentlyFixed.length) {
    console.log(`\nFixed in last 30 days (${recentlyFixed.length}):`)
    for (const f of recentlyFixed) {
      const sev = sevLabel[f.severity] || f.severity.toUpperCase().padEnd(4)
      const id  = pad(f.id, 44)
      const ph  = pad(f.phase, 14)
      const summary = f.summary.length > 60 ? f.summary.slice(0, 57) + '...' : f.summary
      const sha = f.fix_commit ? ` [${f.fix_commit.slice(0, 7)}]` : ''
      console.log(`  ${sev}  ${id}  ${ph}  "${summary}"${sha}`)
    }
  }

  if (wontFix.length) {
    console.log(`\nWon't fix (${wontFix.length}):`)
    for (const f of wontFix) {
      const sev = sevLabel[f.severity] || f.severity.toUpperCase().padEnd(4)
      const summary = f.summary.length > 60 ? f.summary.slice(0, 57) + '...' : f.summary
      console.log(`  ${sev}  ${f.id}  ${f.phase}  "${summary}"`)
    }
  }

  console.log(`\nTotals: ${open.length} open (${openHigh} high, ${openMed} med, ${openLow} low) | ${recentlyFixed.length} fixed in 30d | ${wontFix.length} won't-fix\n`)
}

// ─── dash index ───────────────────────────────────────────────────────────────

async function dashIndex(workspaceDir) {
  workspaceDir = resolveWorkspace(workspaceDir)
  const dashesDir = resolveDashesDir(workspaceDir)

  const dirs = fs.readdirSync(dashesDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => ({ name: d.name, fullPath: path.join(dashesDir, d.name) }))

  const workshops = []

  for (const { name: slug, fullPath: workshopDir } of dirs) {
    const configPath = path.join(workshopDir, 'dash-config.yaml')
    if (!fs.existsSync(configPath)) continue

    const configText = fs.readFileSync(configPath, 'utf8')
    const tier         = readYamlScalar(configText, ['dash_tier', 'dash-tier', 'tier']) || 'unknown'
    const sessionMode  = readYamlScalar(configText, ['session-mode', 'session_mode', 'sessionMode']) || 'unknown'
    const dashName     = readYamlScalar(configText, ['dash-name', 'dash_name']) || slug

    const { currentPhase, gatesByName } = readLivingPlanProgress(workshopDir)

    // hub object: try dash-config.yaml hub_object, then scope.md
    let hubObject = readYamlScalar(configText, ['hub_object', 'hub-object', 'hub_obj']) || null
    if (!hubObject) {
      const scopePath = path.join(workshopDir, 'scope.md')
      if (fs.existsSync(scopePath)) {
        const scopeText = fs.readFileSync(scopePath, 'utf8')
        const m = scopeText.match(/\*\*Hub object[:\*]+\*\*\s*([^\n]+)/i)
          || scopeText.match(/hub[_-]?object\s*:\s*([^\n]+)/i)
        if (m) hubObject = m[1].trim().replace(/`/g, '').split(/[,\s]/)[0] || null
      }
    }

    // which artifact files are present
    const KNOWN_ARTIFACTS = [
      'assumptions.md', 'metrics.md', 'scope.md', 'design-spec.md', 'flow.md',
      'ethics-review.md', 'ethics-equity-checklist.md', 'edge-state-matrix.md',
      'sign-off-ledger.md', 'glossary.md', 'research-plan.md', 'p7-build-note.md',
      'auto-confirms.md', 'workshop-summary.md', 'wireframe.html', 'pitch/index.html',
    ]
    const artifactsPresent = KNOWN_ARTIFACTS.filter(f => fs.existsSync(path.join(workshopDir, f)))

    const completed = currentPhase === 'P8'
      && artifactsPresent.includes('pitch/index.html')
      && artifactsPresent.includes('workshop-summary.md')

    workshops.push({
      slug,
      dash_name:      dashName,
      tier,
      session_mode:   sessionMode,
      current_phase:  currentPhase,
      hub_object:     hubObject,
      artifacts_present: artifactsPresent,
      gates: gatesByName,
      completed,
    })
  }

  const index = {
    generated: new Date().toISOString(),
    workshops,
  }

  const outPath = path.join(dashesDir, '_index.json')
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2))
  console.log(`\n✓ Index written to ${outPath}`)
  console.log(`  ${workshops.length} workshop(s) indexed\n`)
  for (const w of workshops) {
    const gates = Object.entries(w.gates).map(([k, v]) => `${k}: ${v}`).join(', ') || 'none'
    console.log(`  ${w.slug}`)
    console.log(`    tier=${w.tier} phase=${w.current_phase || '?'} completed=${w.completed}`)
    console.log(`    gates: ${gates}`)
  }
  console.log()
}

// ─── learning-close check ─────────────────────────────────────────────────────

async function learningCloseCheck(workspaceDir) {
  workspaceDir = resolveWorkspace(workspaceDir)
  const workshopsDir = resolveDashesDir(workspaceDir)

  const dirs = fs.readdirSync(workshopsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => ({ name: d.name, fullPath: path.join(workshopsDir, d.name) }))

  const items = []

  for (const { name: slug, fullPath: workshopDir } of dirs) {
    const configPath = path.join(workshopDir, 'dash-config.yaml')
    if (!fs.existsSync(configPath)) continue
    const configText = fs.readFileSync(configPath, 'utf8')
    const tier = readYamlScalar(configText, ['dash_tier', 'dash-tier', 'tier']) || 'standard'

    // scan research-plan.md for learning_close yaml block
    const rpPath = path.join(workshopDir, 'research-plan.md')
    if (!fs.existsSync(rpPath)) continue

    const rpText = fs.readFileSync(rpPath, 'utf8')
    const lcBlock = extractYamlBlock(rpText, 'learning_close')
    if (!lcBlock) continue

    let lc
    try {
      lc = parseYaml(lcBlock)?.learning_close || parseYaml(lcBlock)
    } catch {
      lc = {}
    }

    const owner    = lc?.owner || lc?.learning_close?.owner || null
    const deadline = lc?.deadline || lc?.due_date || lc?.learning_close?.deadline || null
    const testRan  = lc?.test_ran ?? lc?.learning_close?.test_ran ?? null
    const status   = lc?.status  || lc?.learning_close?.status   || null

    // determine state
    let state
    if (status === 'complete' || testRan === true || testRan === 'true') {
      state = 'complete'
    } else if (!owner || owner.toLowerCase().includes('unassigned')) {
      state = 'unassigned'
    } else if (!deadline || deadline.toLowerCase().includes('unassigned')) {
      state = 'unassigned'
    } else if (deadline <= TODAY) {
      state = 'overdue'
    } else {
      state = 'on-track'
    }

    items.push({ slug, tier, owner, deadline, testRan, state })

    // also scan assumptions.md for debt rows with due-by
    const aPath = path.join(workshopDir, 'assumptions.md')
    if (fs.existsSync(aPath)) {
      const aText = fs.readFileSync(aPath, 'utf8')
      const debtRows = aText.split('\n').filter(line =>
        line.includes('debt') && line.includes('|')
      )
      for (const row of debtRows) {
        const cols = row.split('|').map(c => c.trim()).filter(Boolean)
        const dueByCols = cols.filter(c => /^\d{4}-\d{2}-\d{2}$/.test(c))
        if (dueByCols.length) {
          const dueBy = dueByCols[0]
          const debtState = dueBy <= TODAY ? 'overdue' : 'on-track'
          items.push({
            slug,
            tier,
            owner: 'assumption debt',
            deadline: dueBy,
            testRan: null,
            state: debtState,
            note: `assumptions.md debt row due ${dueBy}`,
          })
        }
      }
    }
  }

  if (!items.length) {
    console.log(`\nLearning-close SLA report — ${TODAY}\n\nNo learning-close records found.\n`)
    return
  }

  const counts = { unassigned: 0, overdue: 0, 'on-track': 0, complete: 0 }
  for (const item of items) counts[item.state] = (counts[item.state] || 0) + 1

  console.log(`\nLearning-close SLA report — ${TODAY}\n`)
  for (const item of items) {
    const tierLabel = `${item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}`
    const dueLabel  = item.deadline || 'TBD'
    console.log(`${item.slug} (${tierLabel}, due by ${dueLabel}):`)
    if (item.state === 'unassigned') {
      console.log(`  ⏳ UNASSIGNED — owner not yet set`)
    } else if (item.state === 'overdue') {
      console.log(`  ❌ OVERDUE — deadline ${item.deadline} has passed; test_ran=${item.testRan}`)
    } else if (item.state === 'on-track') {
      console.log(`  ✅ on track — owner: ${item.owner}, due: ${item.deadline}`)
    } else if (item.state === 'complete') {
      console.log(`  ✅ COMPLETE — test ran`)
    }
    if (item.note) console.log(`  note: ${item.note}`)
    console.log()
  }

  console.log(`Totals: ${counts.unassigned || 0} unassigned | ${counts.overdue || 0} overdue | ${counts['on-track'] || 0} on-track | ${counts.complete || 0} complete\n`)

  if ((counts.overdue || 0) > 0) {
    console.error('EXIT 1: overdue learning commitments found')
    process.exit(1)
  }
}

// ─── learning-close record ────────────────────────────────────────────────────

async function learningCloseRecord(workshopDir, { owner, due, testRan, assumptionsValidated }) {
  workshopDir = resolveDir(workshopDir)

  if (!owner) { console.error('ERROR: --owner is required'); process.exit(1) }
  if (!due)   { console.error('ERROR: --due is required (YYYY-MM-DD)'); process.exit(1) }

  const rpPath = path.join(workshopDir, 'research-plan.md')
  if (!fs.existsSync(rpPath)) {
    console.error(`ERROR: research-plan.md not found at ${rpPath}`)
    process.exit(1)
  }

  let rpText = fs.readFileSync(rpPath, 'utf8')
  const testRanBool = testRan === 'true'
  const status = testRanBool ? 'complete' : 'in-progress'

  const lcBlock = `\`\`\`yaml
learning_close:
  owner: "${owner}"
  deadline: "${due}"
  test_ran: ${testRanBool}
  assumptions_validated: ${assumptionsValidated || 0}
  status: ${status}
  recorded: "${TODAY}"
\`\`\``

  const existingBlock = /```ya?ml\s*\nlearning_close:[\s\S]*?```/m.test(rpText)

  if (existingBlock) {
    rpText = rpText.replace(/```ya?ml\s*\nlearning_close:[\s\S]*?```/m, lcBlock)
    console.log('\n✓ Updated existing learning_close block in research-plan.md')
  } else {
    rpText += `\n\n---\n\n## Learning-close record\n\n${lcBlock}\n`
    console.log('\n✓ Appended learning_close block to research-plan.md')
  }

  fs.writeFileSync(rpPath, rpText)
  console.log(`  owner: ${owner}`)
  console.log(`  due:   ${due}`)
  console.log(`  test_ran: ${testRanBool}`)
  if (assumptionsValidated) console.log(`  assumptions_validated: ${assumptionsValidated}`)
  console.log()
}

// ─── scaffold ─────────────────────────────────────────────────────────────────

async function dashScaffold(artifact, workshopDir, force) {
  if (!artifact) {
    console.error(`ERROR: artifact name required. One of: ${SCAFFOLD_ARTIFACTS.join(', ')}`)
    process.exit(1)
  }
  if (!SCAFFOLD_ARTIFACTS.includes(artifact)) {
    console.error(`ERROR: unknown artifact "${artifact}". One of: ${SCAFFOLD_ARTIFACTS.join(', ')}`)
    process.exit(1)
  }

  workshopDir = resolveDir(workshopDir)

  const templateFile = TEMPLATE_MAP[artifact]
  const templatePath = path.join(__dirname, '../../templates', templateFile)
  if (!fs.existsSync(templatePath)) {
    console.error(`ERROR: template not found at ${templatePath}`)
    process.exit(1)
  }

  const destFile = artifact === 'research-plan' ? 'research-plan.md' : `${artifact}.md`
  const destPath = path.join(workshopDir, destFile)

  if (fs.existsSync(destPath) && !force) {
    console.error(`File already exists: ${destPath}\nUse --force to overwrite.`)
    process.exit(1)
  }

  // read dash-config.yaml
  const configPath = path.join(workshopDir, 'dash-config.yaml')
  const configText = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : ''
  const dashName  = readYamlScalar(configText, ['dash-name', 'dash_name']) || path.basename(workshopDir)
  const dashId    = readYamlScalar(configText, ['dash-id', 'dash_id'])     || ''
  const owner     = readYamlScalar(configText, ['owner'])                   || ''
  const tier      = readYamlScalar(configText, ['dash_tier', 'dash-tier', 'tier']) || 'Standard'
  const slug      = path.basename(workshopDir)

  let content = fs.readFileSync(templatePath, 'utf8')

  // standard substitutions
  content = content
    .replace(/<!-- dash-name -->/g, dashName)
    .replace(/<!-- scope\.md dash_id -->/g, dashId)
    .replace(/<!-- designer -->/g, owner)
    .replace(/<!-- name -->/g, owner)
    .replace(/<!-- BI \/ design-ops owner -->/g, owner)
    .replace(/<!-- content designer or design lead -->/g, owner)
    .replace(/Express \/ Standard \/ High-stakes/g, capitalise(tier))
    .replace(/YYYY-MM-DD/g, TODAY)

  // artifact-specific seeding
  if (artifact === 'edge-state-matrix') {
    content = seedEdgeStateMatrix(content, workshopDir)
  } else if (artifact === 'glossary') {
    content = seedGlossary(content, workshopDir)
  } else if (artifact === 'sign-off-ledger') {
    content = seedSignOffLedger(content, tier)
  }

  fs.writeFileSync(destPath, content)
  console.log(`\n✓ Scaffolded ${destPath}`)
  console.log(`  artifact: ${artifact}`)
  console.log(`  dash:     ${dashName} (${dashId})`)
  console.log(`  tier:     ${tier}`)
  if (force) console.log('  (--force: overwrote existing file)')
  console.log()
}

function capitalise(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function seedEdgeStateMatrix(content, workshopDir) {
  const flowPath = path.join(workshopDir, 'flow.md')
  if (!fs.existsSync(flowPath)) return content

  const flowText = fs.readFileSync(flowPath, 'utf8')
  const pages = parsePageListFromFlow(flowText)
  if (!pages.length) return content

  const PLACEHOLDER_ROW =
    '| <!-- Page or view name --> | <!-- What is shown when there is no content yet. Must include: what\'s missing + why + primary action. Wireframe ref: --> | <!-- Skeleton / spinner / progressive reveal strategy. Wireframe ref: --> | <!-- Named failure + recoverable? + next step. Not "Something went wrong." Wireframe ref: --> | <!-- What the user sees when they lack access. Does not reveal protected data. Wireframe ref: --> | <!-- Behavior at realistic scale (30 students, 500 assignments, district roster). Does the UI degrade? Pagination, truncation, virtualization strategy. Wireframe ref: --> | <!-- What a single row/item shows when the data behind it is insufficient, stale, or low-confidence while the rest of the view is fine. Must include: the threshold that triggers it + the label shown + what is deliberately NOT shown. Wireframe ref: --> |'

  const CELL = '<!-- fill --> |'
  const newRows = pages.map(p =>
    `| ${p} | ${CELL} ${CELL} ${CELL} ${CELL} ${CELL} ${CELL}`
  ).join('\n')

  return content.replace(PLACEHOLDER_ROW, newRows)
}

function parsePageListFromFlow(flowText) {
  const pageListMatch = flowText.match(/## Page List([\s\S]*?)(?=\n## |\n---|\n#[^#]|$)/)
  if (!pageListMatch) return []

  const section = pageListMatch[1]
  const rows = section.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---|'))
  const pages = []

  for (const row of rows) {
    const cols = row.split('|').map(c => c.trim()).filter(Boolean)
    if (!cols.length || cols[0].toLowerCase().includes('page') || cols[0].toLowerCase().includes('hub')) continue
    if (cols[0] && !cols[0].startsWith('<!--')) {
      pages.push(cols[0])
    }
  }
  return pages
}

function seedGlossary(content, workshopDir) {
  const scopePath = path.join(workshopDir, 'scope.md')
  if (!fs.existsSync(scopePath)) return content

  const scopeText = fs.readFileSync(scopePath, 'utf8')
  const slugs = extractObjectSlugs(scopeText)
  if (!slugs.length) return content

  const PLACEHOLDER_ROW =
    '| <!-- Human-readable term used in documentation and internal communication --> | <!-- Slug from the object library (e.g. `class`, `assignment`) --> | <!-- TypeScript / API identifier (e.g. `ClassEntity`, `assignment_id`) --> | <!-- Exact label as it appears in the UI --> | <!-- content designer or domain owner --> | <!-- Semver patch bump when the label changes --> | <!-- Record any divergence from the library object with rationale --> |'

  const newRows = slugs.map(s =>
    `| ${s} | \`${s}\` | <!-- code identifier --> | <!-- ui label --> | <!-- owner --> | 0.1.0 | |`
  ).join('\n')

  return content.replace(PLACEHOLDER_ROW, `${newRows}\n${PLACEHOLDER_ROW}`)
}

function extractObjectSlugs(text) {
  const slugSet = new Set()
  // backtick-quoted slug-looking words (lowercase, hyphens, 3-40 chars, no dots/slashes)
  const re = /`([a-z][a-z0-9-]{1,38})`/g
  let m
  while ((m = re.exec(text)) !== null) {
    const candidate = m[1]
    // filter out common non-slug words and markdown artifacts
    if (/^(md|yaml|html|json|mjs|ts|tsx|js|css)$/.test(candidate)) continue
    if (/^\d/.test(candidate)) continue
    if (candidate.length < 3) continue
    slugSet.add(candidate)
  }
  return [...slugSet].slice(0, 20)
}

function seedSignOffLedger(content, tier) {
  const tierNorm = tier.toLowerCase().replace(/\s+/g, '-')
  const isHighStakes = tierNorm === 'high-stakes'
  const note = isHighStakes
    ? '<!-- High-stakes: all Responsible rows must be ✅ real before P8 completes -->'
    : tierNorm === 'express'
    ? '<!-- Express: minimum gate P6 only; simulation floor accepted for all disciplines -->'
    : '<!-- Standard: simulation accepted as floor; target real sign-off for Responsible rows -->'
  return content + `\n${note}\n`
}

// ─── living-plan progress (shared by status + index) ──────────────────────────

/**
 * Read PhaseSection status + GateStatus results from living-plan/phases/*.mdx.
 * Phase: prefer highest in-progress, else highest done, else meta.yaml, else null.
 * Gates: keyed by canonical gate name (GATE_LABELS); aliases normalized.
 * Last non-pending result wins per gate (matches /api/phases rollup).
 */
function readLivingPlanProgress(workshopDir) {
  const phasesDir = path.join(workshopDir, 'living-plan', 'phases')
  const phaseStatuses = {} // P0 → placeholder|in-progress|done|…
  const gatesByName = {}  // Evidence Gate → pass|debt|…

  if (fs.existsSync(phasesDir)) {
    const phaseFiles = fs.readdirSync(phasesDir).filter(f => /^p\d+\.mdx$/i.test(f)).sort()
    for (const pf of phaseFiles) {
      const text = fs.readFileSync(path.join(phasesDir, pf), 'utf8')
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
        .replace(/```[\s\S]*?```/g, '')

      const section = text.match(/<PhaseSection\b([\s\S]*?)>/)
      if (section) {
        const idMatch = section[1].match(/\bid\s*=\s*["']([^"']+)["']/)
          || section[1].match(/\bid\s*=\s*\{["']([^"']+)["']\}/)
        const statusMatch = section[1].match(/\bstatus\s*=\s*["']([^"']+)["']/)
          || section[1].match(/\bstatus\s*=\s*\{["']([^"']+)["']\}/)
        const id = (idMatch?.[1] || pf.replace(/\.mdx$/i, '')).toUpperCase()
        phaseStatuses[id] = statusMatch?.[1] || 'placeholder'
      }

      const gateRe = /<GateStatus\b([\s\S]*?)(?:\/>|>)/g
      let g
      while ((g = gateRe.exec(text)) !== null) {
        const props = g[1]
        const name = (props.match(/\bname\s*=\s*["']([^"']+)["']/) || [])[1]
        const result = (props.match(/\bresult\s*=\s*["']([^"']+)["']/) || [])[1] || 'pending'
        if (!name) continue
        const existing = gatesByName[name]
        if (!existing || result !== 'pending') gatesByName[name] = result
      }
    }
  }

  let metaPhase = null
  const metaPath = path.join(workshopDir, 'living-plan', 'meta.yaml')
  if (fs.existsSync(metaPath)) {
    metaPhase = readYamlScalar(fs.readFileSync(metaPath, 'utf8'), ['currentPhase', 'current_phase', 'current-phase'])
  }

  // Also honour plan.mdx DashShell currentPhase when meta is stale
  let shellPhase = null
  const planMdx = path.join(workshopDir, 'living-plan', 'plan.mdx')
  if (fs.existsSync(planMdx)) {
    const m = fs.readFileSync(planMdx, 'utf8').match(/\bcurrentPhase\s*=\s*["']([^"']+)["']/)
    if (m) shellPhase = m[1]
  }

  const order = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']
  let currentPhase = null
  for (const id of order) {
    if (phaseStatuses[id] === 'in-progress') currentPhase = id
  }
  if (!currentPhase) {
    for (const id of order) {
      if (phaseStatuses[id] === 'done' || phaseStatuses[id] === 'complete') currentPhase = id
    }
  }
  if (!currentPhase) currentPhase = shellPhase || metaPhase

  return { currentPhase, phaseStatuses, gatesByName }
}

function resolveGateResult(gatesByName, canonicalLabel, canonicalGateName) {
  if (gatesByName[canonicalLabel]) return gatesByName[canonicalLabel]
  for (const [name, result] of Object.entries(gatesByName)) {
    if (canonicalGateName(name) === canonicalLabel) return result
  }
  return null
}

// ─── status ───────────────────────────────────────────────────────────────────

async function dashStatus(workshopDir) {
  workshopDir = resolveDir(workshopDir)

  const { PHASES, artifactsForPhase, requiredGates, GATE_LABELS, canonicalGateName } =
    await import('./contract/dash-contract.mjs')

  // Read dash-config.yaml
  const configPath = path.join(workshopDir, 'dash-config.yaml')
  if (!fs.existsSync(configPath)) {
    console.error(`ERROR: dash-config.yaml not found in ${workshopDir}`)
    process.exit(1)
  }
  const configText  = fs.readFileSync(configPath, 'utf8')
  const tier        = readYamlScalar(configText, ['dash_tier', 'dash-tier', 'tier']) || 'unknown'
  const dashName    = readYamlScalar(configText, ['dash-name', 'dash_name']) || path.basename(workshopDir)
  const sessionMode = readYamlScalar(configText, ['session-mode', 'session_mode', 'sessionMode']) || 'interactive'
  const owner       = readYamlScalar(configText, ['owner']) || '—'

  const { currentPhase, gatesByName } = readLivingPlanProgress(workshopDir)

  // Collect present files
  const presentFiles = new Set()
  const checkFile = (rel) => {
    if (fs.existsSync(path.join(workshopDir, rel))) presentFiles.add(rel)
  }
  checkFile('dash-config.yaml')
  checkFile('assumptions.md')
  checkFile('metrics.md')
  checkFile('scope.md')
  checkFile('design-spec.md')
  checkFile('flow.md')
  checkFile('wireframe.html')
  checkFile('ethics-review.md')
  checkFile('ethics-equity-checklist.md')
  checkFile('edge-state-matrix.md')
  checkFile('sign-off-ledger.md')
  checkFile('glossary.md')
  checkFile('research-plan.md')
  checkFile('p7-build-note.md')
  checkFile('pitch/index.html')
  checkFile('workshop-summary.md')

  const pad = (s, n) => String(s).padEnd(n)

  console.log(`\nDash status — ${path.basename(workshopDir)}`)
  console.log(`${'─'.repeat(60)}`)
  console.log(`  name:         ${dashName}`)
  console.log(`  owner:        ${owner}`)
  console.log(`  tier:         ${tier}`)
  console.log(`  session-mode: ${sessionMode}`)
  console.log(`  phase:        ${currentPhase || '(not started)'}`)

  console.log(`\nArtifacts:`)
  for (const phase of PHASES) {
    const phaseArtifacts = artifactsForPhase(phase, tier)
    if (!phaseArtifacts.length) continue
    for (const a of phaseArtifacts) {
      const present = presentFiles.has(a.file)
      const mark    = present ? '✓' : (a.required ? '✗' : '·')
      const req     = a.required ? 'required' : 'optional'
      console.log(`  ${mark} ${pad(a.file, 36)} ${pad(phase.id, 4)} ${req}`)
    }
  }

  console.log(`\nGates:`)
  const required = requiredGates(tier)
  if (required.length === 0) {
    console.log(`  (none required for ${tier})`)
  } else {
    for (const gatePhase of required) {
      const label = GATE_LABELS[gatePhase] || gatePhase
      const result = resolveGateResult(gatesByName, label, canonicalGateName) || '(not recorded)'
      const icon =
        result === 'pass' || result === '✅' ? '✅'
        : result === 'fail' || result === '❌' ? '❌'
        : result === 'debt' ? '⏳'
        : '⏳'
      console.log(`  ${icon}  ${pad(gatePhase, 4)} ${pad(label, 22)} ${result}`)
    }
  }

  console.log()
}

// ─── lint ─────────────────────────────────────────────────────────────────────

async function dashLint(workshopDir) {
  workshopDir = resolveDir(workshopDir)

  const errors   = []
  const warnings = []

  // ── 1. assumptions.md ────────────────────────────────────────────────────
  // Only the exporter-owned "## Assumptions" table is data. Legend / Register /
  // debt-log tables also contain the words "observed" and "debt" and must not
  // be linted as rows (Dash 4 finding).
  const assumptionsPath = path.join(workshopDir, 'assumptions.md')
  if (fs.existsSync(assumptionsPath)) {
    const text = fs.readFileSync(assumptionsPath, 'utf8')
    const assumptionsSection = (() => {
      const lines = text.split('\n')
      let start = -1
      for (let i = 0; i < lines.length; i++) {
        if (/^##\s+Assumptions\s*$/i.test(lines[i].trim())) { start = i + 1; break }
      }
      if (start < 0) return ''
      const out = []
      for (let i = start; i < lines.length; i++) {
        if (/^##\s+/.test(lines[i])) break
        out.push(lines[i])
      }
      return out.join('\n')
    })()
    const rows = assumptionsSection.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---|'))

    // Solo Learning Gate (p8.md): due-by may be the greppable unassigned literal
    // until a human names a date. Accept it alongside YYYY-MM-DD.
    const SOLO_DUE_BY = /^(unassigned\s*[—–-]\s*set when owner is named)$/i

    for (const row of rows) {
      const cols = row.split('|').map(c => c.trim()).filter(Boolean)
      if (cols.length < 2) continue
      // Skip header row
      if (/^id$/i.test(cols[0]) || /^statement$/i.test(cols[1] || '')) continue
      const rowText = row.toLowerCase()

      // Evidence link required for observed rows. Assumed + high confidence is
      // normal in solo dashes and must not warn (Dash 4 noise). Borrowed + high
      // still wants a citation.
      const typeCol = cols[2]?.toLowerCase() || ''
      const confCol = cols[3]?.toLowerCase() || ''
      const isObserved  = typeCol === 'observed'
      const isBorrowed  = typeCol === 'borrowed'
      const isHighConf  = confCol === 'high' || confCol === 'h'
      if (isObserved || (isBorrowed && isHighConf)) {
        // A local-vault or repo citation is a legitimate evidence link — an
        // offline dash with no Condens access has no URL to give.
        const hasEvidenceLink = cols.some(c =>
          c.startsWith('http') || c.includes('confluence') || c.includes('condens') ||
          (c.startsWith('[') && c.includes('](')) ||
          /(^|\s|\/)[\w.-]+\.(md|html|pdf|csv)(#[\w-]+)?(\s|$)/.test(c) ||
          c.includes('library/objects') || c.includes('object-library') || c.includes('renaissance-object-library') || c.includes('rofl-digest')
        )
        if (!hasEvidenceLink) {
          const snippet = cols[0]?.slice(0, 40) || row.slice(0, 40)
          warnings.push(
            `assumptions.md — row "${snippet}": type:observed (or borrowed+high) requires a non-empty evidence-link`
          )
        }
      }

      // Debt rows must have a due-by date (or the solo Learning Gate sentinel)
      const statusCol = cols[6]?.toLowerCase() || ''
      const isDebt = statusCol === 'debt' || cols.some(c => c.toLowerCase() === 'debt')
      if (isDebt) {
        const hasDueBy = cols.some(c =>
          /^\d{4}-\d{2}-\d{2}$/.test(c.trim()) || SOLO_DUE_BY.test(c.trim())
        )
        if (!hasDueBy) {
          const snippet = cols[0]?.slice(0, 40) || row.slice(0, 40)
          errors.push(
            `assumptions.md — debt row "${snippet}" is missing a due-by date (YYYY-MM-DD or solo sentinel "unassigned — set when owner is named")`
          )
        }
      }
    }
  }

  // ── 2. edge-state-matrix.md ───────────────────────────────────────────────
  const esmPath = path.join(workshopDir, 'edge-state-matrix.md')
  if (fs.existsSync(esmPath)) {
    const text = fs.readFileSync(esmPath, 'utf8')
    const rows = text.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---|'))

    // collect list/collection pages from flow.md
    let collectionPages = new Set()
    const flowPath = path.join(workshopDir, 'flow.md')
    if (fs.existsSync(flowPath)) {
      const flowText = fs.readFileSync(flowPath, 'utf8')
      const listLines = flowText.split('\n').filter(l =>
        /\blist\b|\bcollection\b|\bfeed\b|\bdashboard\b/i.test(l)
      )
      for (const line of listLines) {
        const m = line.match(/^\s*[-*]\s+(.+)|^\|\s*([^|]+)\s*\|/)
        const name = (m?.[1] || m?.[2] || '').trim().replace(/\*\*/g, '').split(' ')[0]
        if (name) collectionPages.add(name.toLowerCase())
      }
    }

    for (const row of rows) {
      const cols = row.split('|').map(c => c.trim()).filter(Boolean)
      if (cols.length < 2) continue
      // Skip header rows
      if (cols[0].toLowerCase().includes('page') || cols[0].toLowerCase().includes('view') ||
          cols[0].startsWith('<!--') || cols[0].toLowerCase() === 'page or view name') continue

      // Unfilled = HTML fill comments or truly empty. Em-dash / N/A are intentional
      // (Dash 5 finding: debt-table rows with `—` were false positives).
      const emptyCols = cols.filter(c =>
        c === '' || c.startsWith('<!-- fill') || c === '<!-- fill -->' || /^<!--\s*fill/i.test(c)
      )
      if (emptyCols.length > 0) {
        errors.push(
          `edge-state-matrix.md — row "${cols[0].slice(0, 40)}" has ${emptyCols.length} unfilled placeholder cell(s)`
        )
      }

      // Collection pages must have data-confidence column (col index 6, 0-based)
      const isCollection = collectionPages.size > 0 &&
        [...collectionPages].some(p => cols[0].toLowerCase().includes(p))
      if (isCollection && cols.length >= 7) {
        const dataConf = cols[6]
        const filled =
          dataConf &&
          !dataConf.startsWith('<!--') &&
          !/^n\/?a$/i.test(dataConf) &&
          dataConf !== '—' &&
          dataConf !== '-'
        // Allow "N/A — reason" (longer than bare N/A / em-dash)
        const naWithReason = /^n\/?a\s*[—–-]/i.test(dataConf || '')
        if (!filled && !naWithReason) {
          warnings.push(
            `edge-state-matrix.md — collection page "${cols[0].slice(0, 40)}" needs data-confidence column filled`
          )
        }
      }
    }
  }

  // ── 3. sign-off-ledger.md ─────────────────────────────────────────────────
  const signOffPath = path.join(workshopDir, 'sign-off-ledger.md')
  if (fs.existsSync(signOffPath)) {
    const configPath2 = path.join(workshopDir, 'dash-config.yaml')
    const configText2 = fs.existsSync(configPath2) ? fs.readFileSync(configPath2, 'utf8') : ''
    const tierVal = readYamlScalar(configText2, ['dash_tier', 'dash-tier', 'tier']) || ''

    if (tierVal.toLowerCase() === 'high-stakes') {
      const text = fs.readFileSync(signOffPath, 'utf8')
      const rows = text.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---|'))
      for (const row of rows) {
        const cols = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cols.length < 2) continue
        const isResponsible = cols.some(c => /\bresponsible\b/i.test(c))
        if (!isResponsible) continue
        const hasRealSignOff = cols.some(c => c.includes('✅') && /real/i.test(c))
        if (!hasRealSignOff) {
          errors.push(
            `sign-off-ledger.md — high-stakes tier: Responsible row "${cols[0].slice(0, 40)}" must be "✅ real" before P8`
          )
        }
      }
    }
  }

  // ── 4. living-plan gate consistency ──────────────────────────────────────
  const phasesDir = path.join(workshopDir, 'living-plan', 'phases')
  if (fs.existsSync(phasesDir)) {
    const phaseFiles = fs.readdirSync(phasesDir).filter(f => /^p\d/.test(f))
    for (const pf of phaseFiles) {
      const text = fs.readFileSync(path.join(phasesDir, pf), 'utf8')
      // Find gates with debt/pending result
      const re = /<GateStatus\s[^>]*name=["']([^"']+)["'][^>]*result=["']([^"']+)["'][^>]*/g
      let m
      while ((m = re.exec(text)) !== null) {
        const gateName = m[1]
        const result   = m[2]
        if (/debt|pending/i.test(result)) {
          // Check summary/pitch files for contradicting pass
          const summaryPath = path.join(workshopDir, 'workshop-summary.md')
          if (fs.existsSync(summaryPath)) {
            const summaryText = fs.readFileSync(summaryPath, 'utf8')
            // Require pass/✅ on the same line (or table row) as the gate name —
            // a summary that says "✅ Evidence" and "Learning Gate: debt" must not warn.
            const claimsPass = summaryText.split('\n').some(line =>
              line.includes(gateName) && /pass|✅/i.test(line) && !(/debt|⏳|not\s+pass|does\s+not\s+pass/i.test(line))
            )
            if (claimsPass) {
              warnings.push(
                `Gate consistency: gate "${gateName}" is "${result}" in living-plan but appears as pass/✅ in workshop-summary.md`
              )
            }
          }
        }
      }
    }
  }

  // ── 5. research-plan.md sentinel strings ─────────────────────────────────
  // Solo Learning Gate (p8.md) uses the greppable owner literal
  // "unassigned — needs human". That is debt, not a missing field — do not error.
  // Error only on empty / tbd / todo / HTML-comment placeholders.
  const rpPath = path.join(workshopDir, 'research-plan.md')
  if (fs.existsSync(rpPath)) {
    const text = fs.readFileSync(rpPath, 'utf8')
    const ownerLine = text.split('\n').find(l => /^\s*\*{0,2}owner\*{0,2}\s*:/i.test(l))
    if (ownerLine) {
      const val = ownerLine.replace(/^\s*\*{0,2}owner\*{0,2}\s*:\s*/i, '').trim().replace(/^["']|["']$/g, '')
      const SOLO_DEBT = /^unassigned\s*[—–-]\s*needs human$/i
      const PLACEHOLDERS = ['unassigned', 'tbd', 'todo', '<!-- owner -->', '<!-- name -->', '']
      if (SOLO_DEBT.test(val)) {
        warnings.push(
          `research-plan.md — owner is solo Learning Gate debt ("${val}"). Gate must not be reported as pass.`
        )
      } else if (PLACEHOLDERS.some(p => val.toLowerCase() === p)) {
        errors.push(
          `research-plan.md — "owner:" field contains placeholder text "${val}". Set a real owner name, or the solo debt literal "unassigned — needs human".`
        )
      }
    }
  }

  // ── Report ────────────────────────────────────────────────────────────────
  const slug = path.basename(workshopDir)
  console.log(`\nLint: ${slug}`)
  console.log(`${'─'.repeat(60)}`)

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`✓ clean — no issues found\n`)
    return
  }

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`)
    for (const e of errors) console.error(`  ✗ ${e}`)
  }

  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`)
    for (const w of warnings) console.warn(`  ⚠ ${w}`)
  }

  console.log()

  if (errors.length > 0) {
    console.error(`EXIT 1: ${errors.length} error(s) found — fix before writing artifacts`)
    process.exit(1)
  }
}

// ─── tier ─────────────────────────────────────────────────────────────────────

/**
 * Tier trigger questions (from dash-config.yaml comments, req §12.12.1):
 *   T1 new disclosure of identifiable student data         → high-stakes
 *   T2 grading / enrollment / payment / assessment-scoring  → high-stakes
 *   T3 reach ≥ 10,000 users OR ≥ 100 schools               → high-stakes
 *   T4 irreversible / not flag-guarded / not rollback-safe  → high-stakes
 *   T5 affects > 1 user role OR reach 500–9,999 users       → standard (minimum)
 *   T6 reach < 500, single role, reversible, flag-guarded   → express (floor)
 */
const TIER_TRIGGERS = {
  T1: { tier: 'high-stakes', rationale: 'new disclosure of identifiable student data → high-stakes' },
  T2: { tier: 'high-stakes', rationale: 'grading/enrollment/payment/assessment-scoring surface → high-stakes' },
  T3: { tier: 'high-stakes', rationale: 'reach ≥ 10,000 users or ≥ 100 schools → high-stakes' },
  T4: { tier: 'high-stakes', rationale: 'irreversible / not flag-guarded / not rollback-safe → high-stakes' },
  T5: { tier: 'standard',    rationale: 'affects >1 user role or reach 500–9,999 users → standard' },
  T6: { tier: 'express',     rationale: 'reach < 500, single role, reversible, flag-guarded → express (floor)' },
}

async function dashTier(workshopDir, answersFile) {
  workshopDir = resolveDir(workshopDir)

  if (!answersFile) {
    console.error('ERROR: --answers <json-file> is required for tier')
    process.exit(1)
  }

  const answersPath = path.resolve(answersFile)
  if (!fs.existsSync(answersPath)) {
    console.error(`ERROR: answers file not found: ${answersPath}`)
    process.exit(1)
  }

  let answers
  try {
    answers = JSON.parse(fs.readFileSync(answersPath, 'utf8'))
  } catch (err) {
    console.error(`ERROR: could not parse answers JSON: ${err.message}`)
    process.exit(1)
  }

  // Determine tier: highest trigger wins (high-stakes > standard > express)
  const TIER_RANK = { 'high-stakes': 3, 'standard': 2, 'express': 1 }
  let computedTier = 'express'
  let rationale    = TIER_TRIGGERS.T6.rationale  // default floor
  const firedTriggers = []

  for (const [key, trigger] of Object.entries(TIER_TRIGGERS)) {
    if (answers[key] === true || answers[key] === 'true') {
      firedTriggers.push(key)
      if (TIER_RANK[trigger.tier] > TIER_RANK[computedTier]) {
        computedTier = trigger.tier
        rationale    = trigger.rationale
      }
    }
  }

  // If no triggers fired, default to standard (safe baseline)
  if (firedTriggers.length === 0) {
    computedTier = 'standard'
    rationale    = 'no triggers fired → standard (safe baseline)'
  }

  const slug = path.basename(workshopDir)
  console.log(`\nTier classification — ${slug}`)
  console.log(`${'─'.repeat(60)}`)
  console.log(`  computed tier: ${computedTier}`)
  console.log(`  rationale:     ${rationale}`)

  if (firedTriggers.length > 0) {
    console.log(`  triggers fired: ${firedTriggers.join(', ')}`)
  } else {
    console.log(`  triggers fired: (none)`)
  }

  if (computedTier === 'high-stakes') {
    console.log(`\n  ⚠ HIGH-STAKES: requires a non-author reviewer to confirm tier before proceeding.`)
    console.log(`    Set tier-confirmed-by and tier-confirmation-date in dash-config.yaml.`)
  }

  // Update dash-config.yaml if it exists.
  //
  // Edited as a YAML document, not by line regex. `computed-tier-rationale` is
  // normally a multi-line block scalar, and replacing its first line leaves the
  // indented body orphaned — invalid YAML, and the P6 review loses the reasoning
  // it is supposed to check.
  const configPath = path.join(workshopDir, 'dash-config.yaml')
  if (!fs.existsSync(configPath)) {
    console.log(`\n  (dash-config.yaml not found in ${workshopDir} — no file updated)`)
    console.log()
    return
  }

  let doc
  try {
    doc = parseYamlDocument(fs.readFileSync(configPath, 'utf8'))
    if (doc.errors?.length) throw new Error(doc.errors[0].message)
  } catch (err) {
    console.error(`\nERROR: could not parse ${configPath}: ${err.message}`)
    console.error('       Fix the file by hand — refusing to write over a config it cannot read.')
    process.exit(1)
  }

  doc.set('tier', computedTier)
  doc.set('tier-triggers-fired', firedTriggers.length ? firedTriggers.join(', ') : 'none')

  // A rationale already in the file is the dash author's reasoning, which is
  // longer and more specific than the trigger's one-liner. Keep it.
  const existingRationale = String(doc.get('computed-tier-rationale') ?? '').trim()
  if (!existingRationale) {
    doc.set('computed-tier-rationale', rationale)
  } else {
    console.log(`\n  computed-tier-rationale kept as written (${existingRationale.length} chars)`)
  }

  // lineWidth 0 disables rewrapping, so hand-formatted config lines survive.
  fs.writeFileSync(configPath, doc.toString({ lineWidth: 0 }))
  console.log(`\n  ✓ dash-config.yaml updated: tier="${computedTier}", triggers=${firedTriggers.join(', ') || 'none'}`)
  console.log()
}

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract a ```yaml block from markdown that contains a given top-level key.
 * Returns the raw content between the fences (without the fences themselves).
 */
function extractYamlBlock(text, topKey) {
  const re = /```ya?ml\s*\n([\s\S]*?)```/gm
  let m
  while ((m = re.exec(text)) !== null) {
    if (m[1].includes(topKey + ':') || m[1].includes(topKey + ' :')) {
      return m[1]
    }
  }
  return null
}

/**
 * Pick a seed value from the flag, then dash-config.yaml, then the default.
 */
function resolveSeedValue(label, flagValue, configValue, allowed, fallback) {
  const candidates = [
    { source: `--${label}`, value: flagValue, fatal: true },
    { source: 'dash-config.yaml', value: configValue, fatal: false },
  ]
  for (const candidate of candidates) {
    if (candidate.value === undefined || candidate.value === null || candidate.value === '') continue
    const normalized = String(candidate.value).trim().toLowerCase()
    if (allowed.includes(normalized)) return { value: normalized, source: candidate.source }
    const message = `${label} "${candidate.value}" from ${candidate.source} is not one of: ${allowed.join(', ')}`
    if (candidate.fatal) {
      console.error(`ERROR: ${message}`)
      process.exit(1)
    }
    console.warn(`WARN: ${message}. Using default "${fallback}".`)
  }
  return { value: fallback, source: 'default' }
}

/**
 * Read tier + session mode out of an existing dash-config.yaml.
 * Deliberately a two-key line scan rather than a YAML parse.
 */
function readDashConfig(workshopDir) {
  const configPath = path.join(workshopDir, 'dash-config.yaml')
  if (!fs.existsSync(configPath)) return {}
  const text = fs.readFileSync(configPath, 'utf8')
  return {
    tier:        readYamlScalar(text, ['dash_tier', 'dash-tier', 'tier']),
    sessionMode: readYamlScalar(text, ['session-mode', 'session_mode', 'sessionMode']),
  }
}

function readYamlScalar(text, keys) {
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = text.match(new RegExp(`^[ \\t]*${escaped}[ \\t]*:[ \\t]*(?:"([^"]*)"|'([^']*)'|([^#\\n]*))`, 'm'))
    if (!match) continue
    const value = (match[1] ?? match[2] ?? match[3] ?? '').trim()
    if (value) return value
  }
  return undefined
}

function copyDir(src, dest, substitutions) {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      copyDir(srcPath, destPath, substitutions)
    } else {
      let content = fs.readFileSync(srcPath, 'utf8')
      for (const [token, value] of Object.entries(substitutions)) {
        content = content.replaceAll(`{{${token}}}`, value).replaceAll(`{{${token.toLowerCase()}}}`, value)
      }
      fs.writeFileSync(destPath, content)
    }
  }
}

// ─── dispatch ─────────────────────────────────────────────────────────────────

switch (command) {
  case 'serve':
    serve(args.dir, args.open)
    break
  case 'check':
    check(args.dir)
    break
  case 'export':
    exportPlan(args.dir)
    break
  case 'seed':
    seed(args.dir, args.slug, args.tier, args['session-mode'])
    break

  case 'retro':
    if (!subcommand) { console.error('ERROR: retro requires a subcommand: add | report'); process.exit(1) }
    if (subcommand === 'add') {
      retroAdd(args.dir, {
        severity:  args.severity,
        phase:     args.phase,
        status:    args.status,
        summary:   args.summary,
        fixCommit: args['fix-commit'],
      })
    } else if (subcommand === 'report') {
      retroReport(args.workspace)
    } else {
      console.error(`ERROR: unknown retro subcommand: ${subcommand}`)
      process.exit(1)
    }
    break

  case 'index':
    dashIndex(args.workspace)
    break

  case 'learning-close':
    if (!subcommand) { console.error('ERROR: learning-close requires a subcommand: check | record'); process.exit(1) }
    if (subcommand === 'check') {
      learningCloseCheck(args.workspace)
    } else if (subcommand === 'record') {
      learningCloseRecord(args.dir, {
        owner:                 args.owner,
        due:                   args.due,
        testRan:               args['test-ran'],
        assumptionsValidated:  args['assumptions-validated'],
      })
    } else {
      console.error(`ERROR: unknown learning-close subcommand: ${subcommand}`)
      process.exit(1)
    }
    break

  case 'scaffold':
    dashScaffold(subcommand, args.dir, args.force)
    break

  case 'status':
    dashStatus(args.dir)
    break

  case 'lint':
    dashLint(args.dir)
    break

  case 'tier':
    dashTier(args.dir, args.answers)
    break

  default:
    console.error(`Unknown command: ${command}`)
    process.exit(1)
}
