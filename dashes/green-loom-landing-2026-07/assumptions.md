# Assumptions Register

**Dash:** Green Loom Landing Page
**Dash ID:** green-loom-landing-2026-07
**Tier:** High-stakes
**Last updated:** 2026-07-10
**Owner:** Aaron

> **Governance (req §12.13.3):** This file is append-only. Never overwrite or delete a row. Status changes require an evidence-link — a bare status flip without a linked source is an audit flag. Git diff history is the audit trail.

---

## Register

| id | statement | type | confidence | validation-method | owner | status | linked-decision | evidence-link | due-by |
|---|---|---|---|---|---|---|---|---|---|
| A-001 | High-stakes tier stands without a non-author reviewer confirm (solo founder; no second reviewer available) | assumed | M | Recruit one design/compliance peer to review tier + plan before launch | Aaron | debt | P0 tier classification | | 2026-08-10 |
| A-002 | We believe the four-pillar messaging (Sell better / Operate cleaner / Stay compliant / Connect the stack) resonates with licensed cannabis retail operators in US markets | assumed | M | 5 discovery calls with operators/agencies; ask them to describe Green Loom back in their own words | Aaron | open | P2 scope; P6 concept selection | | 2026-09-10 |
| A-003 | We believe primary early adopters are independent dispensaries and agencies building on WordPress | assumed | M | Source/role question on the early-access signup form; review first 25 signups | Aaron | open | P2 user roles; P6 concept | | 2026-10-10 |
| A-004 | We believe reach stays under 500 visitors in the first 6 months (no paid traffic) | assumed | H | Analytics review at 90 days post-launch | Aaron | open | P0 tier (only escalates, never lowers) | | 2026-10-10 |
| A-005 | We believe 25 early-access signups in 90 days is achievable from organic/network traffic and meaningful as demand signal | assumed | L | Measure signups + conversion rate at 90 days; compare against outreach volume | Aaron | open | P1 success metric (M-001) | | 2026-10-10 |
| A-006 | We believe an email-only form (no qualifying fields beyond optional role/source) maximizes signups without degrading lead quality | assumed | M | A/B or sequential test after launch; monitor discovery-call conversion from signups | Aaron | open | P7 form design; privacy gate | | 2026-10-10 |

---

## Evidence debt log

Items with `status: debt` that are blocking a gate or capping a quality grade:

| id | gate-dependency | due-by | owner | cap |
|---|---|---|---|---|
| A-001 | P0 tier confirmation (high-stakes reviewer) | 2026-08-10 | Aaron | Quality grade capped until confirmed |

---

## Status legend

| Status | Meaning |
|---|---|
| `open` | Not yet validated; may block a gate |
| `confirmed` | Validated — evidence-link required |
| `invalidated` | Proven wrong — linked-decision must be revisited; triggers learning-loop re-entry |
| `debt` | Consciously deferred — carries due-by + owner |

<!-- Appended 2026-07-10 (P8) -->

| A-007 | Learning Gate deferred by designer decision: no scheduled usability test at plan completion. Comprehension criterion ("visitor can say what GL is after one scroll") remains unvalidated. | assumed | M | 5-person 30-second comprehension test within 2 weeks of launch; pass = 4/5 correct | Aaron | debt | P8 Learning Gate | | 2026-08-15 |
