import React from 'react'
import { useEnterAttention } from '../hooks/useEnterAttention'

interface DecisionProps {
  title: string
  rationale?: string
  children?: React.ReactNode
}

/**
 * Decision — a locked design decision with rationale.
 * Motion: enter flash draws the eye when the agent locks a new decision.
 */
export function Decision({ title, rationale, children }: DecisionProps) {
  const ref = useEnterAttention<HTMLDivElement>(title)

  return (
    <div ref={ref} className="decision">
      <div className="decision__header">
        <span className="decision__icon" aria-hidden="true">✓</span>
        <strong className="decision__title">{title}</strong>
      </div>
      {rationale && <p className="decision__rationale">{rationale}</p>}
      {children && <div className="decision__body">{children}</div>}
    </div>
  )
}
