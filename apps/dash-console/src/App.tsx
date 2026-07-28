import { useState, useEffect } from 'react'
import { WorkshopList } from './pages/WorkshopList'
import { WorkshopDetail } from './pages/WorkshopDetail'
import { Settings } from './pages/Settings'
import { NewWorkshop } from './pages/NewWorkshop'
import './index.css'

export type Route =
  | { page: 'list' }
  | { page: 'detail'; slug: string }
  | { page: 'settings' }
  | { page: 'new' }

export default function App() {
  const [route, setRoute] = useState<Route>({ page: 'list' })

  // Simple hash-based navigation so the page survives refresh
  useEffect(() => {
    const handle = () => {
      const hash = window.location.hash.slice(1)
      if (hash.startsWith('/workshop/')) {
        setRoute({ page: 'detail', slug: hash.slice('/workshop/'.length) })
      } else if (hash === '/settings') {
        setRoute({ page: 'settings' })
      } else if (hash === '/new') {
        setRoute({ page: 'new' })
      } else {
        setRoute({ page: 'list' })
      }
    }
    handle()
    window.addEventListener('hashchange', handle)
    return () => window.removeEventListener('hashchange', handle)
  }, [])

  function navigate(r: Route) {
    if (r.page === 'list') window.location.hash = '/'
    else if (r.page === 'detail') window.location.hash = `/workshop/${r.slug}`
    else if (r.page === 'settings') window.location.hash = '/settings'
    else if (r.page === 'new') window.location.hash = '/new'
    setRoute(r)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a href="#/" className="app-logo" onClick={() => navigate({ page: 'list' })}>
          <LogoMark />
          <span className="app-logo-text">Design Dash</span>
          <span className="app-logo-sub">Workshop Console</span>
        </a>
        <nav className="app-nav">
          <button
            className={`nav-btn${route.page === 'list' ? ' nav-btn--active' : ''}`}
            onClick={() => navigate({ page: 'list' })}
          >
            Workshops
          </button>
          <button
            className={`nav-btn${route.page === 'new' ? ' nav-btn--active' : ''}`}
            onClick={() => navigate({ page: 'new' })}
          >
            New Workshop
          </button>
          <button
            className={`nav-btn${route.page === 'settings' ? ' nav-btn--active' : ''}`}
            onClick={() => navigate({ page: 'settings' })}
          >
            Settings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {route.page === 'list' && (
          <WorkshopList onSelect={(slug) => navigate({ page: 'detail', slug })} />
        )}
        {route.page === 'detail' && (
          <WorkshopDetail
            slug={route.slug}
            onBack={() => navigate({ page: 'list' })}
          />
        )}
        {route.page === 'settings' && <Settings />}
        {route.page === 'new' && (
          <NewWorkshop
            onCreated={(slug) => navigate({ page: 'detail', slug })}
            onCancel={() => navigate({ page: 'list' })}
          />
        )}
      </main>
    </div>
  )
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="14" fill="#FFDF65" />
      <path
        d="M9 19L14 9l5 10"
        stroke="#000"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="10.8" y1="15.5" x2="17.2" y2="15.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
