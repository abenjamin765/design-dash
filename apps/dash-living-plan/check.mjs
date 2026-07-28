/**
 * check.mjs — validate plan MDX files against the component allowlist.
 *
 * Rules:
 * - Only allowlisted tags are permitted
 * - Required props must be present
 * - <Placeholder> must NOT appear inside a <PhaseSection status="done"> block
 * - Unknown JSX components trigger an error
 * - A scrape-required component inside an exported section must survive export
 */

import fs from 'fs'
import path from 'path'
import {
  EXPORT_STAMP,
  PHASE_EXPORT_SECTIONS,
  SCRAPE_REQUIRED_COMPONENTS,
  extractSection,
  preparePhaseContent,
  stripComments,
  stripPlaceholders,
} from './export.mjs'

// Allowlist — must match COMPONENT_CATALOG.md exactly
export const ALLOWED_COMPONENTS = new Set([
  'DashShell',
  'PhaseSection',
  'PlanPhases',
  'Placeholder',
  'Takeaway',
  'Decision',
  'AssumptionRow',
  'GateStatus',
  'GateTrack',
  'StatRow',
  'Detail',
  'ScenarioFlow',
  'ScopeBoundary',
  'ConceptCompare',
  'ConceptCard',
  'WireframeEmbed',
  'OpenQuestions',
])

// Required props per component
const REQUIRED_PROPS = {
  DashShell: ['slug', 'title', 'tier'],
  PhaseSection: ['id', 'title', 'status'],
  PlanPhases: [],
  Placeholder: ['example'],
  Takeaway: [],
  Decision: ['title'],
  AssumptionRow: ['id', 'statement', 'confidence'],
  GateStatus: ['name', 'required'],
  GateTrack: [],
  StatRow: ['value'],
  Detail: ['summary'],
  ScenarioFlow: [],
  ScopeBoundary: [],
  ConceptCompare: [],
  ConceptCard: ['name'],
  WireframeEmbed: ['src'],
  OpenQuestions: [],
}

// Attribute soup inside a tag — mirrors export.mjs's tag scanner.
const PROPS_PATTERN = `(?:[^>"'{]|"[^"]*"|'[^']*'|\\{(?:[^{}]|\\{[^{}]*\\})*\\})*?`

/**
 * @param {string} planDir - absolute path to the living-plan directory
 * @returns {{ ok: boolean, errors: string[], warnings: string[] }}
 */
export function runCheck(planDir) {
  const errors = []
  const warnings = []

  if (!fs.existsSync(planDir)) {
    return { ok: false, errors: [`Plan directory not found: ${planDir}`], warnings }
  }

  const mdxFiles = collectMdxFiles(planDir)
  if (mdxFiles.length === 0) {
    return { ok: false, errors: [`No .mdx files found in ${planDir}`], warnings }
  }

  for (const filePath of mdxFiles) {
    const relative = path.relative(planDir, filePath)
    const content = fs.readFileSync(filePath, 'utf8')
    const fileErrors = checkFile(content, relative)
    errors.push(...fileErrors.errors)
    warnings.push(...fileErrors.warnings)
  }

  // Freshness check: warn if an export-owned file was hand-edited after the last export.
  warnings.push(...checkExportFreshness(planDir))

  return { ok: errors.length === 0, errors, warnings }
}

function collectMdxFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...collectMdxFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      results.push(full)
    }
  }
  return results
}

/**
 * The seven files export.mjs generates. It owns their generated sections only —
 * anything else in the file is preserved — so the warning below is about edits
 * to the generated part, which the next export will overwrite.
 */
const EXPORT_OWNED_FILES = [
  'assumptions.md',
  'metrics.md',
  'scope.md',
  'design-spec.md',
  'flow.md',
  'ethics-review.md',
  'workshop-summary.md',
]

/**
 * Warn when a generated file changed after the last export — a hand edit to a
 * generated section, which the next export silently reverts.
 *
 * Compared against the export stamp, not against the source MDX: export writes
 * after the MDX it read, so a source comparison flags every healthy export.
 */
