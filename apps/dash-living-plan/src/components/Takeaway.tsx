import React from 'react'
import { useEnterAttention } from '../hooks/useEnterAttention'

interface TakeawayProps {
  children?: React.ReactNode
}

/**
 * Takeaway — the one plain-language sentence a reader gets if they read nothing else.
 * Pinned at the top of a phase, above any prose or tables.
 */
export function Takeaway({ children }: TakeawayProps) {
  const ref = useEnterAttention<HTMLDivElement>()

  return (
    <div ref={ref} className="takeaway">
      <span className="takeaway__label">Takeaway</span>
      <div className="takeaway__body">{children}</div>
    </div>
  )
}
