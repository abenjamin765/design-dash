/**
 * export.mjs — mechanical MDX → workshop markdown exporter.
 *
 * Reads living-plan/phases/p*.mdx and maps structured content to:
 *   assumptions.md, metrics.md, scope.md, design-spec.md, flow.md,
 *   ethics-review.md, dash-config.yaml (read-only; not re-written)
 *
 * Rules:
 * - Strip ALL <Placeholder> blocks — never write examples to workshop files
 * - Serialize allowlisted components to Markdown BEFORE stripping JSX tags, so
 *   content held in props survives into the exported file
 * - Structured Markdown headings inside PhaseSection are scraped by convention,
 *   matched exactly (after normalisation) against the canonical section names
 *   and their aliases in SECTION_ALIASES
 * - Regenerate only the sections listed in EXPORT_TARGETS. Any other `##`
 *   section already in the destination file is preserved, so a file with a
 *   hybrid authorship model (design-spec.md §4–§6 are hand-written) survives a
 *   routine re-export
 * - Exits non-zero if check fails
 */

import fs from 'fs'
import path from 'path'

// ─── section vocabulary ───────────────────────────────────────────────────────

/**
 * Canonical section key → heading names that resolve to it.
 *
 * The canonical key is what export.mjs and check.mjs ask for. The aliases are
 * what an author may actually have written — including the plain-language
 * headings introduced by the readability pass. Matching is exact after
 * normalisation (case, punctuation, hyphens and markdown emphasis are ignored),
 * so `Non-Goals` can never satisfy a request for `Goals`.
 *
 * To rename a heading in content, add the new name here first. Never rely on
 * substring matching — that was the bug this map replaces.
 */
export const SECTION_ALIASES = {
  'Assumptions': ["What We're Assuming", 'What We Are Assuming', 'Assumptions and Evidence'],
  'Metrics': ['Success Metrics', 'How We Will Measure Success', "How We'll Measure Success"],
  'Problem Statement': ['The Problem', 'What Is Wrong Today'],
  'User Role': ['Primary Role', 'Who This Is For'],
  'Scope': ['What We Are Building', "What We're Building", 'What Is In and Out of Scope'],
  'Mental Models': ['How People Think About This'],
  'Constraints': ["What We Can't Change", 'What We Cannot Change', 'Limits'],
  'Success Criteria': ['What Good Looks Like', 'Definition of Success'],
  'Objects': ['Object Model', 'The Things In This System'],
  'Decisions': ['Decisions Locked', 'What We Decided'],
  'Sign-Off': ['Sign-Off Ledger', 'Who Signed Off'],
  'Context': ['Background'],
  'Goals': ['What We Are Trying To Do', "What We're Trying To Do"],
  'Non-Goals': ["What We're Not Doing", 'What We Are Not Doing', 'Out of Bounds'],
  'Primary User': ["Who We're Designing For", 'Who We Are Designing For'],
  'Scenarios': ['Primary Scenario', 'How People Use It'],
  'Flow': ['User Flow', 'The Steps'],
  'Page List': ['Screens', 'Screen List'],
  'Goal-Page Map': ['Which Screen Delivers Which Goal', 'Goal to Page Map'],
  'Reconciliation': ['Where Users and the System Disagree', 'Reconciliation Notes'],
  'Distinctness Check': ['Adversarial Distinctness Check', 'Are These Options Really Different?'],
  'Ethics': ['Ethics and Equity', 'Ethics and Equity Review', 'Ethics Review'],
  'Summary': ['Workshop Summary', 'What We Learned'],
}

const CANONICAL_BY_HEADING = new Map()
for (const [canonical, aliases] of Object.entries(SECTION_ALIASES)) {
  for (const name of [canonical, ...aliases]) {
    CANONICAL_BY_HEADING.set(normalizeHeading(name), canonical)
  }
}

/**
 * Every workshop file the exporter writes, and the phase sections it is built
 * from. check.mjs reads this to know which sections a phase file must produce.
 */
