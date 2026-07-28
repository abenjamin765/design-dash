import React from 'react'
import { useEnterAttention } from '../hooks/useEnterAttention'

type Score = number | string

interface ConceptCardProps {
  name: string
  surface?: string
  action?: string
  userScore?: Score
  businessScore?: Score
  selected?: boolean
  children?: React.ReactNode
}

const DEFAULT_MAX = 5

/** Accepts 4, "4", or "4/5" — MDX authors write all three. */
function parseScore(score: Score): { value: number; max: number } | null {
  const raw = String(score).trim()
  const m = raw.match(/^(-?\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?))?/)
  if (!m) return null
  const value = Number(m[1])
  const max = m[2] ? Number(m[2]) : DEFAULT_MAX
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return null
  return { value, max }
}

function ScoreBar({ label, score }: { label: string; score: Score }) {
  const parsed = parseScore(score)
  if (!parsed) {
    return (
      <div className="concept-card__score">
        <span className="concept-card__score-label">{label}</span>
        <span className="concept-card__score-value">{score}</span>
      </div>
    )
  }
  const pct = Math.max(0, Math.min(100, (parsed.value / parsed.max) * 100))
  return (
    <div className="concept-card__score">
      <span className="concept-card__score-label">{label}</span>
      <span
        className="concept-card__score-bar"
        role="img"
        aria-label={`${label}: ${parsed.value} out of ${parsed.max}`}
      >
        <span className="concept-card__score-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="concept-card__score-value">
        {parsed.value}/{parsed.max}
      </span>
    </div>
  )
}

/**
 * ConceptCard — one option in a ConceptCompare, with its scores and rationale.
 * The selected concept is marked in text as well as color, per the a11y floor.
 */
export function ConceptCard({
  name,
  surface,
  action,
  userScore,
  businessScore,
  selected = false,
  children,
}: ConceptCardProps) {
  const ref = useEnterAttention<HTMLDivElement>(`${name}:${selected}`)

  return (
    <div
      ref={ref}
      className={`concept-card${selected ? ' concept-card--selected' : ''}`}
      data-concept={name}
      data-selected={String(selected)}
    >
      <div className="concept-card__header">
        <h4 className="concept-card__name">{name}</h4>
        {selected && <span className="concept-card__badge">✓ Selected</span>}
      </div>

      {(surface || action) && (
        <dl className="concept-card__facts">
          {surface && (
            <div className="concept-card__fact">
              <dt>Surface</dt>
              <dd>{surface}</dd>
            </div>
          )}
          {action && (
            <div className="concept-card__fact">
              <dt>Action</dt>
              <dd>{action}</dd>
            </div>
          )}
        </dl>
      )}

      {(userScore !== undefined || businessScore !== undefined) && (
        <div className="concept-card__scores">
          {userScore !== undefined && <ScoreBar label="User" score={userScore} />}
          {businessScore !== undefined && <ScoreBar label="Business" score={businessScore} />}
        </div>
      )}

      {children && <div className="concept-card__body">{children}</div>}
    </div>
  )
}
