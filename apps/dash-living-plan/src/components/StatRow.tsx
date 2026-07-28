import React from 'react'

interface StatRowProps {
  /** Rendered verbatim — "4 of 24", "~2,000", "4/5". Numbers are accepted too. */
  value: string | number
  label?: string
  children?: React.ReactNode
}

/**
 * StatRow — a big-number callout ("4 of 24 students", "~2,000 students / 80 teachers").
 * Adjacent StatRows sit on one line; children carry the caveat or source.
 */
export function StatRow({ value, label, children }: StatRowProps) {
  return (
    <div className="stat-row">
      <span className="stat-row__value">{value}</span>
      {label && <span className="stat-row__label">{label}</span>}
      {children && <div className="stat-row__note">{children}</div>}
    </div>
  )
}