export const EXPORT_TARGETS = [
  { file: 'assumptions.md', title: 'Assumptions', source: 'P1', sections: [['p1', 'Assumptions']] },
  { file: 'metrics.md', title: 'Metrics', source: 'P1', sections: [['p1', 'Metrics']] },
  {
    file: 'scope.md',
    title: 'Scope',
    source: 'P2–P3',
    sections: [
      ['p2', 'Problem Statement'],
      ['p2', 'User Role'],
      ['p2', 'Scope'],
      ['p2', 'Mental Models'],
      ['p2', 'Constraints'],
      ['p2', 'Success Criteria'],
      ['p3', 'Objects'],
      ['p3', 'Decisions'],
      ['p3', 'Sign-Off'],
    ],
  },
  {
    file: 'design-spec.md',
    title: 'Design Spec',
    source: 'P3',
    sections: [
      ['p3', 'Context'],
      ['p3', 'Goals'],
      ['p3', 'Non-Goals'],
      ['p3', 'Primary User'],
    ],
  },
  {
    file: 'flow.md',
    title: 'Flow & IA',
    source: 'P4',
    sections: [
      ['p4', 'Scenarios'],
      ['p4', 'Flow'],
      ['p4', 'Page List'],
      ['p4', 'Goal-Page Map'],
      ['p4', 'Reconciliation'],
      ['p4', 'Constraints'],
    ],
  },
  { file: 'ethics-review.md', title: 'Ethics Review', source: 'P6', sections: [['p6', 'Ethics']] },
  { file: 'workshop-summary.md', title: 'Workshop Summary', source: 'P8', sections: [['p8', 'Summary']] },
]

/** phase id (`p3`) → canonical section keys the exporter scrapes from it. */
export const PHASE_EXPORT_SECTIONS = (() => {
  const map = {}
  for (const target of EXPORT_TARGETS) {
    for (const [phase, section] of target.sections) {
      map[phase] ??= []
      if (!map[phase].includes(section)) map[phase].push(section)
    }
  }
  return map
})()

/**
 * @param {string} planDir - absolute path to living-plan dir
 */
export async function runExport(planDir) {

  const workshopDir = path.dirname(planDir)
  const phasesDir = path.join(planDir, 'phases')

  if (!fs.existsSync(phasesDir)) {
    throw new Error(`phases/ directory not found at ${phasesDir}`)
  }

  const phaseFiles = fs.readdirSync(phasesDir)
    .filter(f => f.endsWith('.mdx'))
    .sort()

  // Collect all content keyed by phase. Order matters: placeholders go first so
  // example content never reaches a serializer, then components are serialized
  // to Markdown, and only then are the remaining JSX tags stripped.
  const phaseContent = {}
  for (const file of phaseFiles) {
    const phase = path.basename(file, '.mdx') // e.g. "p0", "p1"
    const raw = fs.readFileSync(path.join(phasesDir, file), 'utf8')
    phaseContent[phase] = preparePhaseContent(raw)
  }

  for (const target of EXPORT_TARGETS) {
    const parts = target.sections
      .map(([phase, section]) => extractSection(phaseContent[phase] ?? '', section))
      .filter(Boolean)
    if (!parts.length) continue
    writeWorkshopFile(
      workshopDir,
      target.file,
      wrapExport(target.title, parts.join('\n\n'), target.source),
      target.sections.map(([, section]) => section)
    )
  }

  fs.writeFileSync(path.join(planDir, EXPORT_STAMP), `${new Date().toISOString()}\n`, 'utf8')

  // P6 wireframe.html is not exported — it stays canonical HTML.
}

/**
 * Written last on every export. check.mjs compares each exported file's mtime
 * against this stamp to tell a hand-edit apart from a normal export, which is
 * not something the source MDX mtimes can answer: export always writes after
 * the MDX it read, so "newer than the source" is true of every healthy export.
 */
export const EXPORT_STAMP = '.last-export'

/**
 * Full source → exportable-Markdown pipeline for one phase file.
 */
export function preparePhaseContent(raw) {
  let content = stripPlaceholders(stripComments(raw))
  content = serializeComponents(content)
  content = stripMdxSyntax(content)
  return content
}

