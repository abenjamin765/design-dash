/**
 * PlanPhases — renders every phase MDX file from the living-plan directory, in order.
 *
 * Authors place this inside <DashShell> in plan.mdx to say where the phases go.
 * Uses Vite's import.meta.glob with the @plan alias (→ DASH_LIVING_PLAN_DIR); the
 * glob argument must be a string literal, so the alias does the pointing.
 * Hot-module replacement fires automatically when the agent edits any phase file.
 */

import React, { Suspense, lazy, useEffect } from 'react'

const phaseModules = import.meta.glob('@plan/phases/*.mdx', { eager: false })

// Plans authored before PlanPhases existed have no <PlanPhases /> in plan.mdx.
// PlanLoader checks this after the plan document commits and appends the phases
// itself rather than silently rendering a plan with no phases.
let mounted = 0

export function planPhasesMounted() {
  return mounted > 0
}

// Sort by filename so p0 < p1 < … < p8 (numeric, so p10 would still follow p9)
const sortedKeys = Object.keys(phaseModules).sort((a, b) => {
  const nameA = a.split('/').pop() ?? a
  const nameB = b.split('/').pop() ?? b
  return nameA.localeCompare(nameB, undefined, { numeric: true })
})

// Built once at module scope: a lazy() created during render would be a new
// component type every pass, remounting every phase whenever the shell re-renders.
const phases = sortedKeys.map(key => ({
  key,
  name: key.split('/').pop()?.replace('.mdx', '') ?? key,
  Content: lazy(phaseModules[key] as () => Promise<{ default: React.ComponentType }>),
}))

export function PlanPhases() {
  useEffect(() => {
    mounted += 1
    return () => {
      mounted -= 1
    }
  }, [])

  if (!phases.length) {
    return (
      <div className="empty-state">
        <p>No phase files found.</p>
        <p>
          Run: <code>node cli.mjs seed --dir &lt;workshop-dir&gt; --slug &lt;slug&gt;</code>
        </p>
      </div>
    )
  }

  return (
    <div className="plan-phases">
      {phases.map(({ key, name, Content }) => (
        <Suspense key={key} fallback={<div className="loading">Loading {name}…</div>}>
          <Content />
        </Suspense>
      ))}
    </div>
  )
}
