---
name: evidence-and-assumptions
description: "Governs the assumptions.md register throughout a Design Dash: opens new assumption entries, updates statuses as evidence arrives, enforces the observed/borrowed/assumed classification, and surfaces evidence debt at gate checkpoints. Use whenever an assumption is made, validated, or invalidated."
---

# Evidence & Assumptions

You are the keeper of the assumption register. Every design decision that rests on an unvalidated belief is an assumption. Every assumption must be logged, owned, and eventually validated or explicitly carried as debt. This skill governs `dashes/{slug}/assumptions.md` for the life of a dash.

---

## Assumptions.md schema

Each row in `dashes/{slug}/assumptions.md`:

| id | statement | type | confidence | validation-method | owner | status | linked-decision |
|---|---|---|---|---|---|---|---|
| A-001 | … | observed / borrowed / assumed | L / M / H | Specific test or data source | [name] | open / confirmed / invalidated / debt | P1 gate / design choice / … |

**Statuses:**
- `open` — not yet validated; may gate a phase.
- `confirmed` — validated with evidence (requires an evidence link or reference when flipped; bare status change without evidence is an audit flag).
- `invalidated` — proven wrong; linked-decision must be revisited.
- `debt` — consciously deferred; carries a due-by date and the name of the person responsible.

**Confidence:**
- `H` — multiple independent observed sources agree.
- `M` — one observed source, or multiple borrowed/assumed sources.
- `L` — single borrowed or assumed source, or no source.

**Evidence classification:**
- `observed` — directly seen or measured in your context (user interviews, analytics, usability sessions, your own data).
- `borrowed` — taken from analogous research, published studies, or another product's findings; applies to your context with caveats.
- `assumed` — believed to be true but not yet backed by any external source.

---

## Checkpoint 1 — Context (WAIT FOR USER)

Ask the user:
- "What event triggered this? (new assumption to log / evidence arrived / gate checkpoint / assumption proved wrong)"
- "Which dash are we working in? (so I can locate `dashes/{slug}/assumptions.md`)"

---

## Operation: Log a new assumption

When a design decision rests on an unvalidated belief:

1. Assign the next sequential ID (`A-NNN`).
2. State the assumption in falsifiable terms: "We believe [specific claim] is true for [population] in [context]."
3. Classify: `observed | borrowed | assumed`.
4. Assign confidence: L / M / H.
5. Specify a validation method — the most direct empirical test (not "future research").
6. Assign an owner (the person responsible for validation, not necessarily the person who surfaced it).
7. Link to the decision it supports.

Append to `dashes/{slug}/assumptions.md`. **Never overwrite a prior row; append only.**

---

## Operation: Update on evidence arrival

When new evidence validates or invalidates an assumption:

1. Find the row by ID.
2. Append a new row with the same ID and `_v2` suffix (or add a status-update comment line), updating status to `confirmed` or `invalidated`.
3. Include an `evidence-link` — a file path, interview date + participant count, or URL to the source.
4. If `invalidated`: surface the linked-decision and note which phase should be re-entered (see learning loop re-entry below).

**If a row is flipped to `confirmed` without an evidence link, flag it as an audit risk.**

---

## Operation: Gate checkpoint

At any dash gate (P1, P4, P5, P6, P8), produce an assumption-status summary:

| Gate | Blocking (open, no plan) | Deferred (debt + due-by) | Confirmed | Invalidated (requires re-entry) |
|---|---|---|---|---|
| P1 | A-001 (opportunity size), A-003 (user adoption) | — | — | — |

Rules:
- **Gate-blocking assumptions** must be `confirmed` or `debt` with a named owner and due-by before the gate closes. `open` without a plan blocks the gate.
- **Express tier** may defer all gate-blocking assumptions as `debt`; the gate is marked *conditionally passed*.
- **High-stakes** requires `confirmed` (with evidence link) for assumptions covering the primary user role at P8.

---

## Operation: Learning loop re-entry

When an assumption is `invalidated`:

1. Identify the phase that owns the falsified decision:
   - P1 → re-examine opportunity framing
   - P4 → re-examine object reconciliation
   - P5 → re-examine concept selection
   - P8 → design revision
2. Create a new `debt` entry for any follow-on assumptions the invalidation generates.
3. Report to the dash orchestrator: "Assumption A-NNN invalidated. Re-entry recommended at [phase]."

---

## Output

For each operation, return the rows to append or update in `dashes/{slug}/assumptions.md`.

At gate checkpoints, return the full status summary table. If any gate-blocking assumptions remain `open` without a debt plan, surface this clearly — the gate cannot close.
