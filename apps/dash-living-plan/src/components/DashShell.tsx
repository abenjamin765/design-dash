import React from 'react'
import { usePlanStatus } from '../hooks/usePlanStatus'

interface DashShellProps {
  slug: string
  title: string
  tier: 'express' | 'standard' | 'high-stakes'
  sessionMode?: 'interactive' | 'solo'
  currentPhase?: string
  children?: React.ReactNode
}

const PHASES = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']

type StripState = 'done' | 'in-progress' | 'active' | 'pending'

const STATE_LABEL: Record<StripState, string> = {
  done: 'done',
  'in-progress': 'in progress',
  active: 'current',
  pending: 'not started',
}

/**
 * DashShell — document root for a living plan.
 * Renders the plan title, tier/mode strip, and the P0–P8 phase progress indicator.
 * Always placed once at the top of plan.mdx.
 *
 * Phase states come from the API's parse of phases/*.mdx, so the strip shows what the
 * files actually say. If the API is unreachable, it falls back to inferring progress
 * from currentPhase.
 */
export function DashShell({ slug, title, tier, sessionMode = 'interactive', currentPhase, children }: DashShellProps) {
  const status = usePlanStatus()
  const current = currentPhase?.toUpperCase()
  const currentIdx = current ? PHASES.indexOf(current) : -1

  const byId = new Map((status?.phases ?? []).map(phase => [phase.id, phase]))
  // Once the files have spoken, a phase with no file is genuinely not started —
  // only guess from currentPhase when there is nothing to read.
  const hasParsedPhases = byId.size > 0

  return (
    <div className="dash-shell" data-slug={slug} data-tier={tier}>
      <div className="dash-shell__header">
        <h1 className="dash-shell__title">{title}</h1>
        <div className="dash-shell__meta">
          <span className={`badge badge--tier badge--${tier}`}>{tier}</span>
          <span className="badge badge--mode">{sessionMode}</span>
          {current && <span className="badge badge--phase">Current: {current}</span>}
        </div>
      </div>

      <nav className="phase-strip" aria-label="Design Dash phases">
        {PHASES.map((phase, i) => {
          const parsed = byId.get(phase)
          let state: StripState
          if (parsed) {
            state = parsed.status === 'done' ? 'done' : parsed.status === 'in-progress' ? 'in-progress' : 'pending'
          } else if (hasParsedPhases) {
            state = 'pending'
          } else {
            state = i < currentIdx ? 'done' : 'pending'
          }
          const isCurrent = phase === current
          if (isCurrent && state === 'pending') state = 'active'

          return (
            <a
              key={phase}
              href={`#${phase.toLowerCase()}`}
              className={`phase-strip__item phase-strip__item--${state}${isCurrent ? ' phase-strip__item--current' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              title={parsed ? `${phase} — ${parsed.title} (${STATE_LABEL[state]})` : `${phase} (${STATE_LABEL[state]})`}
            >
              {phase}
            </a>
          )
        })}
      </nav>

      {children}
    </div>
  )
}
