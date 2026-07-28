import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { Workshop } from '../lib/types'
import { PhaseStrip } from '../components/PhaseStrip'
import { ArtifactTable } from '../components/ArtifactTable'
import { PreviewFrame } from '../components/PreviewFrame'

interface Props {
  slug: string
  onBack: () => void
}

export function WorkshopDetail({ slug, onBack }: Props) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    api.workshops.get(slug)
      .then(setWorkshop)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" aria-hidden="true" />
        <span>Loading workshop…</span>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div>
        <button className="back-btn" onClick={onBack}>← Back to workshops</button>
        <div className="error-state">{error || 'Workshop not found.'}</div>
      </div>
    )
  }

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        ← All workshops
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">{workshop.dashName}</h1>
          <div className="meta-row" style={{ marginTop: 4 }}>
            <code style={{ fontSize: '12px', background: 'var(--color-bg)', padding: '1px 6px', borderRadius: 4 }}>
              {workshop.slug}
            </code>
            <span className="meta-sep">·</span>
            {workshop.isLegacy ? (
              <span className="badge badge--legacy">Legacy (no dash-config)</span>
            ) : (
              <span className={`badge badge--tier-${workshop.tier}`}>{tierLabel(workshop.tier)}</span>
            )}
            {workshop.sessionMode !== 'unknown' && (
              <>
                <span className="meta-sep">·</span>
                <span style={{ fontSize: '12px' }}>{workshop.sessionMode} mode</span>
              </>
            )}
            {workshop.owner && (
              <>
                <span className="meta-sep">·</span>
                <span style={{ fontSize: '12px' }}>{workshop.owner}</span>
              </>
            )}
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn--secondary btn--sm" onClick={load} title="Refresh">
            <RefreshIcon /> Refresh
          </button>
        </div>
      </div>

      {workshop.isLegacy && (
        <div className="notice">
          This workshop was created without a <code>dash-config.yaml</code>. Artifact tracking
          and gate status may be incomplete. Run{' '}
          <code>/design-dash --phase P0</code> in your agent to migrate it.
        </div>
      )}

      <div className="detail-layout">
        {/* Left column */}
        <div>
          {/* Phase strip */}
          <div className="card detail-section">
            <div className="detail-section-title">Phase progress</div>
            <PhaseStrip phases={workshop.phases} />
            <div style={{ marginTop: 12 }}>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${workshop.progress}%` }} />
              </div>
              <div className="progress-label" style={{ marginTop: 5 }}>
                {workshop.progress}% of required artifacts present
                {workshop.progress < 100 && (
                  <> — suggested resume: <strong>{workshop.suggestedResumePhase}</strong></>
                )}
              </div>
            </div>
          </div>

          {/* Gates */}
          <div className="card detail-section">
            <div className="detail-section-title">Gates</div>
            <div className="gate-chips">
              {workshop.gates.map((g) => (
                <div
                  key={g.phase}
                  className={`gate-chip gate-chip--${
                    g.deferred ? 'deferred' : g.required ? 'required' : 'not-required'
                  }`}
                  title={
                    g.deferred
                      ? 'Deferred — tracked as evidence debt'
                      : g.required
                      ? 'Required for this tier'
                      : 'Not required for this tier'
                  }
                >
                  {g.deferred ? '↩' : g.required ? '!' : '○'} {g.label}
                  <span style={{ fontSize: '10px', opacity: .7, marginLeft: 3 }}>({g.phase})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Artifact table */}
          <div className="card detail-section">
            <div className="detail-section-title">Artifacts</div>
            <ArtifactTable phases={workshop.phases} />
          </div>

          {/* Preview */}
          {workshop.previewableFiles.length > 0 && (
            <div className="detail-section">
              <div className="detail-section-title" style={{ marginBottom: 10 }}>Preview</div>
              <PreviewFrame slug={workshop.slug} previewableFiles={workshop.previewableFiles} />
            </div>
          )}
        </div>

        {/* Right column — action panel */}
        <div>
          <ActionPanel workshop={workshop} />
        </div>
      </div>
    </div>
  )
}

function ActionPanel({ workshop }: { workshop: Workshop }) {
  const [startPrompt, setStartPrompt] = useState('')
  const [resumePrompt, setResumePrompt] = useState('')
  const [loadingPrompts, setLoadingPrompts] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    setLoadingPrompts(true)
    Promise.all([
      api.workshops.startPrompt(workshop.slug),
      api.workshops.resumePrompt(workshop.slug),
    ]).then(([s, r]) => {
      setStartPrompt(s.prompt)
      setResumePrompt(r.prompt)
    }).finally(() => setLoadingPrompts(false))
  }, [workshop.slug])

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      // fallback
    }
  }

  async function openFolder() {
    await api.workshops.openFolder(workshop.slug)
  }

  const inProgress = workshop.phases.some((p) => p.status === 'in-progress')
  const started = workshop.phases.some((p) => p.status === 'done')

  return (
    <div className="action-panel">
      <div className="action-panel-section">
        <div className="action-panel-label">Workspace</div>
        <code style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', display: 'block', wordBreak: 'break-all' }}>
          {workshop.workspaceRoot}
        </code>
        <button className="btn btn--ghost btn--sm" style={{ marginTop: 8 }} onClick={openFolder}>
          <FolderIcon /> Open in Finder
        </button>
      </div>

      {loadingPrompts ? (
        <div className="action-panel-section" style={{ textAlign: 'center' }}>
          <div className="spinner" aria-hidden="true" />
        </div>
      ) : (
        <>
          {!started && (
            <div className="action-panel-section">
              <div className="action-panel-label">Start this dash</div>
              <div className="prompt-block">{startPrompt}</div>
              <div className="copy-btn-row">
                {copiedKey === 'start' ? (
                  <span className="copied-label">Copied!</span>
                ) : (
                  <button className="btn btn--primary btn--sm" onClick={() => copy(startPrompt, 'start')}>
                    <CopyIcon /> Copy start prompt
                  </button>
                )}
              </div>
            </div>
          )}

          {(started || inProgress) && (
            <div className="action-panel-section">
              <div className="action-panel-label">
                {workshop.progress === 100 ? 'Restart or review' : `Resume at ${workshop.suggestedResumePhase}`}
              </div>
              <div className="prompt-block">{resumePrompt}</div>
              <div className="copy-btn-row">
                {copiedKey === 'resume' ? (
                  <span className="copied-label">Copied!</span>
                ) : (
                  <button className="btn btn--primary btn--sm" onClick={() => copy(resumePrompt, 'resume')}>
                    <CopyIcon /> Copy resume prompt
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="action-panel-section">
        <div className="action-panel-label">Workspace contract</div>
        <ContractChecklist workshop={workshop} />
      </div>
    </div>
  )
}

function ContractChecklist({ workshop }: { workshop: Workshop }) {
  const items = [
    {
      label: 'dash-config.yaml present',
      ok: !workshop.isLegacy,
      hint: 'Run /design-dash from agent to create',
    },
    {
      label: 'prototype workspace set',
      ok: Boolean(workshop.prototypeWorkspace || workshop.prototypeRile),
      hint: 'Optional — P7 stub mode is valid without it',
    },
    {
      label: 'Tier classified',
      ok: workshop.tier !== 'unknown',
      hint: 'P0 tier classifier sets this',
    },
  ]
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: 7 }}>
      {items.map((item) => (
        <li key={item.label} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
          <span style={{ color: item.ok ? 'var(--done)' : '#ccc', fontWeight: 700, marginTop: 1 }}>
            {item.ok ? '✓' : '○'}
          </span>
          <span>
            <span style={{ color: item.ok ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
              {item.label}
            </span>
            {!item.ok && (
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 1 }}>
                {item.hint}
              </div>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

function tierLabel(tier: string) {
  if (tier === 'high-stakes') return 'High-stakes'
  if (tier === 'express') return 'Express'
  if (tier === 'standard') return 'Standard'
  return 'Unknown tier'
}

function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-5" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}
