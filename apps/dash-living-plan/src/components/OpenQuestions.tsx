import React from 'react'

interface OpenQuestionsProps {
  children?: React.ReactNode
}

/**
 * OpenQuestions — single parking lot for unresolved items.
 *
 * Visual Plan discipline: only one OpenQuestions block per plan, always at the bottom.
 * Agent adds questions as Markdown list items inside this component.
 *
 * Example MDX:
 * <OpenQuestions>
 * - What is the export heading schema for flow.md? Owner: Dev. Unblocks: export.mjs impl.
 * - Should dash-console list living-plan/ in v1?
 * </OpenQuestions>
 */
export function OpenQuestions({ children }: OpenQuestionsProps) {
  return (
    <aside className="open-questions" aria-label="Open questions">
      <h2 className="open-questions__title">Open Questions</h2>
      <div className="open-questions__body">{children}</div>
    </aside>
  )
}
