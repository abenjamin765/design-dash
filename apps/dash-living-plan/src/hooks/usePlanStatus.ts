/**
 * usePlanStatus — phase status and gate results parsed from phases/*.mdx by the API.
 *
 * DashShell (phase strip) and GateTrack both need the same payload, so the request
 * is shared: one in-flight promise per page load, cached for later mounts.
 */

import { useEffect, useState } from 'react'

export interface GateInfo {
  name: string
  required: boolean
  result: string
  note?: string
  phase?: string
}

export interface PhaseInfo {
  file: string
  id: string
  title: string
  status: string
  gates: GateInfo[]
}

export interface PlanStatus {
  phases: PhaseInfo[]
  gates: GateInfo[]
}

const EMPTY: PlanStatus = { phases: [], gates: [] }

let cached: Promise<PlanStatus> | null = null

function load(): Promise<PlanStatus> {
  if (!cached) {
    cached = fetch('/api/phases')
      .then(r => (r.ok ? r.json() : EMPTY))
      .then((data: unknown) => {
        // Tolerate the older array-of-filenames response shape.
        if (!data || Array.isArray(data) || typeof data !== 'object') return EMPTY
        const { phases, gates } = data as Partial<PlanStatus>
        return { phases: phases ?? [], gates: gates ?? [] }
      })
      .catch(() => EMPTY)
  }
  return cached
}

/** Returns null until the request settles; never throws, so callers can fall back. */
export function usePlanStatus(): PlanStatus | null {
  const [status, setStatus] = useState<PlanStatus | null>(null)

  useEffect(() => {
    let live = true
    load().then(data => {
      if (live) setStatus(data)
    })
    return () => {
      live = false
    }
  }, [])

  return status
}