// ─── component serialization ──────────────────────────────────────────────────

/**
 * Components whose content lives in props or children and which therefore need
 * a serializer to survive export. Every allowlisted component either appears
 * here or is a pure layout wrapper whose children pass through untouched.
 *
 * `marker` names the prop check.mjs uses to prove the component reached the
 * exported file; `'@children'` means "look for the children text instead".
 */
export const SCRAPE_REQUIRED_COMPONENTS = {
  Decision: 'title',
  AssumptionRow: 'id',
  GateStatus: 'name',
  WireframeEmbed: 'src',
  ScenarioFlow: '@children',
  ConceptCard: 'name',
  StatRow: 'value',
  Detail: 'summary',
  Takeaway: '@children',
}

/**
 * Mirrors `templates/assumptions.md`. `evidence` and `dueBy` are here because
 * `cli.mjs lint` requires an evidence link on an `observed` row and a due-by date
 * on a `debt` row — without columns for them, a correctly authored register can
 * never satisfy its own linter.
 */
const ASSUMPTION_COLUMNS = [
  ['id', 'ID'],
  ['statement', 'Statement'],
  ['type', 'Type'],
  ['confidence', 'Confidence'],
  ['validation', 'Validation'],
  ['evidence', 'Evidence link'],
  ['status', 'Status'],
  ['dueBy', 'Due by'],
  ['owner', 'Owner'],
]

/** Self-closing components serialized as a run, so a group shares one header. */
const RUN_SERIALIZERS = {
  AssumptionRow: (rows) => [
    `| ${ASSUMPTION_COLUMNS.map(([, label]) => label).join(' | ')} |`,
    `|${ASSUMPTION_COLUMNS.map(() => '---').join('|')}|`,
    ...rows.map(p => `| ${ASSUMPTION_COLUMNS.map(([key]) => cell(p[key] ?? '—')).join(' | ')} |`),
  ].join('\n'),

  Decision: (rows) => rows.map(p => bulletPair(p.title, p.rationale)).join('\n'),

  GateStatus: (rows) => rows.map(p => {
    const bits = [`result: **${inline(p.result ?? 'pending')}**`, `required: ${p.required === false ? 'no' : 'yes'}`]
    if (p.note) bits.push(inline(p.note))
    return `- **${inline(p.name ?? 'Gate')}** — ${bits.join(' · ')}`
  }).join('\n'),

  WireframeEmbed: (rows) => rows
    .map(p => `- Wireframe: [${inline(p.title ?? 'Design wireframe')}](${inline(p.src ?? '')})`)
    .join('\n'),
}

/**
 * Components with children. Each receives already-serialized children so nested
 * components (ConceptCard inside ConceptCompare) resolve innermost-first.
 */
const BLOCK_SERIALIZERS = {
  // Layout wrappers — children pass through unchanged.
  DashShell: (_props, children) => children,
  PhaseSection: (_props, children) => children,
  OpenQuestions: (_props, children) => children,
  ConceptCompare: (_props, children) => children,
  ScopeBoundary: (_props, children) => children,

  // Viewer-only: reads its data at render time, so there is nothing to export.
  PlanPhases: () => '',
  GateTrack: () => '',

  Takeaway: (_props, children) => {
    const text = inline(children)
    return text ? `> **${text}**` : ''
  },

  ScenarioFlow: (props, children) => joinBlocks([
    labelledBullets([['User', props.user], ['Trigger', props.trigger], ['Goal', props.goal]]),
    children,
  ]),

  ConceptCard: (props, children) => joinBlocks([
    `### Concept: ${inline(props.name ?? 'Unnamed')}`,
    labelledBullets([
      ['Surface', props.surface],
      ['Action', props.action],
      ['User score', props.userScore],
      ['Business score', props.businessScore],
      ['Selected', props.selected === true || props.selected === 'true' ? 'yes' : undefined],
    ]),
    children,
  ]),

  StatRow: (props, children) => joinBlocks([
    props.label ? `**${inline(props.value)}** — ${inline(props.label)}` : `**${inline(props.value)}**`,
    children,
  ]),

  Detail: (props, children) => joinBlocks([`**${inline(props.summary ?? 'Detail')}**`, children]),

  // Block-form fallbacks. These are normally self-closing and handled by
  // RUN_SERIALIZERS; the entries here keep content from being dropped if an
  // author writes the paired-tag form instead.
  Decision: (props, children) => joinBlocks([bulletPair(props.title, props.rationale), children]),
  GateStatus: (props, children) => joinBlocks([RUN_SERIALIZERS.GateStatus([props]), children]),
  AssumptionRow: (props, children) => joinBlocks([RUN_SERIALIZERS.AssumptionRow([props]), children]),
  WireframeEmbed: (props, children) => joinBlocks([RUN_SERIALIZERS.WireframeEmbed([props]), children]),
}

