import type { PhaseResult } from '../lib/types'

interface Props {
  phases: PhaseResult[]
}

export function ArtifactTable({ phases }: Props) {
  const rows = phases.flatMap((phase) =>
    phase.artifacts.map((a) => ({ phase, artifact: a }))
  )

  if (rows.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No artifacts tracked.</p>
  }

  return (
    <table className="artifact-table">
      <thead>
        <tr>
          <th>Phase</th>
          <th>File</th>
          <th>Required</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ phase, artifact }) => (
          <tr key={`${phase.id}-${artifact.file}`}>
            <td>
              <span className="artifact-phase-label">{phase.id}</span>
            </td>
            <td>
              <span className="artifact-file">{artifact.file}</span>
            </td>
            <td>
              {artifact.required ? (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Required</span>
              ) : (
                <span style={{ color: '#bbb', fontSize: '12px' }}>Optional</span>
              )}
            </td>
            <td>
              <span
                className={`badge badge--${artifact.present ? 'done' : 'pending'}`}
                style={{ fontSize: '10.5px' }}
              >
                {artifact.present ? '✓ Present' : '✗ Missing'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
