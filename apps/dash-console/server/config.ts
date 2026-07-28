/**
 * config.ts
 *
 * Persists workspace root configuration to ~/.config/design-dash/console.json.
 * Never stores secrets; this is a local path list only.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

const CONFIG_DIR = path.join(os.homedir(), '.config', 'design-dash')
const CONFIG_FILE = path.join(CONFIG_DIR, 'console.json')

// Prefer this clone (apps/dash-console → repo root) then a common Sites path.
const REPO_ROOT = path.resolve(path.join(import.meta.dirname, '..', '..', '..'))
const DEFAULT_WORKSPACE_CANDIDATES = [
  REPO_ROOT,
  path.join(os.homedir(), 'Sites', 'design-dash'),
]

export interface ConsoleConfig {
  workspaceRoots: string[]
  skillsRepo?: string
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

export async function readConfig(): Promise<ConsoleConfig> {
  try {
    const raw = await fs.readFile(CONFIG_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<ConsoleConfig>
    return {
      workspaceRoots: parsed.workspaceRoots ?? [],
      skillsRepo: parsed.skillsRepo,
    }
  } catch {
    // Bootstrap: detect common default workspaces
    const defaults: string[] = []
    for (const candidate of DEFAULT_WORKSPACE_CANDIDATES) {
      if (await exists(candidate)) defaults.push(candidate)
    }
    return { workspaceRoots: defaults }
  }
}

export async function writeConfig(config: ConsoleConfig): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true })
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8')
}

/** Ensure requested paths are inside configured roots (prevent FS escape) */
export function isAllowedPath(targetPath: string, roots: string[]): boolean {
  const resolved = path.resolve(targetPath)
  return roots.some((root) => resolved.startsWith(path.resolve(root)))
}