/**
 * Turn allowlisted components into Markdown. Must run BEFORE stripMdxSyntax(),
 * which deletes JSX tags and everything their props carry.
 */
export function serializeComponents(content) {
  let out = content
  for (const tag of Object.keys(RUN_SERIALIZERS)) {
    out = serializeRun(out, tag, RUN_SERIALIZERS[tag])
  }
  return serializeBlocks(out)
}

/**
 * Collapse a run of consecutive self-closing `<tag/>` siblings into one block,
 * so N `<AssumptionRow/>` tags become one table rather than N headerless rows.
 */
function serializeRun(content, tag, render) {
  const single = `<${tag}\\b(${PROPS_PATTERN})/>`
  const runRe = new RegExp(`(?:\\s*${single})+`, 'g')
  return content.replace(runRe, (run) => {
    const propsList = [...run.matchAll(new RegExp(single, 'g'))].map(m => parseProps(m[1]))
    return block(render(propsList))
  })
}

function serializeBlocks(content) {
  let out = ''
  let cursor = 0

  while (cursor < content.length) {
    const open = nextSerializableTag(content, cursor)
    if (!open) {
      out += content.slice(cursor)
      break
    }
    out += content.slice(cursor, open.start)

    if (open.selfClosing) {
      out += block(BLOCK_SERIALIZERS[open.tag](open.props, ''))
      cursor = open.end
      continue
    }

    const close = findMatchingClose(content, open.tag, open.end)
    const rawChildren = content.slice(open.end, close ? close.start : content.length)
    const children = serializeBlocks(rawChildren).trim()
    out += block(BLOCK_SERIALIZERS[open.tag](open.props, children))
    cursor = close ? close.end : content.length
  }

  return out
}

// Attribute soup inside a tag: bare words, "double" or 'single' quoted values,
// and {expressions} with at most one level of nested braces.
const PROPS_PATTERN = `(?:[^>"'{]|"[^"]*"|'[^']*'|\\{(?:[^{}]|\\{[^{}]*\\})*\\})*?`

function nextSerializableTag(content, from) {
  const re = new RegExp(`<([A-Z][A-Za-z0-9]*)(${PROPS_PATTERN})(/?)>`, 'g')
  re.lastIndex = from
  let m
  while ((m = re.exec(content)) !== null) {
    if (!(m[1] in BLOCK_SERIALIZERS)) continue
    return {
      tag: m[1],
      props: parseProps(m[2]),
      selfClosing: m[3] === '/',
      start: m.index,
      end: m.index + m[0].length,
    }
  }
  return null
}

function findMatchingClose(content, tag, from) {
  const re = new RegExp(`<(/?)${tag}\\b(${PROPS_PATTERN})(/?)>`, 'g')
  re.lastIndex = from
  let depth = 1
  let m
  while ((m = re.exec(content)) !== null) {
    if (m[1] === '/') {
      depth -= 1
      if (depth === 0) return { start: m.index, end: m.index + m[0].length }
    } else if (m[3] !== '/') {
      depth += 1
    }
  }
  return null
}

