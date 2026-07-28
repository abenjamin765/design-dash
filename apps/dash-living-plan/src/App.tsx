import { Suspense, useState, useEffect } from 'react'
import { PlanLoader, hasPlanDocument } from './PlanLoader'
import { markPlanHydrated } from './hooks/useEnterAttention'

interface Meta {
  slug?: string
  title?: string
  tier?: string
  sessionMode?: string
  currentPhase?: string
}

export default function App() {
  const [meta, setMeta] = useState<Meta | null>(null)
  const [apiDown, setApiDown] = useState(false)

  useEffect(() => {
    fetch('/api/meta')
      .then(r => r.json())
      .then(setMeta)
      .catch(() => setApiDown(true))
  }, [])

  // After first paint settles, enable enter-attention flashes for mid-dash updates.
  // Avoids a cascade of flashes when the full plan loads.
  useEffect(() => {
    const t = window.setTimeout(() => markPlanHydrated(), 450)
    return () => window.clearTimeout(t)
  }, [])

  // plan.mdx's DashShell is the canonical home for title, tier, mode, and the phase
  // strip. The chrome bar stays thin: product identity plus the slug. Only when there
  // is no plan.mdx does it fall back to showing meta.yaml's tier and mode itself.
  const showMetaBadges = !hasPlanDocument && meta

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header__brand">Design Dash</span>
        <span className="app-header__label">Living Plan</span>
        <span className="app-header__meta">
          {meta?.slug && <code className="app-header__slug">{meta.slug}</code>}
          {showMetaBadges && meta.tier && (
            <span className={`badge badge--tier badge--${meta.tier}`}>{meta.tier}</span>
          )}
          {showMetaBadges && meta.sessionMode && <span className="badge">{meta.sessionMode}</span>}
          {apiDown && (
            <span className="badge badge--warn" title="Phase status and gate results are unavailable">
              API offline
            </span>
          )}
        </span>
      </header>
      <main className="app-main">
        <Suspense fallback={<div className="loading">Loading plan…</div>}>
          <PlanLoader />
        </Suspense>
      </main>
    </div>
  )
}
