# Assumptions Register

**Dash:** <!-- dash-name -->  
**Dash ID:** <!-- dash-config.yaml dash-id -->  
**Tier:** Express / Standard / High-stakes  
**Last updated:** YYYY-MM-DD  
**Owner:** <!-- name -->

> **Governance:** This file is append-only. Never overwrite or delete a row. Status changes require an evidence-link — a bare status flip without a linked source is an audit flag. Git diff history is the audit trail.
>
> Prefer authoring assumptions as `<AssumptionRow>` in `living-plan/phases/p1.mdx` and running `export` — that regenerates this register. Hand-edit only when Node tooling is unavailable.

---

## Register

| id | statement | type | confidence | validation-method | owner | status | linked-decision | evidence-link | due-by |
|---|---|---|---|---|---|---|---|---|---|

<!-- Add data rows below this header. Do not leave example type cells like "observed / borrowed / assumed" — lint treats those as data. -->

---

## Evidence debt log

Items with `status: debt` that are blocking a gate or capping a quality grade:

| id | gate-dependency | due-by | owner | cap |
|---|---|---|---|---|

---

## Status legend

| Status | Meaning |
|---|---|
| `open` | Not yet validated; may block a gate |
| `confirmed` | Validated — evidence-link required |
| `invalidated` | Proven wrong — linked-decision must be revisited |
| `debt` | Consciously deferred — carries due-by + owner |

## Type legend

| Type | Meaning |
|---|---|
| `observed` | Backed by research/data — requires evidence-link |
| `borrowed` | Taken from another product/domain — cite source |
| `assumed` | Working belief — needs a validation method |
