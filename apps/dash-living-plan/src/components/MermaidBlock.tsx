/**
 * Mermaid rendering for ```mermaid code fences.
 *
 * Diagrams are authored as fences, not as a JSX tag, so they survive export
 * untouched and still render on GitHub and Confluence. PreBlock is registered as
 * the MDX `pre` element and swaps in a diagram only when the fence language is
 * mermaid; every other fence renders as before.
 *
 * The mermaid bundle is imported dynamically inside an effect, so it is never part
 * of the initial chunk. If parsing or rendering fails, the raw fence is shown —
 * a bad diagram must not take the page down.
 */

import React, { useEffect, useId, useState } from 'react'

type MermaidModule = {
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, text: string) => Promise<{ svg: string }>
}

let mermaidPromise: Promise<MermaidModule> | null = null

function loadMermaid(): Promise<MermaidModule> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(mod => {
      const mermaid = (mod.default ?? mod) as unknown as MermaidModule
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'neutral',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        flowchart: { useMaxWidth: true, htmlLabels: false },
      })
      return mermaid
    })
  }
  return mermaidPromise
}

function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (React.isValidElement(node)) return textOf((node.props as { children?: React.ReactNode }).children)
  return ''
}

function Mermaid({ code }: { code: string }) {
  const rawId = useId()
  const domId = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let live = true
    setSvg(null)
    setFailed(false)

    loadMermaid()
      .then(mermaid => mermaid.render(domId, code))
      .then(({ svg: rendered }) => {
        if (live) setSvg(rendered)
      })
      .catch(() => {
        if (live) setFailed(true)
        // mermaid leaves its scratch node behind when a render throws.
        document.getElementById(domId)?.remove()
        document.getElementById(`d${domId}`)?.remove()
      })

    return () => {
      live = false
    }
  }, [code, domId])

  if (failed) {
    return (
      <div className="mermaid-block mermaid-block--failed wide-block">
        <p className="mermaid-block__error">Diagram could not be rendered — showing the source.</p>
        <pre className="mermaid-block__source">
          <code>{code}</code>
        </pre>
      </div>
    )
  }

  if (!svg) {
    return <div className="mermaid-block mermaid-block--loading wide-block">Rendering diagram…</div>
  }

  return (
    <figure
      className="mermaid-block wide-block"
      role="img"
      aria-label="Diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

/** MDX `pre` element — intercepts language-mermaid fences, passes everything else through. */
export function PreBlock(props: React.ComponentPropsWithoutRef<'pre'>) {
  const { children, ...rest } = props
  const only = React.Children.toArray(children)[0]

  if (React.isValidElement(only) && only.type === 'code') {
    const className = (only.props as { className?: string }).className ?? ''
    if (/\blanguage-mermaid\b/.test(className)) {
      return <Mermaid code={textOf((only.props as { children?: React.ReactNode }).children).trimEnd()} />
    }
  }

  return <pre {...rest}>{children}</pre>
}
