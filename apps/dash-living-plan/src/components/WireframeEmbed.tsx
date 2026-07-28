import { useEnterAttention } from '../hooks/useEnterAttention'

interface WireframeEmbedProps {
  src: string
  title?: string
  height?: string | number
}

/**
 * WireframeEmbed — embeds wireframe.html from the workshop directory.
 * Motion: enter flash when the wireframe is first embedded at P6.
 */
export function WireframeEmbed({ src, title = 'Design wireframe', height = 600 }: WireframeEmbedProps) {
  const ref = useEnterAttention<HTMLDivElement>(src)
  const normalizedSrc = src.startsWith('http') ? src : `/workshop/${src.replace(/^\.\.\//, '')}`

  return (
    <div ref={ref} className="wireframe-embed">
      <div className="wireframe-embed__header">
        <span className="wireframe-embed__label">Wireframe</span>
        <a
          href={normalizedSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="wireframe-embed__open-link"
        >
          Open in new tab ↗
        </a>
      </div>
      <iframe
        src={normalizedSrc}
        title={title}
        className="wireframe-embed__frame"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        loading="lazy"
      />
    </div>
  )
}
