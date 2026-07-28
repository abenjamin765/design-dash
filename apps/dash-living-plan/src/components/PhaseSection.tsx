import React, { useEffect, useRef } from 'react'
import { useEnterAttention } from '../hooks/useEnterAttention'

type PhaseStatus = 'placeholder' | 'in-progress' | 'done'

interface PhaseSectionProps {
  id: string
  title: string
  status: PhaseStatus
  children?: React.ReactNode
}

const STATUS_LABEL: Record<PhaseStatus, string> = {
  placeholder: 'Not started',
  'in-progress': 'In progress',
  done: 'Done',
}

/**
 * PhaseSection — wraps all content for one Design Dash phase (P0–P8).
 * Agent flips status from placeholder → in-progress → done.
 * Never delete phase shells — only populate them.
 *
 * Motion: flashes on mount/status change; scrolls into view when in-progress.
 */
export function PhaseSection({ id, title, status, children }: PhaseSectionProps) {
  const attentionRef = useEnterAttention<HTMLElement>(status)
  const didScroll = useRef(false)

  useEffect(() => {
    if (status !== 'in-progress') {
      didScroll.current = false
      return
    }
    if (didScroll.current) return
    const el = attentionRef.current
    if (!el) return
    didScroll.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [status, attentionRef])

  return (
    <section
      ref={attentionRef}
      id={id.toLowerCase()}
      className={`phase-section phase-section--${status}`}
      data-phase={id}
      data-status={status}
      aria-label={`${id}: ${title}`}
    >
      <header className="phase-section__header">
        <h2 className="phase-section__title">
          <span className="phase-section__id">{id.toUpperCase()}</span>
          {title}
        </h2>
        <span
          className={`status-chip status-chip--${status}`}
          aria-label={`Status: ${STATUS_LABEL[status]}`}
        >
          <span className="status-chip__dot" aria-hidden="true" />
          {STATUS_LABEL[status]}
        </span>
      </header>
      <div className="phase-section__body">{children}</div>
    </section>
  )
}
