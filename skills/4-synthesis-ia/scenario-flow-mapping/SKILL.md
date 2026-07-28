---
name: scenario-flow-mapping
description: "Bridge OOUX artifacts (locked objects, relationships, user role) to page-shaped wireframes by reading P2 mental models, capturing user scenarios, flow steps, derived page lists, goal-page maps, reconciliation resolutions, and constraint design moves. Authors living-plan/phases/p4.mdx — the connective tissue between Framing and Wireframe. Invoked by the design-dash orchestrator at P4 Synthesis (checkpoints 4.1–4.7). Independently invokable to derive page architecture from any locked object set."
version: "0.2.0"
stage: "4-synthesis-ia"
---

# Scenario Flow Mapping — Sub-skill

You guide the designer through seven structured checkpoints that bridge ORCA artifacts to page-shaped design decisions. Your **source-of-truth write target** is `dashes/{slug}/living-plan/phases/p4.mdx`. The living-plan exporter regenerates `flow.md` from that file at the phase boundary.

**Do not invent pages from scratch.** Every page in the output must be traceable to a scenario step, a success criterion, or an explicit constraint. This is the sub-skill's primary discipline.

**Do not write exporter-owned workshop files.** Never write `flow.md` or patch `design-spec.md` §4 yourself. Workshop `.md` files are exporter output — the orchestrator runs `cli.mjs export` after you return.

**Library failure-mode contract**: read from `library/objects/` and `scope.md` before checkpoints 4.2 and 4.3; on missing guides, surface the gap and proceed from `scope.md` / assumed digests already captured at P2. Never invent object attributes.

---

## Session mode (read before any checkpoint)

The orchestrator passes `session-mode: interactive | solo` (from `dash-config.yaml`).

| Mode | Checkpoint behavior |
|---|---|
| **interactive** (default) | Hard `WAIT FOR USER` at every numbered checkpoint below |
| **solo** | Do **not** wait for a human at intra-phase checkpoints. Self-answer from scope, local object-library digests, and prior phase artifacts; tag every self-answer `assumed` unless the source is already `observed` evidence; log each auto-confirm as a row in `dashes/{slug}/auto-confirms.md` (`checkpoint · what was assumed · source artifact`); promote irreversible assumptions into the P1 Assumptions register. Still stop for hard gates that fail (4.5 unmapped criteria, 4.7 unresolved divergences) — record the failure and return it to the orchestrator rather than inventing a pass |

When a checkpoint heading says `WAIT FOR USER`, treat that as interactive-only. In solo mode, apply the table above instead.

---

## Inputs (read before starting)

1. `dashes/{slug}/scope.md` **or** `living-plan/phases/p2.mdx` — success criteria, constraints, user role, in-scope objects, and **Mental Models from P2.9** (required for 4.1 and 4.7).
2. Local object library (batch at start): `library/objects/_index.md` · `library/objects/{slug}.md` per in-scope object (digest sections; full read for hub only).
3. The locked P3 in-scope objects list and the locked problem statement.
4. `session-mode` from the orchestrator brief / `dash-config.yaml`.

---

## Checkpoint 4.1 — Read mental models (WAIT FOR USER)

**Surface `mental-model` microlearning on first use** — load `references/microlearning/mental-model.md` from the design-dash skill and emit the definition inline.

**P2 owns mental-model authorship.** Do not re-author a mental-model table into `p4.mdx` or `flow.md`. The exporter maps Mental Models from P2 → `scope.md`; P4 has no Mental Models section.

This checkpoint:
1. Open the Mental Models section from P2.9 (`scope.md` or `p2.mdx`).
2. Confirm every in-scope object / primary-role pair has a one-sentence user model tagged `observed | assumed`, plus the local object-library system-model counterpart.
3. If a pair is missing, send the gap back to the orchestrator (re-open 2.9) — do not invent the sentence here.
4. Carry the confirmed list forward as **read-only input** for 4.7 Reconciliation.

Output: confirmation that P2 mental models are complete enough to reconcile against; list of object/role pairs that will appear in 4.7. No new mental-model section in `p4.mdx`.

---

## Checkpoint 4.2 — Scenarios (WAIT FOR USER)

**Surface `scenario-mapping` microlearning on first use** — emit inline.

For each user role, elicit 1–3 **trigger → goal → outcome** stories:

> "Describe a specific situation where {role} needs to use {primary object}. What triggered it, what do they want to accomplish, and what does success look like?"

Rules:
- Each scenario must reference ≥1 success criterion from §1.6 / Success Criteria. If a scenario maps to no criterion, ask: should we add a criterion, or is this scenario out of scope?
- Scenarios should be concrete: real names, specific actions, observable outcomes.
- For multi-page flows: one scenario can span multiple pages; that's fine and expected.

Output: 1–3 scenario stories per role in `p4.mdx` under `## Scenarios` (use `<ScenarioFlow>` when it fits).

---

## Checkpoint 4.3 — Flow steps (WAIT FOR USER)

For each scenario, guide the designer through an ordered flow-step table:

**Template**:
```markdown
| Step # | Actor | Action | Object touched (from locked P3 list) | State change |
|---|---|---|---|---|
| 1 | Teacher | Opens the class roster | Class | — |
| 2 | Teacher | Clicks on a student | Student | Student detail panel opens |
```

Rules:
- Every "Object touched" cell must reference a locked P3 object by slug. If an unlocked object appears, flag it: "Is {unlocked-object} in scope? If yes, we may need to re-open P3."
- State changes should be concrete: a panel opens, a record is created, a status changes.
- Keep steps at the interaction level (not pixel-level), but detailed enough that each step maps to a page or modal.

Output: one flow-step table per scenario under `## Flow` in `p4.mdx`.

