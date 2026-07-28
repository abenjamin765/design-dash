import React from 'react'

interface ConceptCompareProps {
  children?: React.ReactNode
}

/**
 * ConceptCompare — lays out ConceptCard children side by side so the options can be
 * read against each other instead of sequentially down the page.
 */
export function ConceptCompare({ children }: ConceptCompareProps) {
  return (
    <div className="concept-compare wide-block" role="group" aria-label="Concept comparison">
      {children}
    </div>
  )
}