function checkExportFreshness(planDir) {
  const warnings = []
  const workshopDir = path.dirname(planDir)
  const stampPath = path.join(planDir, EXPORT_STAMP)

  if (!fs.existsSync(stampPath)) return warnings // never exported — nothing to compare

  let stampMtime
  try {
    stampMtime = fs.statSync(stampPath).mtimeMs
  } catch {
    return warnings
  }

  // Filesystem timestamp granularity, not a grace period for edits.
  const TOLERANCE_MS = 2000

  for (const file of EXPORT_OWNED_FILES) {
    const filePath = path.join(workshopDir, file)
    if (!fs.existsSync(filePath)) continue
    try {
      if (fs.statSync(filePath).mtimeMs > stampMtime + TOLERANCE_MS) {
        warnings.push(
          `Warning: ${file} changed after the last export. Edits to generated sections ` +
          `are reverted by \`cli.mjs export\` — move them into living-plan/phases/, or into ` +
          `a section the exporter does not own (those are preserved).`
        )
      }
    } catch { /* skip unreadable */ }
  }

  return warnings
}

function checkFile(content, filePath) {
  const errors = []
  const warnings = []

  // Strip JSX/MDX comments {/* ... */} before analysis to avoid false positives
  const stripped = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

  // Strip Markdown code fences (```mdx ... ```) — example blocks should not be validated
  const noFences = stripped.replace(/```[\s\S]*?```/g, '')

  // Extract all JSX component usages: opening + self-closing tags
  const componentRegex = /<([A-Z][A-Za-z0-9]*)([\s\S]*?)(?:\/>|>)/g
  let match

  // Track done-phase sections for Placeholder check (use stripped content)
  const doneSectionContents = extractDoneSectionContents(noFences)

  while ((match = componentRegex.exec(noFences)) !== null) {
    const tag = match[1]
    const propsStr = match[2]
    const lineNum = noFences.slice(0, match.index).split('\n').length

    // Check allowlist
    if (!ALLOWED_COMPONENTS.has(tag)) {
      errors.push(
        `${filePath}:${lineNum} — Unknown component <${tag}>. Allowed: ${[...ALLOWED_COMPONENTS].join(', ')}. ` +
        `Fix: replace with one of the allowed tags, or use a Markdown heading (which exports as plain text).`
      )
      continue
    }

    // Check required props
    const required = REQUIRED_PROPS[tag] ?? []
    const missingProps = required.filter(prop => !hasAttr(propsStr, prop))
    if (missingProps.length > 0) {
      errors.push(
        `${filePath}:${lineNum} — <${tag}> missing required prop${missingProps.length > 1 ? 's' : ''}: ` +
        `${missingProps.map(p => `"${p}"`).join(', ')}. ` +
        `Add ${missingProps.length > 1 ? 'these props' : 'this prop'} to the <${tag}> opening tag.`
      )
    }
  }

  // Check: Placeholder inside a done section (strip comments first to avoid false positives)
  for (const sectionContent of doneSectionContents) {
    const sectionStripped = sectionContent.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/```[\s\S]*?```/g, '')
    if (/<Placeholder\b/.test(sectionStripped)) {
      errors.push(
        `${filePath} — <Placeholder> found inside a PhaseSection with status="done". ` +
        `Fix: replace the <Placeholder> children with real content, then the status flip will clear.`
      )
    }
  }

  const exportResult = checkExportCoverage(content, filePath)
  errors.push(...exportResult.errors)
  warnings.push(...exportResult.warnings)

  return { errors, warnings }
}

/**
 * Fail loudly when a component whose content lives in props or children sits
 * inside an exported section but does not reach the exported Markdown.
 *
 * This is the rule that would have caught the silent `<AssumptionRow>` and
 * `<Decision>` loss: authoring was correct, export was empty, nothing said so.
 */
