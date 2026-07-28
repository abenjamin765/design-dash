import { usePlanStatus, type GateInfo } from '../hooks/usePlanStatus'

/** The five mandatory Design Dash gates, in the order they are cleared. */
const CANONICAL_GATES = [
  'Evidence Gate',
  'Reconciliation Gate',
  'Selection Gate',
  'Ethics Gate',
  'Learning Gate',
]

const RESULT_LABEL: Record<string, string> = {
  pass: 'Passed',
  fail: 'Failed',
  debt: 'Evidence debt',
  pending: 'Pending',
  deferred: 'Deferred',
}

const RESULT_ICON: Record<string, string> = {
  pass: '✓',
  fail: '✗',
  debt: '!',
  pending: '○',
  deferred: '–',
}

function label(result: string) {
  return RESULT_LABEL[result] ?? result
}

/**
 * GateTrack — the five mandatory gates as one strip, read from the phase files.
 *
 * The API rolls each gate up to its latest recorded result, so P0's five "pending"
 * seeds are superseded by the phase that actually ran the gate.
 */
export function GateTrack() {
  const status = usePlanStatus()

  if (!status) {
    return <div className="gate-track gate-track--loading">Reading gate results…</div>
  }

  const byName = new Map(status.gates.map(gate => [gate.name, gate]))
  const extras = status.gates.filter(gate => !CANONICAL_GATES.includes(gate.name))
  const gates: Array<{ name: string; gate?: GateInfo }> = [
    ...CANONICAL_GATES.map(name => ({ name, gate: byName.get(name) })),
    ...extras.map(gate => ({ name: gate.name, gate })),
  ]

  return (
    <div className="gate-track wide-block">
      <ol className="gate-track__list">
        {gates.map(({ name, gate }) => {
          const result = gate?.result ?? 'pending'
          const required = gate ? gate.required : true
          const short = name.replace(/\s*Gate$/, '')
          return (
            <li
              key={name}
              className={`gate-track__item gate-track__item--${result}`}
              data-gate={name}
              data-result={result}
            >
              <span className="gate-track__icon" aria-hidden="true">
                {RESULT_ICON[result] ?? '○'}
              </span>
              <span className="gate-track__name">{short}</span>
              <span className="gate-track__result">{label(result)}</span>
              <span className="gate-track__where">
                {!required ? 'not required this tier' : gate?.phase ? gate.phase : 'not recorded yet'}
              </span>
              {gate?.note && <span className="gate-track__note">{gate.note}</span>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
