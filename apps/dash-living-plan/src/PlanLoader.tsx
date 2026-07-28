/**
 * PlanLoader — renders plan.mdx, the root document of a living plan.
 *
 * plan.mdx owns the page: <DashShell> supplies the title, tier/mode badges, and the
 * P0–P8 strip, <PlanPhases /> marks where the phase files go, and <OpenQuestions>
 * closes it out. Everything reaches MDX through the root MDXProvider, so plan.mdx
 * needs no imports.
 *
 * Two graceful fallbacks, because `check` accepts both shapes:
 * - no plan.mdx at all → render the phases on their own
 * - a plan.mdx with no <PlanPhases /> (every plan seeded before it existed) →
 *   append the phases after the document
 */

import React, { Suspense, lazy, useEffect, useState } from 'react'
import { PlanPhases, planPhasesMounted } from './components/PlanPhases'

// Vite resolves @plan → DASH_LIVING_PLAN_DIR at startup; the glob must be a literal.
const planModules = import.meta.glob('@plan/plan.mdx', { eager: false })
const planKey = Object.keys(planModules)[0]

/** True when the plan has a root document — i.e. DashShell is rendering the header. */
export const hasPlanDocument = Boolean(planKey)

const PlanDocument = planKey
  ? lazy(planModules[planKey] as () => Promise<{ default: React.ComponentType }>)
  : null

function PlanDocumentWithPhases({ document: Document }: { document: React.ComponentType }) {
  const [phasesMissing, setPhasesMissing] = useState(false)

  // Child effects commit before this one, so PlanPhases has already registered
  // itself if plan.mdx contains it.
  useEffect(() => {
    setPhasesMissing(!planPhasesMounted())
  }, [])

  return (
    <>
      <Document />
      {phasesMissing && (
        <>
          <p className="notice">
            <code>plan.mdx</code> has no <code>&lt;PlanPhases /&gt;</code>, so the phase files are
            appended below. Add the tag inside <code>&lt;DashShell&gt;</code> to place them yourself.
          </p>
          <PlanPhases />
        </>
      )}
    </>
  )
}

export function PlanLoader() {
  if (!PlanDocument) {
    return (
      <>
        <p className="notice">
          No <code>plan.mdx</code> in this directory — showing phase files only.
        </p>
        <PlanPhases />
      </>
    )
  }

  return (
    <Suspense fallback={<div className="loading">Loading plan…</div>}>
      <PlanDocumentWithPhases document={PlanDocument} />
    </Suspense>
  )
}
