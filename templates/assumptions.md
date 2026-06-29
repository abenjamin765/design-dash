# Assumptions Register

**Dash:** <!-- dash-name -->  
**Dash ID:** <!-- scope.md dash_id -->  
**Tier:** Express / Standard / High-stakes  
**Last updated:** YYYY-MM-DD  
**Owner:** <!-- name -->

> **Governance (req §12.13.3):** This file is append-only. Never overwrite or delete a row. Status changes require an evidence-link — a bare status flip without a linked source is an audit flag. Git diff history is the audit trail.

---

## Register

| id | statement | type | confidence | validation-method | owner | status | linked-decision | evidence-link | due-by |
|---|---|---|---|---|---|---|---|---|---|
| A-001 | <!-- Falsifiable: "We believe [claim] is true for [population] in [context]." --> | observed / borrowed / assumed | L / M / H | <!-- Most direct empirical test --> | <!-- name --> | open / confirmed / invalidated / debt | <!-- Phase or decision this assumption supports --> | <!-- URL or file path + date + participant count. Required to confirm observed. --> | <!-- YYYY-MM-DD if status=debt --> |

<!-- Add rows below; never edit rows above. -->

---

## Evidence debt log

Items with `status: debt` that are blocking a gate or capping a quality grade:

| id | gate-dependency | due-by | owner | cap |
|---|---|---|---|---|
| A-001 | P1 Evidence | YYYY-MM-DD | <!-- name --> | Quality 1 capped until confirmed |

---

## Status legend

| Status | Meaning |
|---|---|
| `open` | Not yet validated; may block a gate |
| `confirmed` | Validated — evidence-link required |
| `invalidated` | Proven wrong — linked-decision must be revisited; triggers learning-loop re-entry |
| `debt` | Consciously deferred — carries due-by + owner |

## Type legend

| Type | Definition | Independence rule |
|---|---|---|
| `observed` | First-party user research with evidence link (session + date + participant count) | Source author ≠ the person making the problem claim. No link → auto-downgrade to `assumed`. |
| `borrowed` | Second- or third-party research: studies, benchmarks, partner data | Cannot override `observed` data. Circular borrowing fails the gate. |
| `assumed` | Internal belief, PM intuition, anecdote without data link | Caps Quality 1 grade until validated. |
