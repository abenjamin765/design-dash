import { useEnterAttention } from '../hooks/useEnterAttention'

type AssumptionType = 'observed' | 'borrowed' | 'assumed'
type ConfidenceLevel = 'high' | 'medium' | 'low'
type AssumptionStatus = 'open' | 'validated' | 'invalidated' | 'deferred'

interface AssumptionRowProps {
  id: string
  statement: string
  confidence: ConfidenceLevel
  type?: AssumptionType
  validation?: string
  /** Required by lint for an `observed` row: URL, or repo/vault path plus date. */
  evidence?: string
  status?: AssumptionStatus
  /** Required by lint for a `debt` row: YYYY-MM-DD. */
  dueBy?: string
  owner?: string
}

/**
 * AssumptionRow — one row in the assumptions register.
 * Motion: enter flash when a new assumption is written mid-dash.
 */
export function AssumptionRow({
  id,
  statement,
  confidence,
  type = 'assumed',
  validation,
  evidence,
  status = 'open',
  dueBy,
  owner,
}: AssumptionRowProps) {
  const ref = useEnterAttention<HTMLDivElement>(`${id}:${status}`)

  return (
    <div
      ref={ref}
      className={`assumption-row assumption-row--${status}`}
      data-id={id}
      data-type={type}
      data-confidence={confidence}
      data-status={status}
    >
      <span className="assumption-row__id">{id}</span>
      <span className={`assumption-row__type assumption-row__type--${type}`}>{type}</span>
      <span className="assumption-row__statement">{statement}</span>
      <span className={`assumption-row__confidence confidence--${confidence}`}>{confidence}</span>
      {validation && <span className="assumption-row__validation">{validation}</span>}
      {evidence && <span className="assumption-row__evidence">{evidence}</span>}
      {owner && <span className="assumption-row__owner">{owner}</span>}
      {dueBy && <span className="assumption-row__due-by">due {dueBy}</span>}
      <span className={`assumption-row__status status--${status}`}>{status}</span>
    </div>
  )
}