function checkExportCoverage(rawContent, filePath) {
  const errors = []
  const warnings = []
  const phase = path.basename(filePath, '.mdx').toLowerCase()
  const sections = PHASE_EXPORT_SECTIONS[phase]
  if (!sections) return { errors, warnings }

  const source = stripPlaceholders(stripComments(rawContent))
    .replace(/```[\s\S]*?```/g, '')
  const exported = preparePhaseContent(rawContent)

  for (const section of sections) {
    const sourceSection = extractSection(source, section)
    if (!sourceSection) {
      // The phase file may use a heading that doesn't match any alias.
      // Surface this so the author knows where to fix it.
      warnings.push(
        `${filePath} — expected section "${section}" not found (check.mjs uses export.mjs SECTION_ALIASES). ` +
        `Fix: add the heading name to SECTION_ALIASES in export.mjs.`
      )
      continue
    }

    const components = findScrapeRequired(sourceSection)
    if (!components.length) continue

    const named = [...new Set(components.map(c => `<${c.tag}>`))].join(', ')
    const exportedSection = extractSection(exported, section)
    const body = exportedSection
      ? exportedSection.split('\n').slice(1).join('\n').trim()
      : ''

    if (!body) {
      errors.push(
        `${filePath} — section "${section}" holds ${named} but exports with no content. ` +
        `Fix: either add a serializer in export.mjs → RUN_SERIALIZERS/BLOCK_SERIALIZERS, ` +
        `or hold content as children text (not props).`
      )
      continue
    }

    const haystack = collapse(body)
    for (const component of components) {
      if (!component.marker) continue
      if (!haystack.includes(component.marker)) {
        errors.push(
          `${filePath} — <${component.tag}> content ("${truncate(component.marker)}") is missing from ` +
          `the exported "${section}" section. Its serializer in export.mjs is dropping content.`
        )
      }
    }
  }

  return { errors, warnings }
}

/**
 * Scrape-required components inside a section, each with the text fragment that
 * must show up in the exported Markdown to prove the serializer ran.
 */
function findScrapeRequired(sectionText) {
  const found = []
  const re = new RegExp(`<([A-Z][A-Za-z0-9]*)(${PROPS_PATTERN})(/?)>`, 'g')
  let match
  while ((match = re.exec(sectionText)) !== null) {
    const tag = match[1]
    const markerProp = SCRAPE_REQUIRED_COMPONENTS[tag]
    if (!markerProp) continue

    let marker = markerProp === '@children' ? '' : (attrValue(match[2], markerProp) ?? '')
    if (!marker && match[3] !== '/') {
      marker = childrenSnippet(sectionText, tag, re.lastIndex)
    }
    found.push({ tag, marker: collapse(marker) })
  }
  return found
}

/** First readable fragment of a component's children, JSX stripped. */
function childrenSnippet(sectionText, tag, from) {
  const close = sectionText.indexOf(`</${tag}>`, from)
  const inner = sectionText.slice(from, close === -1 ? sectionText.length : close)
  return collapse(inner.replace(/<[^>]*>/g, ' ')).slice(0, 40)
}

function attrValue(propsStr, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*(?:["'\`]([^"'\`]*)["'\`]|([^}]*))\\s*\\})`)
  const m = propsStr.match(re)
  if (!m) return null
  return (m[1] ?? m[2] ?? m[3] ?? m[4] ?? '').trim()
}

function collapse(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim()
}

function truncate(text, max = 60) {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

function hasAttr(propsStr, name) {
  // Match name={...}, name="...", name='...', or bare name
  const re = new RegExp(`\\b${name}\\s*=|\\b${name}\\b`)
  return re.test(propsStr)
}

/**
 * Crude extraction of content inside PhaseSection status="done" blocks.
 * Not a full parser — good enough for check purposes.
 */
function extractDoneSectionContents(content) {
  const results = []
  // Find opening tags with status="done" or status='done'
  const openRe = /<PhaseSection\b[^>]*status=["']done["'][^>]*>/g
  let m
  while ((m = openRe.exec(content)) !== null) {
    // Find the matching closing tag (simple depth count)
    let depth = 1
    let pos = m.index + m[0].length
    const rest = content.slice(pos)
    const innerRe = /<\/?PhaseSection\b/g
    let im
    let end = rest.length
    while ((im = innerRe.exec(rest)) !== null) {
      if (rest[im.index + 1] === '/') {
        depth--
        if (depth === 0) {
          end = im.index
          break
        }
      } else {
        depth++
      }
    }
    results.push(rest.slice(0, end))
  }
  return results
}
