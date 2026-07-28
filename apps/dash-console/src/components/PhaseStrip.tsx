import type { PhaseResult } from '../lib/types'

interface Props {
  phases: PhaseResult[]
}

const STATUS_ICONS = {
  done: '✓',
  'in-progress': '…',
  pending: '○',
}

export function PhaseStrip({ phases }: Props) {
  return (
    <div className="phase-strip" role="list">
      {phases.map((phase, i) => (
        <div key={phase.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div className="phase-node" role="listitem">
            <div
              className={`phase-node-dot phase-node-dot--${phase.status}`}
              title={`${phase.id}: ${phase.name} — ${phase.status}`}
              aria-label={`${phase.id} ${phase.name}: ${phase.status}`}
            >
              {STATUS_ICONS[phase.status]}
            </div>
            <div className="phase-node-label">
              <div style={{ fontWeight: 700, fontSize: '10.5px' }}>{phase.id}</div>
              <div style={{ fontSize: '10px', opacity: .75 }}>{shortName(phase.name)}</div>
            </div>
          </div>
          {i < phases.length - 1 && <div className="phase-strip-connector" aria-hidden="true" />}
        </div>
      ))}
    </div>
  )
}

function shortName(name: string) {
  const MAP: Record<string, string> = {
    'Preconditions': 'Precond.',
    'Opportunity & Evidence': 'Evidence',
    'Intake & Context': 'Intake',
    'Framing Lock': 'Framing',
    'Flow & IA': 'Flow',
    'Divergence': 'Diverge',
    'Wireframe & Critique': 'Wireframe',
    'Build': 'Build',
    'Validate & Learn': 'Validate',
  }
  return MAP[name] ?? name.split(' ')[0]
}
