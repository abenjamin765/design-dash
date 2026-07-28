import type { Workshop, ConsoleConfig } from './types'

const BASE = '/api'

async function json<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  config: {
    get: () => json<ConsoleConfig>('/config'),
    set: (c: Partial<ConsoleConfig>) =>
      json<{ ok: boolean }>('/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      }),
  },

  workshops: {
    list: () => json<Workshop[]>('/workshops'),
    get: (slug: string) => json<Workshop>(`/workshops/${slug}`),
    create: (body: {
      slug: string
      dashName: string
      owner: string
      sessionMode?: string
      workspaceRoot: string
    }) =>
      json<{ ok: boolean; dir: string }>('/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    openFolder: (slug: string) =>
      json<{ ok: boolean }>(`/workshops/${slug}/open`, { method: 'POST' }),
    startPrompt: (slug: string) =>
      json<{ prompt: string }>(`/workshops/${slug}/prompt/start`),
    resumePrompt: (slug: string) =>
      json<{ prompt: string }>(`/workshops/${slug}/prompt/resume`),
  },

  validateWorkspace: (p: string) =>
    json<{ valid: boolean; resolved: string }>('/validate-workspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: p }),
    }),
}
