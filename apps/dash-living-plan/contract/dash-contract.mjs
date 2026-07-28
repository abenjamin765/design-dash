/**
 * dash-contract.mjs
 *
 * Single source of truth for the Design Dash phase/gate/tier contract.
 * Consumed by: dash-console server, cli.mjs (check, status, lint, tier), export.mjs.
 *
 * Plain ESM — no TypeScript, no dependencies — so all .mjs callers can import it directly.
 * Aligned with: skills/0-orchestration/design-dash/SKILL.md and method/method.yaml
 *
 * Artifact root default: dashes/{slug}/ (configurable via dash-config.yaml).
 */

// ─── Phases ───────────────────────────────────────────────────────────────────

/**
 * @typedef {{ file: string, required: boolean, tiers: 'all' | string[] }} PhaseArtifact
 * @typedef {{ id: string, name: string, artifacts: PhaseArtifact[] }} Phase
 */

/** @type {Phase[]} */
export const PHASES = [
  {
    id: 'P0',
    name: 'Preconditions',
    artifacts: [{ file: 'dash-config.yaml', required: true, tiers: 'all' }],
  },
  {
    id: 'P1',
    name: 'Opportunity & Evidence',
    artifacts: [
      { file: 'assumptions.md', required: true, tiers: 'all' },
      { file: 'metrics.md', required: true, tiers: ['standard', 'high-stakes'] },
    ],
  },
  {
    id: 'P2',
    name: 'Intake & Object Modeling',
    artifacts: [{ file: 'scope.md', required: true, tiers: 'all' }],
  },
  {
    id: 'P3',
    name: 'Framing Lock',
    artifacts: [{ file: 'design-spec.md', required: true, tiers: 'all' }],
  },
  {
    id: 'P4',
    name: 'Flow & Reconciliation',
    artifacts: [{ file: 'flow.md', required: true, tiers: 'all' }],
  },
  {
    id: 'P5',
    name: 'Divergence & Selection',
    artifacts: [{ file: 'design-spec.md', required: false, tiers: 'all' }],
  },
  {
    id: 'P6',
    name: 'Wireframe & Ethics',
    artifacts: [
      { file: 'wireframe.html', required: true, tiers: 'all' },
      { file: 'ethics-review.md', required: false, tiers: 'all' },
      { file: 'ethics-equity-checklist.md', required: false, tiers: 'all' },
    ],
  },
  {
    id: 'P7',
    name: 'Optional Build',
    artifacts: [
      { file: 'p7-build-note.md', required: false, tiers: 'all' },
    ],
  },
  {
    id: 'P8',
    name: 'Validate & Learn',
    artifacts: [
      { file: 'pitch/index.html', required: true, tiers: 'all' },
      { file: 'workshop-summary.md', required: false, tiers: 'all' },
      { file: 'summary.html', required: false, tiers: 'all' },
    ],
  },
]

// ─── Gates ────────────────────────────────────────────────────────────────────

/** Gate phase IDs (from SKILL.md "Five mandatory gates") */
export const GATE_PHASES = /** @type {const} */ (['P1', 'P4', 'P5', 'P6', 'P8'])

/**
 * Canonical GateStatus `name` values as written in living-plan MDX / GateTrack.
 * Human prose may still say "Edge/Ethics/Equity Gate" — see GATE_NAME_ALIASES.
 * @type {Record<string, string>}
 */
export const GATE_LABELS = {
  P1: 'Evidence Gate',
  P4: 'Reconciliation Gate',
  P5: 'Selection Gate',
  P6: 'Ethics Gate',
  P8: 'Learning Gate',
}

/** Alternate names that resolve to the same gate (prose ↔ MDX). */
export const GATE_NAME_ALIASES = {
  'Edge/Ethics/Equity Gate': 'Ethics Gate',
  'Ethics/Equity Gate': 'Ethics Gate',
  'Edge Ethics Equity Gate': 'Ethics Gate',
}

/** Resolve a GateStatus name (or alias) to the canonical label. */
export function canonicalGateName(name) {
  if (!name) return name
  return GATE_NAME_ALIASES[name] || name
}

// ─── Session modes ────────────────────────────────────────────────────────────

/** @type {readonly string[]} */
export const SESSION_MODES = /** @type {const} */ (['interactive', 'solo'])

// ─── Tier helpers ─────────────────────────────────────────────────────────────

/**
 * Which gate phases are required for a given tier.
 * @param {string} tier
 * @returns {string[]}
 */
export function requiredGates(tier) {
  if (tier === 'express') return ['P6']
  if (tier === 'standard') return ['P1', 'P4', 'P5', 'P6', 'P8']
  if (tier === 'high-stakes') return ['P1', 'P4', 'P5', 'P6', 'P8']
  return ['P6'] // unknown → assume minimum
}

/**
 * Pre-computed map of tier → required gate phase IDs.
 * @type {Record<string, string[]>}
 */
export const TIER_GATES = {
  express: requiredGates('express'),
  standard: requiredGates('standard'),
  'high-stakes': requiredGates('high-stakes'),
}

/**
 * All artifacts expected for a phase + tier (filtered by tiers field).
 * @param {Phase} phase
 * @param {string} tier
 * @returns {PhaseArtifact[]}
 */
export function artifactsForPhase(phase, tier) {
  return phase.artifacts.filter((a) => {
    if (a.tiers === 'all') return true
    return a.tiers.includes(tier)
  })
}

/**
 * Derive the suggested resume phase from the first missing required artifact.
 * @param {Set<string>} presentFiles
 * @param {string} tier
 * @returns {string}
 */
export function suggestResumePhase(presentFiles, tier) {
  for (const phase of PHASES) {
    const required = artifactsForPhase(phase, tier).filter((a) => a.required)
    const missing = required.filter((a) => !presentFiles.has(a.file))
    if (missing.length > 0) return phase.id
  }
  return 'P8' // all done → suggest staying at P8
}

// ─── Export bridge ────────────────────────────────────────────────────────────

/**
 * The files that export.mjs owns (living-plan MDX → dash markdown).
 * Everything else in the dash dir is template-derived or hand-authored.
 */
export const EXPORTED_ARTIFACTS = [
  'assumptions.md',
  'metrics.md',
  'scope.md',
  'design-spec.md',
  'flow.md',
  'ethics-review.md',
  'workshop-summary.md',
]
