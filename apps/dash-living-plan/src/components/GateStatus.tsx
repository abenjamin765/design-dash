import { useEnterAttention } from '../hooks/useEnterAttention'

type GateResult = 'pass' | 'fail' | 'debt' | 'pending' | 'deferred'

interface GateStatusProps {
  name: string
  required: boolean
  result?: GateResult
  note?: string
}

const GATE_LABELS: Record<GateResult, string> = {
  pass: 'Passed',
  fail: 'Failed',
  debt: 'Evidence debt',
  pending: 'Pending',
  deferred: 'Deferred',
}

/**
 * GateStatus — records the result of a mandatory Design Dash gate.
 * Motion: re-flashes when result changes (pass/fail/debt) so the designer notices the gate.
 */
export function GateStatus({ name, required, result = 'pending', note }: GateStatusProps) {
  const ref = useEnterAttention<HTMLDivElement>(`${name}:${result}`)

  return (
    <div
      ref={ref}
      className={`gate-status gate-status--${result}`}
      data-gate={name}
      data-required={String(required)}
    >
      <span className="gate-status__icon" aria-hidden="true">
        {result === 'pass' ? '✓' : result === 'fail' ? '✗' : '○'}
      </span>
      <span className="gate-status__name">{name}</span>
      <span className={`gate-status__result result--${result}`}>
        {GATE_LABELS[result]}
      </span>
      {!required && <span className="gate-status__tier-note">not required this tier</span>}
      {note && <span className="gate-status__note">{note}</span>}
    </div>
  )
}