function parseProps(propsStr) {
  const props = {}
  if (!propsStr) return props
  const re = /([A-Za-z_][A-Za-z0-9_-]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|\{((?:[^{}]|\{[^{}]*\})*)\}))?/g
  let m
  while ((m = re.exec(propsStr)) !== null) {
    if (m[2] !== undefined) props[m[1]] = m[2]
    else if (m[3] !== undefined) props[m[1]] = m[3]
    else if (m[4] !== undefined) props[m[1]] = parseExpression(m[4])
    else props[m[1]] = true
  }
  return props
}

function parseExpression(expr) {
  const trimmed = expr.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  const unquoted = trimmed.match(/^(["'`])([\s\S]*)\1$/)
  return unquoted ? unquoted[2] : trimmed
}

// ─── serializer text helpers ──────────────────────────────────────────────────

/** Surround a serialized block with blank lines; stripMdxSyntax collapses runs. */
function block(text) {
  return text ? `\n\n${text}\n\n` : '\n\n'
}

function joinBlocks(parts) {
  return parts.filter(p => p && String(p).trim()).join('\n\n')
}

function labelledBullets(pairs) {
  return pairs
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([label, value]) => `- **${label}:** ${inline(value)}`)
    .join('\n')
}

function bulletPair(title, detail) {
  const head = `- **${inline(title ?? 'Untitled')}**`
  return detail ? `${head} — ${inline(detail)}` : head
}

/** Collapse a value to a single Markdown line. */
function inline(value) {
  if (value === true) return 'yes'
  if (value === false) return 'no'
  return String(value ?? '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function cell(value) {
  return inline(value).replace(/\|/g, '\\|')
}

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Strip MDX-specific syntax from content destined for Markdown workshop files.
 * Removes JSX comments, JSX component tags, leaves prose/Markdown intact.
 *
 * Run serializeComponents() first — anything still tag-shaped at this point is
 * discarded along with whatever its props held.
 */
export function stripMdxSyntax(content) {
  // Strip JSX block comments
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  // Strip opening + self-closing JSX component tags (uppercase first letter)
  content = content.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, '')
  content = content.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*>/g, '')
  // Strip closing JSX component tags
  content = content.replace(/<\/[A-Z][A-Za-z0-9]*>/g, '')
  // Collapse excessive blank lines
  content = content.replace(/\n{3,}/g, '\n\n')
  return content.trim()
}

/** Remove JSX comments. Runs before placeholder stripping — see stripPlaceholders. */
export function stripComments(content) {
  return content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
}

/**
 * Remove all <Placeholder>…</Placeholder> blocks (and self-closing variants).
 * This is the anti-leak guarantee.
 *
 * The block pattern refuses to span a second `<Placeholder`, so a stray mention
 * of the tag — authoring guidance in a comment, prose explaining the component —
 * cannot pair with a later real closing tag and delete everything in between.
 * That failure was silent and cost the template's own P1 assumptions table.
 * Run stripComments() first so guidance text is gone before this even matters.
 *
 * Repeat until stable to handle nested or adjacent Placeholders.
 */
export function stripPlaceholders(content) {
  let prev
  do {
    prev = content
    // Block form: <Placeholder ...attributes...>...content...</Placeholder>
    content = content.replace(/<Placeholder\b(?:(?!<Placeholder\b)[\s\S])*?<\/Placeholder>/g, '')
    // Self-closing form: <Placeholder ... />
    content = content.replace(/<Placeholder\b[^>]*\/>/g, '')
  } while (content !== prev)
  return content
}

/**
 * Normalise a heading for comparison: case, markdown emphasis, hyphens, a
 * trailing parenthetical, and all other punctuation are ignored.
 */
export function normalizeHeading(text) {
  return String(text ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[`*_]/g, '')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/&/g, ' and ')
    .replace(/[^A-Za-z0-9' ]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

/** Canonical section key for a heading, or null if it is not a known section. */
export function resolveHeading(text) {
  return CANONICAL_BY_HEADING.get(normalizeHeading(text)) ?? null
}

/**
 * Extract content under the Markdown heading (any level) for `section`.
 *
 * Matching is exact after normalisation, via the alias map — `Non-Goals` does
 * not satisfy `Goals`. Capture ends at:
 *   - any heading at the same or a higher level, matching or not, and
 *   - any deeper heading that is itself a known section, so a nested
 *     `### Non-Goals` closes `## Goals` instead of being swallowed by it.
 */
export function extractSection(content, section) {
  const target = resolveHeading(section) ?? normalizeHeading(section)
  const lines = content.split('\n')
  const captured = []
  let capturing = false
  let level = 0
  let inFence = false

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence

    const hm = inFence ? null : line.match(/^(#{1,6})\s+(.+)/)
    if (hm) {
      const thisLevel = hm[1].length
      const thisTitle = hm[2].trim()
      const resolved = resolveHeading(thisTitle)
      const matches = (resolved ?? normalizeHeading(thisTitle)) === target

      if (!capturing) {
        if (matches) {
          capturing = true
          level = thisLevel
          captured.push(line)
        }
        continue
      }
      if (thisLevel <= level) break
      if (resolved && resolved !== target) break
    }
    if (capturing) captured.push(line)
  }

  const result = captured.join('\n').trim()
  return result || null
}

function wrapExport(title, content, source) {
  return [
    `<!-- Generated by dash-living-plan export from ${source}. Exporter-owned sections are`,
    `     rebuilt on every export — edit the living plan, not this file. Sections the`,
    `     exporter does not own are preserved below and are safe to hand-author. -->`,
    '',
    `# ${title}`,
    '',
    content,
    '',
  ].join('\n')
}

const PRESERVED_BANNER =
  '<!-- Hand-authored below. export preserves every section it does not own. -->'

/**
 * Split a workshop file into `## ` sections. Anything before the first one (the
 * generated banner, the `# Title`) is dropped — export always rewrites it.
 */
function splitTopLevelSections(text) {
  const sections = []
  let current = null
  for (const line of text.split('\n')) {
    if (/^##\s+\S/.test(line)) {
      if (current) sections.push(current)
      current = { heading: line.replace(/^##\s+/, '').trim(), lines: [line] }
    } else if (current) {
      current.lines.push(line)
    }
  }
  if (current) sections.push(current)
  return sections
}

/**
 * Sections in the file on disk that this export does not own, in file order.
 *
 * `design-spec-template.md` tells the designer to hand-author §4 Scenarios &
 * Flow, §5 Selected Concept and §6 Spec Self-Review straight into
 * `design-spec.md`, while the exporter owns §1–§3 of the same file. A blind
 * overwrite deletes that work at the next phase boundary, so keep anything the
 * exporter did not generate.
 */
function preservedSections(dest, ownedSections, generated) {
  if (!fs.existsSync(dest)) return []

  const owned = new Set(ownedSections.map(s => resolveHeading(s) ?? normalizeHeading(s)))
  const alreadyGenerated = new Set(
    splitTopLevelSections(generated).map(s => resolveHeading(s.heading) ?? normalizeHeading(s.heading))
  )

  return splitTopLevelSections(fs.readFileSync(dest, 'utf8'))
    .filter(section => {
      const key = resolveHeading(section.heading) ?? normalizeHeading(section.heading)
      return !owned.has(key) && !alreadyGenerated.has(key)
    })
    .map(section => ({
      heading: section.heading,
      body: section.lines.join('\n').replace(new RegExp(`^\\s*${escapeRegex(PRESERVED_BANNER)}\\s*$`, 'm'), '').trim(),
    }))
    .filter(section => section.body)
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function writeWorkshopFile(workshopDir, filename, content, ownedSections = []) {
  const dest = path.join(workshopDir, filename)
  const preserved = preservedSections(dest, ownedSections, content)

  const body = preserved.length
    ? [content.trimEnd(), '', PRESERVED_BANNER, '', preserved.map(s => s.body).join('\n\n'), ''].join('\n')
    : content

  fs.writeFileSync(dest, body, 'utf8')

  const kept = preserved.length
    ? ` (kept ${preserved.length} hand-authored section${preserved.length > 1 ? 's' : ''}: ${preserved.map(s => s.heading).join(', ')})`
    : ''
  console.log(`  → wrote ${filename}${kept}`)
}
