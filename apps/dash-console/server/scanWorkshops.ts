import fs from 'node:fs/promises'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import {
  PHASES,
  type Tier,
  type PhaseStatus,
  artifactsForPhase,
  requiredGates,
  suggestResumePhase,
} from './artifactContract.js'

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
  isLegacy: boolean // no dash-config.yaml
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
  progress: number // 0–100 (% of required artifacts present)
  suggestedResumePhase: string
  lastModified: Date
  previewableFiles: string[] // relative paths to html artifacts
}

interface DashConfig {
  'dash-name'?: string
  'dash-id'?: string
  owner?: string
  'start-date'?: string
  tier?: string
  workspace?: string
  'session-mode'?: string
  'prototype_rile'?: string
  'prototype_workspace'?: string
  'gates-required'?: string[]
  'gates-deferred'?: string[]
}

const PREVIEW_EXTENSIONS = ['.html']
const PREVIEW_BLOCKLIST = ['wireframe-components.html']

async function filePresent(filePath: string): Promise<{ present: boolean; sizeBytes?: number }> {
  try {
    const stat = await fs.stat(filePath)
    return { present: stat.size > 0, sizeBytes: stat.size }
  } catch {
    return { present: false }
  }
}

async function lastModifiedInDir(dir: string): Promise<Date> {
  let latest = new Date(0)
  async function walk(current: string) {
    let names: string[]
    try {
      names = await fs.readdir(current)
    } catch {
      return
    }
    for (const name of names) {
      const fullPath = path.join(current, name)
      try {
        const stat = await fs.stat(fullPath)
        if (stat.isDirectory()) {
          await walk(fullPath)
        } else if (stat.isFile()) {
          if (stat.mtime > latest) latest = stat.mtime
        }
      } catch {}
    }
  }
  await walk(dir)
  return latest
}

async function collectPreviewableFiles(dir: string): Promise<string[]> {
  const results: string[] = []
  async function walk(current: string, rel: string) {
    let names: string[]
    try {
      names = await fs.readdir(current)
    } catch {
      return
    }
    for (const name of names) {
      const fullPath = path.join(current, name)
      const entryRel = rel ? `${rel}/${name}` : name
      try {
        const stat = await fs.stat(fullPath)
        if (stat.isDirectory()) {
          await walk(fullPath, entryRel)
        } else if (
          PREVIEW_EXTENSIONS.includes(path.extname(name)) &&
          !PREVIEW_BLOCKLIST.includes(name)
        ) {
          results.push(entryRel)
        }
      } catch {}
    }
  }
  await walk(dir, '')
  return results
}

export async function scanWorkshop(slugDir: string, workspaceRoot: string): Promise<Workshop> {
  const slug = path.basename(slugDir)
  const configPath = path.join(slugDir, 'dash-config.yaml')
  const { present: hasConfig } = await filePresent(configPath)

  let config: DashConfig = {}
  if (hasConfig) {
    try {
      const raw = await fs.readFile(configPath, 'utf8')
      config = parseYaml(raw) ?? {}
    } catch {}
  }

  const tier: Tier = (['express', 'standard', 'high-stakes'] as Tier[]).includes(
    config.tier as Tier
  )
    ? (config.tier as Tier)
    : 'unknown'

  const configGatesRequired: string[] = config['gates-required'] ?? requiredGates(tier)
  const configGatesDeferred: string[] = config['gates-deferred'] ?? []

  // Build artifact status per phase
  const presentFiles = new Set<string>()
  const phases: PhaseResult[] = []

  for (const phase of PHASES) {
    const phaseArtifacts = artifactsForPhase(phase, tier)
    const artifactStatuses: ArtifactStatus[] = []

    for (const art of phaseArtifacts) {
      const absPath = path.join(slugDir, art.file)
      const { present, sizeBytes } = await filePresent(absPath)
      if (present) presentFiles.add(art.file)
      artifactStatuses.push({ file: art.file, present, required: art.required, sizeBytes })
    }

    const requiredArtifacts = artifactStatuses.filter((a) => a.required)
    const allRequiredPresent = requiredArtifacts.length === 0 || requiredArtifacts.every((a) => a.present)
    const anyPresent = artifactStatuses.some((a) => a.present)

    let status: PhaseStatus
    if (phase.artifacts.length === 0) {
      // P5 — inferred from flow, not a dedicated file
      status = presentFiles.has('flow.md') ? 'done' : 'pending'
    } else if (allRequiredPresent) {
      status = 'done'
    } else if (anyPresent) {
      status = 'in-progress'
    } else {
      status = 'pending'
    }

    phases.push({ id: phase.id, name: phase.name, status, artifacts: artifactStatuses })
  }

  // Gates
  const GATE_LABELS: Record<string, string> = {
    P1: 'Evidence Gate',
    P4: 'Reconciliation Gate',
    P5: 'Selection Gate',
    P6: 'Ethics Gate',
    P8: 'Learning Gate',
  }
  const gates: GateResult[] = Object.entries(GATE_LABELS).map(([phase, label]) => ({
    phase,
    label,
    required: configGatesRequired.includes(phase),
    deferred: configGatesDeferred.includes(phase),
  }))

  // Progress: % of all required artifacts that are present
  const allRequired = phases.flatMap((p) => p.artifacts.filter((a) => a.required))
  const presentRequired = allRequired.filter((a) => a.present)
  const progress =
    allRequired.length === 0 ? 0 : Math.round((presentRequired.length / allRequired.length) * 100)

  const suggestedResumePhase = suggestResumePhase(presentFiles, tier)
  const lastModified = await lastModifiedInDir(slugDir)
  const previewableFiles = await collectPreviewableFiles(slugDir)

  return {
    slug,
    workspaceRoot,
    dir: slugDir,
    isLegacy: !hasConfig,
    dashName: config['dash-name'] || slug,
    owner: config.owner || '',
    startDate: config['start-date'] || '',
    tier,
    sessionMode: (['interactive', 'solo'] as const).includes(
      config['session-mode'] as 'interactive' | 'solo'
    )
      ? (config['session-mode'] as 'interactive' | 'solo')
      : 'unknown',
    workspace: config.workspace || '',
    prototypeRile: config['prototype_rile'] || '',
    prototypeWorkspace: config['prototype_workspace'] || '',
    phases,
    gates,
    progress,
    suggestedResumePhase,
    lastModified,
    previewableFiles,
  }
}

export async function scanWorkspaceRoot(workspaceRoot: string): Promise<Workshop[]> {
  const workshopsDir = path.join(workspaceRoot, 'dashes')
  let names: string[]
  try {
    names = await fs.readdir(workshopsDir)
  } catch {
    return []
  }

  const slugDirs: string[] = []
  for (const name of names) {
    const fullPath = path.join(workshopsDir, name)
    try {
      const stat = await fs.stat(fullPath)
      if (stat.isDirectory()) slugDirs.push(fullPath)
    } catch {}
  }

  const results = await Promise.all(
    slugDirs.map((dir: string) => scanWorkshop(dir, workspaceRoot))
  )

  return results.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
}