---

## Checkpoint 4.4 — Pages / screens / modals (WAIT FOR USER)

Derive the page and screen list from the flow steps. Group flow steps that happen on the same surface.

For each surface, record **all six columns**:

| Column | Meaning |
|---|---|
| **Page** | Human-readable name, not slug (e.g. "Class Roster", not "class-list") |
| **Hub object** | Primary locked object the surface is about |
| **Surface type** | list \| detail \| modal \| form \| landing \| dashboard \| action |
| **Trigger (step #)** | Which scenario step(s) arrive here |
| **Objects present** | Locked object slugs that appear on the surface |
| **Priority** | **P1** if the surface is on the primary-scenario critical path **or** maps to a success criterion in 4.5; otherwise **P2** |

Rules:
- Every step in every flow table must map to a named surface. If a step has no surface, ask: do we need a new page, or does this happen inline?
- Multi-role flows: name surfaces per role if they differ (e.g. "Teacher: Student Detail" vs "Student: My Profile").
- Derive Priority here — do not leave it blank for a later phase.

Output: page/screen/modal list under `## Page List` in `p4.mdx` with the six-column table.

---

## Checkpoint 4.5 — Goal-page map (GATE — WAIT FOR USER)

Map every success criterion from Success Criteria / §1.6 to a specific page or component.

**Template**:
```markdown
| Success criterion | Page / component | Notes |
|---|---|---|
| Teacher can see a student's recent assessment scores at a glance | Student Detail — Assessment summary section | |
```

**Gate**: all criteria must map. If any criterion is unmapped, return to 4.4 and add a page or modal to cover it. Do not advance until every criterion has a mapping. Any surface that earns a criterion mapping and was marked P2 should be promoted to P1.

Output: goal-page map under `## Which Screen Delivers Which Goal` (alias: Goal-Page Map) in `p4.mdx`.

---

## Checkpoint 4.6 — Constraints heartbeat (WAIT FOR USER)

For each constraint from Scope / §1.5, name the **design move it forces in P6**:

**Template**:
```markdown
| Constraint | Design move forced in P6 |
|---|---|
| Must work on low-bandwidth devices | Lazy-load images; use skeleton rows instead of full-page loading states |
| Cannot display individual PII in shared views | Anonymize or aggregate cards in collection-level views |
```

An empty constraint list means no forced moves — record "No constraints" rather than skipping.

Output: constraints log under `## Constraints` in `p4.mdx`.

---

## Checkpoint 4.7 — Reconciliation Gate (GATE — WAIT FOR USER)

**This is the Reconciliation Gate.** Required for Standard and High-stakes. Express logs the skip as evidence debt and does not invent a pass.

Using the **read-only** mental models confirmed in 4.1 (authored at P2.9):

1. List every divergence between the user mental model and the local object-library system model for in-scope objects.
2. For each row, record a **resolution** and a **direction**:
   - `UI adapts to user` — copy, IA, or labels follow the user model; system model unchanged
   - `System model changes` — raise a library change proposal (name the guide in `library/objects/` / open question); do not invent attributes here
3. **Pass criteria** (all must hold):
   - Every divergence from 2.9 appears as a row (a zero-row table is a fail — it means reconciliation was skipped, not that models already agree)
   - Every row has a non-empty Resolution and a Direction from the two options above
   - No `assumed` user-model element drives an irreversible design decision without a P8 test commitment already flagged (or added now) in Assumptions
   - If every Direction is `UI adapts to user` and library-change-proposals = 0, surface the rubber-stamp risk: ask whether at least one library gap should become a proposal, or record an explicit "models already aligned; no library changes" justification in the section prose
4. Set `<GateStatus name="Reconciliation Gate" required={true} result="pass" | "debt" | "fail" />` under `## Gate` (own heading — required so export does not absorb the gate into Constraints).

**Template**:
```markdown
## Where Users and the System Disagree

| Divergence (from P2) | Resolution | Direction |
|---|---|---|
| [Divergence] | [What we'll do] | UI adapts to user \| System model changes |

## Gate

<GateStatus name="Reconciliation Gate" required={true} result="pass" />
```

Output: reconciliation table + gate status in `p4.mdx`. On fail, return the failing rows to the orchestrator; do not proceed as if the gate passed.

---

## Output — `living-plan/phases/p4.mdx`

Update `dashes/{slug}/living-plan/phases/p4.mdx` with heading names the exporter scrapes (aliases in parentheses are also valid):

```markdown
## Scenarios
## Flow
## Page List
## Which Screen Delivers Which Goal   (→ Goal-Page Map)
## Where Users and the System Disagree (→ Reconciliation)
## Constraints
## Gate
```

**Page List table (required columns):**

| Page | Hub object | Surface type | Trigger (step #) | Objects present | Priority |
|---|---|---|---|---|---|

Flip the `PhaseSection` status to `done` when checkpoints 4.1–4.7 are complete (or Express-equivalent with Reconciliation logged as debt).

Then return the brief summary to the orchestrator. The orchestrator runs `check` + `export`; that produces `flow.md`. Do not write `flow.md` yourself. Do not patch `design-spec.md` §4 unless the orchestrator explicitly asks for a post-export hand-authored summary.

---

## Standalone use

A designer can run this sub-skill outside a full Design Dash to derive page architecture from any locked object set. Provide:
- A user role
- A list of locked in-scope objects (with slugs)
- A set of success criteria
- Mental models (user + system) already captured, or permission to draft them as `assumed`
- Any constraints
- An output path for a living-plan `p4.mdx` (or a standalone markdown file if no living plan exists — say so up front)

The sub-skill runs checkpoints 4.1–4.7. Prefer writing `p4.mdx` so a later `export` can own `flow.md`.
