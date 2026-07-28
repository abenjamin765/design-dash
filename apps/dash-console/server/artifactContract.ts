/**
 * artifactContract.ts
 *
 * Thin TypeScript re-export wrapper around the shared plain-ESM contract.
 * The source of truth is: apps/dash-living-plan/contract/dash-contract.mjs
 *
 * Adding types here so TypeScript consumers (the console server) stay typed
 * without duplicating the actual data.
 */

// Re-export runtime values from the shared contract
export {
  PHASES,
  GATE_PHASES,
  GATE_LABELS,
  TIER_GATES,
  EXPORTED_ARTIFACTS,
  requiredGates,
  artifactsForPhase,
  suggestResumePhase,
} from '../../dash-living-plan/contract/dash-contract.mjs'

// TypeScript-only types (not available in the .mjs module)
export type Tier = 'express' | 'standard' | 'high-stakes' | 'unknown'
export type PhaseStatus = 'done' | 'in-progress' | 'pending'

export interface PhaseArtifact {
  file: string
  /** whether absence blocks the phase from being "done" */
  required: boolean
  /** 'all' means required for all tiers; otherwise only for the listed tiers */
  tiers: 'all' | Tier[]
}

export interface Phase {
  id: string
  name: string
  artifacts: PhaseArtifact[]
}
