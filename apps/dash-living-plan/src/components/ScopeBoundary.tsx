import React from 'react'

interface ScopeBoundaryProps {
  children?: React.ReactNode
}

interface Column {
  heading: React.ReactElement | null
  text: string
  body: React.ReactNode[]
}

function isHeading(node: React.ReactNode): node is React.ReactElement {
  return React.isValidElement(node) && typeof node.type === 'string' && /^h[1-6]$/.test(node.type)
}

function flattenText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (React.isValidElement(node)) {
    return flattenText((node.props as { children?: React.ReactNode }).children)
  }
  return ''
}

/**
 * ScopeBoundary — in scope versus out of scope, side by side.
 *
 * Authors write `## In scope` / `## Out of scope` as ordinary Markdown inside the
 * component; each heading opens a column, so the content stays exportable prose.
 */
export function ScopeBoundary({ children }: ScopeBoundaryProps) {
  const columns: Column[] = []

  for (const child of React.Children.toArray(children)) {
    if (isHeading(child)) {
      const text = flattenText((child.props as { children?: React.ReactNode }).children)
      columns.push({ heading: child, text, body: [] })
    } else if (columns.length) {
      columns[columns.length - 1].body.push(child)
    } else {
      columns.push({ heading: null, text: '', body: [child] })
    }
  }

  return (
    <div className="scope-boundary wide-block">
      {columns.map((column, i) => {
        const kind = /\bout\b|out-of-scope|excluded|not doing/i.test(column.text) ? 'out' : 'in'
        return (
          <div key={i} className={`scope-boundary__column scope-boundary__column--${kind}`}>
            {column.text && (
              <h4 className="scope-boundary__heading">
                <span className="scope-boundary__marker" aria-hidden="true">
                  {kind === 'out' ? '−' : '+'}
                </span>
                {column.text}
              </h4>
            )}
            <div className="scope-boundary__body">{column.body}</div>
          </div>
        )
      })}
    </div>
  )
}
