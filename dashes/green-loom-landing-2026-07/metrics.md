# Metrics Register

**Dash:** Green Loom Landing Page
**Dash ID:** green-loom-landing-2026-07
**Tier:** High-stakes
**Last updated:** 2026-07-10
**Owner:** Aaron

> **Governance (req §12.13.3):** Append-only. A status change from `planned` → `instrumented` or `baselined` → `measured` requires a real evidence link, not a self-attestation.

---

## Register

| id | success-metric | classification | event-or-measure | source | baseline | target | status | notes |
|---|---|---|---|---|---|---|---|---|
| M-001 | Early-access signups | north-star | `signup_submitted` (form success) | Form vendor / analytics (TBD at P7) | 0 (no live page) | 25 signups in 90 days post-launch | planned | Direction ↑, but bounded by M-003 quality guardrail |
| M-002 | Discovery calls booked | north-star (secondary) | `call_booked` (scheduler link click-through) | Scheduler tool (TBD) | 0 | 5 calls in 90 days | planned | Direction ↑ |
| M-003 | Signup quality — % of signups matching target roles (operator/agency) | guardrail | Optional role field on form | Signup list review | TBD | ≥ 50% of signups | planned | Guards against vanity signups; ties to A-003 |
| M-004 | Page visits | vanity | Pageviews | Analytics (TBD) | 0 | — | planned | Tracked for conversion denominator only; excluded from go/no-go |

---

## North-star / guardrail split

| North-star metric(s) | Guardrail metric(s) | Vanity (excluded from decision) |
|---|---|---|
| M-001 signups; M-002 calls | M-003 signup quality | M-004 pageviews |
