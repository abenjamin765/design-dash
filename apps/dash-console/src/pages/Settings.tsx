import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { ConsoleConfig } from '../lib/types'

export function Settings() {
  const [config, setConfig] = useState<ConsoleConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [newRoot, setNewRoot] = useState('')
  const [rootValidation, setRootValidation] = useState<{ valid?: boolean; resolved?: string } | null>(null)
  const [validating, setValidating] = useState(false)

  useEffect(() => {
    api.config.get()
      .then(setConfig)
      .finally(() => setLoading(false))
  }, [])

  async function validateRoot(value: string) {
    if (!value.trim()) { setRootValidation(null); return }
    setValidating(true)
    try {
      const result = await api.validateWorkspace(value.trim())
      setRootValidation(result)
    } catch {
      setRootValidation({ valid: false })
    } finally {
      setValidating(false)
    }
  }

  async function addRoot() {
    if (!config || !newRoot.trim()) return
    const resolved = rootValidation?.resolved ?? newRoot.trim()
    const next = { ...config, workspaceRoots: [...config.workspaceRoots, resolved] }
    setConfig(next)
    setNewRoot('')
    setRootValidation(null)
    await save(next)
  }

  async function removeRoot(root: string) {
    if (!config) return
    const next = { ...config, workspaceRoots: config.workspaceRoots.filter((r) => r !== root) }
    setConfig(next)
    await save(next)
  }

  async function save(c: ConsoleConfig) {
    setSaving(true)
    try {
      await api.config.set(c)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" aria-hidden="true" />
        <span>Loading settings…</span>
      </div>
    )
  }

  if (!config) return null

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        {saved && <span style={{ fontSize: '13px', color: 'var(--done)', marginLeft: 'auto' }}>Saved</span>}
      </div>

      <div className="card settings-section">
        <div className="settings-section-title">Workspace Roots</div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Add the workspace roots that contain <code>dashes/</code>. The console
          scans each root for workshops.
        </p>

        <div className="workspace-list">
          {config.workspaceRoots.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              No workspace roots configured yet.
            </p>
          )}
          {config.workspaceRoots.map((root) => (
            <div key={root} className="workspace-row">
              <span className="workspace-path" title={root}>{root}</span>
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => removeRoot(root)}
                aria-label={`Remove ${root}`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        <div className="workspace-add-row">
          <input
            className="workspace-input"
            placeholder="~/Sites/design-dash"
            value={newRoot}
            onChange={(e) => { setNewRoot(e.target.value); setRootValidation(null) }}
            onBlur={() => validateRoot(newRoot)}
            onKeyDown={(e) => { if (e.key === 'Enter') addRoot() }}
            aria-label="New workspace root path"
          />
          <button
            className="btn btn--primary"
            onClick={addRoot}
            disabled={!newRoot.trim() || validating}
          >
            {validating ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <PlusIcon />}
            Add
          </button>
        </div>

        {rootValidation && (
          <div className={`workspace-status workspace-status--${rootValidation.valid ? 'ok' : 'err'}`}>
            {rootValidation.valid
              ? `✓ Valid — dashes/ found at ${rootValidation.resolved}`
              : `✗ No dashes/ directory found at that path`}
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          <strong>Note:</strong> Workspace roots are stored in{' '}
          <code>~/.config/design-dash/console.json</code> on your machine — they are never
          committed to the repo. The console only reads from configured roots (no arbitrary FS
          access).
        </div>
      </div>

      <div className="card settings-section">
        <div className="settings-section-title">Design Skills Repo</div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 14 }}>
          Optional. Used to copy templates when creating a new workshop stub. Defaults to the
          repo that contains this console.
        </p>
        <div className="form-field">
          <label className="form-label" htmlFor="skills-repo">Skills repo path</label>
          <input
            id="skills-repo"
            className="form-input"
            value={config.skillsRepo ?? ''}
            onChange={(e) => setConfig({ ...config, skillsRepo: e.target.value || undefined })}
            placeholder="~/Sites/design-dash"
          />
        </div>
        <button
          className="btn btn--primary"
          onClick={() => save(config)}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
