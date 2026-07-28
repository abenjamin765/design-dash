export type Tier = 'express' | 'standard' | 'high-stakes' | 'unknown'
export type PhaseStatus = 'done' | 'in-progress' | 'pending'

export interface ArtifactStatus {
  file: string
  present: boolean
  required: boolean
  sizeBytes?: number
}

export interface PhaseResult {
  id: string
  name: string
  status: PhaseStatus
  artifacts: ArtifactStatus[]
}

export interface GateResult {
  phase: string
  label: string
  required: boolean
  deferred: boolean
}

export interface Workshop {
  slug: string
  workspaceRoot: string
  dir: string
  isLegacy: boolean
  dashName: string
  owner: string
  startDate: string
  tier: Tier
  sessionMode: 'interactive' | 'solo' | 'unknown'
  workspace: string
  prototypeRile: string
  prototypeWorkspace: string
  phases: PhaseResult[]
  gates: GateResult[]
  progress: number
  suggestedResumePhase: string
  lastModified: string
  previewableFiles: string[]
}

export interface ConsoleConfig {
  workspaceRoots: string[]
  skillsRepo?: string
}
