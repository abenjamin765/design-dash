import React from 'react'

interface PlaceholderProps {
  example: string
  children?: React.ReactNode
}

/**
 * Placeholder — shows didactic example content until replaced by the agent.
 * No enter flash: placeholders are ambient scaffolding, not new decisions.
 * Soft breathing border keeps "still to fill" visible without demanding attention.
 */
export function Placeholder({ example, children }: PlaceholderProps) {
  return (
    <div className="placeholder" aria-label="Example placeholder — not real content" role="note">
      <div className="placeholder__banner" aria-hidden="true">EXAMPLE — replace this content</div>
      <div className="placeholder__example">
        <span className="placeholder__label">Example:</span> {example}
      </div>
      {children && <div className="placeholder__body">{children}</div>}
    </div>
  )
}
