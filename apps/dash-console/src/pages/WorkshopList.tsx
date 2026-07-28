import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { Workshop, Tier } from '../lib/types'

interface Props {
  onSelect: (slug: string) => void
}

function tierLabel(tier: Tier) {
  if (tier === 'high-stakes') return 'High-stakes'
  if (tier === 'express') return 'Express'
  if (tier === 'standard') return 'Standard'
  return 'Unknown'
}

function tierClass(tier: Tier) {
  if (tier === 'high-stakes') return 'badge--tier-high-stakes'
  if (tier === 'express') return 'badge--tier-express'
  if (tier === 'standard') return 'badge--tier-standard'
  return 'badge--tier-unknown'
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

export function WorkshopList({ onSelect }: Props) {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [showIncomplete, setShowIncomplete] = useState(false)

  useEffect(() => {
    api.workshops.list()
      .then(setWorkshops)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = workshops.filter((w) => {
    if (search && !w.dashName.toLowerCase().includes(search.toLowerCase()) &&
        !w.slug.toLowerCase().includes(search.toLowerCase())) return false
    if (tierFilter !== 'all' && w.tier !== tierFilter) return false
    if (showIncomplete && w.progress === 100) return false
    return true
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Workshops</h1>
        <div className="page-header-actions">
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {workshops.length} workshop{workshops.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="workshop-list-filters">
        <input
          className="search-input"
          placeholder="Search by name or slug…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search workshops"
        />
        <select
          className="filter-select"
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          aria-label="Filter by tier"
        >
          <option value="all">All tiers</option>
          <option value="express">Express</option>
          <option value="standard">Standard</option>
          <option value="high-stakes">High-stakes</option>
          <option value="unknown">Unknown tier</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showIncomplete}
            onChange={(e) => setShowIncomplete(e.target.checked)}
          />
          Incomplete only
        </label>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" aria-hidden="true" />
          <span>Scanning workshops…</span>
        </div>
      )}

      {error && <div className="error-state">Failed to load workshops: {error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">
            {workshops.length === 0 ? 'No workshops found' : 'No results'}
          </div>
          <p>
            {workshops.length === 0
              ? 'Make sure your workspace roots are configured in Settings.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      )}

      <div className="workshop-grid">
        {filtered.map((w) => (
          <button
            key={`${w.workspaceRoot}::${w.slug}`}
            className={`workshop-card${w.isLegacy ? ' workshop-card--legacy' : ''}`}
            onClick={() => onSelect(w.slug)}
            aria-label={`Open workshop: ${w.dashName}`}
          >
            <div className="workshop-card-header">
              <div className="workshop-card-name">{w.dashName}</div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <span className={`badge ${tierClass(w.tier)}`}>{tierLabel(w.tier)}</span>
                {w.isLegacy && <span className="badge badge--legacy">Legacy</span>}
                {w.sessionMode === 'solo' && <span className="badge badge--solo">Solo</span>}
              </div>
            </div>
            <div className="workshop-card-slug">{w.slug}</div>
            <div className="workshop-card-meta">
              {w.owner && <span>{w.owner}</span>}
              {w.owner && w.startDate && <span className="meta-sep">·</span>}
              {w.startDate && <span>{formatDate(w.startDate)}</span>}
              {(w.owner || w.startDate) && <span className="meta-sep">·</span>}
              <span>Updated {formatDate(w.lastModified)}</span>
            </div>
            <div className="workshop-card-progress">
              <div className="progress-bar" aria-hidden="true">
                <div className="progress-bar-fill" style={{ width: `${w.progress}%` }} />
              </div>
              <div className="progress-label">{w.progress}% artifacts complete</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
