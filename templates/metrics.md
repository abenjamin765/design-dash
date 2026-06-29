# Metrics Register

**Dash:** <!-- dash-name -->  
**Dash ID:** <!-- scope.md dash_id -->  
**Tier:** Express / Standard / High-stakes  
**Last updated:** YYYY-MM-DD  
**Owner:** <!-- BI / design-ops owner -->

> **Governance (req §12.13.3):** Append-only. A status change from `planned` → `instrumented` or `baselined` → `measured` requires a real evidence link, not a self-attestation.

> **Direction rule (req §12.6):** Any metric whose improvement direction is "more" (more session time, more visits, more notifications engaged) should be examined carefully and classified as `guardrail` rather than north-star for user-facing features. Time-on-task is a diagnostic (lower = better efficiency), not a maximization target.

---

## Register

| id | success-metric | classification | event-or-measure | source | baseline | target | status | notes |
|---|---|---|---|---|---|---|---|---|
| M-001 | <!-- What are we trying to move? --> | north-star / guardrail / vanity | <!-- Event name or BI measure --> | <!-- BI dashboard / analytics system / research repository --> | <!-- Current value or "TBD" --> | <!-- Target value with timeframe --> | planned / instrumented / baselined / measured | <!-- Direction: ↑ higher / ↓ lower / → stable is better. Flag if direction is "more" for user-facing metrics. --> |

<!-- Add rows below. -->

---

## North-star / guardrail split

| North-star metric(s) | Guardrail metric(s) | Vanity (excluded from decision) |
|---|---|---|
| <!-- The deciding metric — examine carefully if it moves in the "more-is-better" direction for users --> | <!-- Metrics that bound the north-star (must not fall) --> | <!-- Tracked but not used for go/no-go --> |

---

## Status legend

| Status | Meaning |
|---|---|
| `planned` | Metric defined; instrumentation not yet live |
| `instrumented` | Event or measure wired in production code (real ticket reference required) |
| `baselined` | Baseline value established from real data |
| `measured` | Post-launch actuals recorded against baseline |

> High-stakes dashes cannot complete P8 with instrumentation at `planned` — a real production ticket is required.
