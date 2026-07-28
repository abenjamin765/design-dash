import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import fs from 'fs'
import path from 'path'

const planDir = process.env.DASH_LIVING_PLAN_DIR
// 0 = let the OS pick a free port; the real one is written to .api-port for the
// CLI to read and hand to Vite's proxy. An explicit value is still honoured.
const apiPort = Number(process.env.DASH_LIVING_PLAN_API_PORT ?? 0)

const app = new Hono()

// API: plan metadata
app.get('/api/meta', (c) => {
  if (!planDir) return c.json({ error: 'DASH_LIVING_PLAN_DIR not set' }, 500)
  const metaPath = path.join(planDir, 'meta.yaml')
  if (!fs.existsSync(metaPath)) return c.json({ slug: 'unknown', tier: 'unknown', currentPhase: 'P0' })
  try {
    // Simple YAML parse for flat scalars — sufficient for meta.yaml
    const raw = fs.readFileSync(metaPath, 'utf8')
    const meta: Record<string, string> = {}
    for (const line of raw.split('\n')) {
      const m = line.match(/^(\w+):\s*(.+)/)
      if (m) meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
    return c.json(meta)
  } catch {
    return c.json({ error: 'Failed to read meta.yaml' }, 500)
  }
})

interface ParsedGate {
  name: string
  required: boolean
  result: string
  note?: string
  phase?: string
}

interface ParsedPhase {
  file: string
  id: string
  title: string
  status: string
  gates: ParsedGate[]
}

/**
 * Reads a JSX attribute value out of a raw props string.
 * Handles name="x", name='x', name={x}, name={"x"} and bare name.
 * Deliberately regex-based, matching check.mjs — the viewer must not need a
 * second MDX parser just to read status off a phase file.
 */
function attr(props: string, name: string): string | undefined {
  const quoted = props.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`))
  if (quoted) return quoted[1]
  const single = props.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`))
  if (single) return single[1]
  const braced = props.match(new RegExp(`\\b${name}\\s*=\\s*\\{([\\s\\S]*?)\\}`))
  if (braced) return braced[1].trim().replace(/^["'`]|["'`]$/g, '')
  if (new RegExp(`\\b${name}(?=[\\s/>])`).test(props)) return 'true'
  return undefined
}

function parsePhaseFile(file: string, raw: string): ParsedPhase | null {
  // Same pre-processing as check.mjs: comments and fenced examples are not content.
  const content = raw.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/```[\s\S]*?```/g, '')

  const gates: ParsedGate[] = []
  const gateRe = /<GateStatus\b([\s\S]*?)(?:\/>|>)/g
  let g: RegExpExecArray | null
  while ((g = gateRe.exec(content)) !== null) {
    const name = attr(g[1], 'name')
    if (!name) continue
    gates.push({
      name,
      required: attr(g[1], 'required') !== 'false',
      result: attr(g[1], 'result') ?? 'pending',
      note: attr(g[1], 'note'),
    })
  }

  const section = content.match(/<PhaseSection\b([\s\S]*?)>/)
  if (!section) return null
  const id = attr(section[1], 'id') ?? file.replace('.mdx', '').toUpperCase()
  return {
    file,
    id: id.toUpperCase(),
    title: attr(section[1], 'title') ?? id,
    status: attr(section[1], 'status') ?? 'placeholder',
    gates: gates.map(gate => ({ ...gate, phase: id.toUpperCase() })),
  }
}

/**
 * API: phase status + gate results, parsed from phases/*.mdx.
 *
 * Gate results are also rolled up: P0 seeds all five gates as "pending" and later
 * phases record the real result, so the rollup keeps the last non-pending entry
 * for each gate name and remembers which phase resolved it.
 */
app.get('/api/phases', (c) => {
  if (!planDir) return c.json({ error: 'DASH_LIVING_PLAN_DIR not set' }, 500)
  const phasesDir = path.join(planDir, 'phases')
  if (!fs.existsSync(phasesDir)) return c.json({ phases: [], gates: [] })

  const files = fs.readdirSync(phasesDir).filter(f => f.endsWith('.mdx')).sort()
  const phases: ParsedPhase[] = []
  for (const file of files) {
    try {
      const parsed = parsePhaseFile(file, fs.readFileSync(path.join(phasesDir, file), 'utf8'))
      if (parsed) phases.push(parsed)
    } catch {
      // A single unreadable phase file must not take down the whole strip.
    }
  }

  const rollup = new Map<string, ParsedGate>()
  for (const phase of phases) {
    for (const gate of phase.gates) {
      const existing = rollup.get(gate.name)
      if (!existing || gate.result !== 'pending') rollup.set(gate.name, gate)
    }
  }

  return c.json({ phases, gates: [...rollup.values()] })
})

// API: read raw phase MDX (for editor future use)
app.get('/api/phase/:name', (c) => {
  if (!planDir) return c.json({ error: 'DASH_LIVING_PLAN_DIR not set' }, 500)
  const name = c.req.param('name')
  const filePath = path.join(planDir, 'phases', `${name}.mdx`)
  if (!fs.existsSync(filePath)) return c.json({ error: 'Not found' }, 404)
  return c.text(fs.readFileSync(filePath, 'utf8'))
})

// Serve wireframe and other workshop HTML artifacts
app.get('/workshop/*', (c) => {
  if (!planDir) return c.json({ error: 'DASH_LIVING_PLAN_DIR not set' }, 500)
  const workshopDir = path.dirname(planDir)
  const filePath = path.join(workshopDir, c.req.path.replace('/workshop/', ''))
  if (!fs.existsSync(filePath)) return c.notFound()
  return c.html(fs.readFileSync(filePath, 'utf8'))
})

const server = serve({ fetch: app.fetch, port: apiPort }, (info) => {
  if (planDir) fs.writeFileSync(path.join(planDir, '.api-port'), String(info.port), 'utf8')
  console.log(`dash-living-plan API: http://127.0.0.1:${info.port}`)
})

// Without this the port clash below is an unhandled 'error' event, which takes
// the whole process down after the CLI has already printed a viewer URL.
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code !== 'EADDRINUSE') throw err
  console.error(
    `ERROR: API port ${apiPort} is already in use — another dash viewer is probably ` +
    `serving a different workshop.\n` +
    `       Stop that viewer, or set DASH_LIVING_PLAN_API_PORT to a free port.`
  )
  process.exit(1)
})
