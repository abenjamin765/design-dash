import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { ConsoleConfig } from '../lib/types'

interface Props {
  onCreated: (slug: string) => void
  onCancel: () => void
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export function NewWorkshop({ onCreated, onCancel }: Props) {
  const [config, setConfig] = useState<ConsoleConfig | null>(null)
  const [dashName, setDashName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [owner, setOwner] = useState('')
  const [sessionMode, setSessionMode] = useState<'interactive' | 'solo'>('interactive')
  const [workspaceRoot, setWorkspaceRoot] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.config.get().then((c) => {
      setConfig(c)
      if (c.workspaceRoots[0]) setWorkspaceRoot(c.workspaceRoots[0])
    })
  }, [])

  // Auto-derive slug from name unless user has manually edited it
  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(dashName))
    }
  }, [dashName, slugManual])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dashName.trim() || !slug.trim() || !workspaceRoot) return
    setCreating(true)
    setError('')
    try {
      await api.workshops.create({ slug, dashName: dashName.trim(), owner: owner.trim(), sessionMode, workspaceRoot })
      onCreated(slug)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create workshop')
    } finally {
      setCreating(false)
    }
  }

  if (!config) {
    return (
      <div className="loading-state">
        <div className="spinner" aria-hidden="true" />
      </div>
    )
  }

  if (config.workspaceRoots.length === 0) {
    return (
      <div style={{ maxWidth: 560 }}>
        <div className="page-header">
          <h1 className="page-title">New Workshop</h1>
        </div>
        <div className="notice">
          No workspace roots configured. Add a workspace root in{' '}
          <a href="#/settings" style={{ fontWeight: 600 }}>Settings</a> before creating a workshop.
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <h1 className="page-title">New Workshop</h1>
      </div>

      <div className="card">
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 20 }}>
          Creates a workshop stub under <code>dashes/{'{slug}'}/</code> with a seeded
          <code>dash-config.yaml</code> and <code>assumptions.md</code>. Tier classification
          happens in P0 when you run the agent.
        </p>

        {error && <div className="error-state" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="dash-name">Workshop name *</label>
            <input
              id="dash-name"
              className="form-input"
              value={dashName}
              onChange={(e) => setDashName(e.target.value)}
              placeholder="Teacher Grade Entry Redesign"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="slug">Slug *</label>
            <input
              id="slug"
              className={`form-input${slug && !/^[a-z0-9-]+$/.test(slug) ? ' invalid' : ''}`}
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
              placeholder="teacher-grade-entry-2026-06"
              required
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, and hyphens only"
            />
            <div className="form-hint">Lowercase, hyphens only. Used as the folder name.</div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="owner">Lead designer</label>
            <input
              id="owner"
              className="form-input"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="session-mode">Session mode</label>
            <select
              id="session-mode"
              className="form-select"
              value={sessionMode}
              onChange={(e) => setSessionMode(e.target.value as 'interactive' | 'solo')}
            >
              <option value="interactive">Interactive — pause at every checkpoint</option>
              <option value="solo">Solo / auto — pause at phase boundaries only</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="workspace-root">Workspace root *</label>
            <select
              id="workspace-root"
              className="form-select"
              value={workspaceRoot}
              onChange={(e) => setWorkspaceRoot(e.target.value)}
              required
            >
              {config.workspaceRoots.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div className="form-hint">
              Workshop will be created at{' '}
              <code>{workspaceRoot}/dashes/{slug || '{slug}'}/</code>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={creating || !dashName || !slug || !workspaceRoot}>
              {creating ? 'Creating…' : 'Create workshop'}
            </button>
          </div>
        </form>
      </div>

      <div className="notice" style={{ marginTop: 16 }}>
        <strong>Next step:</strong> After creating the stub, open your agent (Cursor or Claude Code)
        in <code>{workspaceRoot}</code> and run{' '}
        <code>/design-dash{sessionMode === 'solo' ? ' --solo' : ''}</code>.
      </div>
    </div>
  )
}
