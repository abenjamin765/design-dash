import { useState } from 'react'

interface Props {
  slug: string
  previewableFiles: string[]
}

export function PreviewFrame({ slug, previewableFiles }: Props) {
  const [selected, setSelected] = useState(previewableFiles[0] ?? '')
  const [height, setHeight] = useState(520)

  if (previewableFiles.length === 0) {
    return (
      <div
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '40px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '13px',
        }}
      >
        No HTML artifacts to preview yet.
      </div>
    )
  }

  const src = `/preview/${slug}/${selected}`

  return (
    <div className="preview-wrapper">
      <div className="preview-toolbar">
        <select
          className="preview-file-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          aria-label="Select artifact to preview"
        >
          {previewableFiles.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => window.open(src, '_blank')}
          title="Open in new tab"
        >
          <OpenIcon /> Open
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <label
            htmlFor="preview-height"
            style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}
          >
            Height
          </label>
          <input
            id="preview-height"
            type="range"
            min={300}
            max={1200}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            style={{ width: 70 }}
          />
        </div>
      </div>
      <iframe
        key={src}
        src={src}
        className="preview-frame"
        style={{ height: `${height}px` }}
        title={`Preview: ${selected}`}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}

function OpenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
