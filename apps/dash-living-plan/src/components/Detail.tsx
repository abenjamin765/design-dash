import React from 'react'

interface DetailProps {
  summary: string
  children?: React.ReactNode
}

/**
 * Detail — rigor kept out of the reading line. Native <details> so it works without
 * JavaScript, prints open in most browsers, and stays keyboard-accessible for free.
 */
export function Detail({ summary, children }: DetailProps) {
  return (
    <details className="detail">
      <summary className="detail__summary">{summary}</summary>
      <div className="detail__body">{children}</div>
    </details>
  )
}
