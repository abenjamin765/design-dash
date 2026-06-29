---
name: scenario-flow-mapping
description: "Bridge OOUX artifacts (locked objects, relationships, user role) to page-shaped wireframes by capturing mental models, user scenarios, flow steps, derived page lists, goal-page maps, and constraint design moves. Produces flow.md — the connective tissue between the Framing phase and the Wireframe phase. Invoked by the design-dash orchestrator at P4 Synthesis (checkpoints 4.1–4.6). Independently invokable to derive page architecture from any locked object set."
version: "0.1.0"
stage: "4-synthesis-ia"
---

# Scenario Flow Mapping — Sub-skill

You guide the designer through six structured checkpoints that bridge ORCA artifacts to page-shaped design decisions. Your output is `dashes/{slug}/flow.md` — a durable, structured document that the P6 Wireframe phase reads directly to determine which pages to design and in what order.

**Do not invent pages from scratch.** Every page in the output must be traceable to a scenario step, a success criterion, or an explicit constraint. This is the sub-skill's primary discipline.

---

## Inputs (read before starting)

1. `dashes/{slug}/scope.md` — success criteria (§1.6), constraints (§1.5), user role, in-scope objects, product-alignment context, mental model notes from P2.9.
2. Reference your existing object guides in `library/objects/` to ground scenarios in your modeled objects. Check `library/objects/` for existing object guides for this domain.
3. The locked P3 in-scope objects list and the locked problem statement.

---

## Checkpoint 4.1 — Mental models (WAIT FOR USER)

**Surface `mental-model` microlearning on first use** — load `references/microlearning/mental-model.md` from the design-dash skill and emit the definition inline.

For each in-scope object / user-role pair:
1. Review the object guide in `library/objects/` if available, and any canonical role norms documented there.
2. Ask: "In one sentence, what does {role} already know or expect about {object}?" Push back on vague answers ("they use it a lot") with: "What specifically do they expect it to *do* or *contain*?"
3. Tag each element `observed` (backed by research/evidence) or `assumed` (designer's hypothesis). Any assumed element with an irreversible design implication must become a row in `assumptions.md` at the end of this phase.

Output: one-sentence mental model per object/role pair, tagged `observed | assumed`.

---

## Checkpoint 4.2 — Scenarios (WAIT FOR USER)

**Surface `scenario-mapping` microlearning on first use** — emit inline.

For each user role, elicit 1–3 **trigger → goal → outcome** stories:

> "Describe a specific situation where {role} needs to use {primary object}. What triggered it, what do they want to accomplish, and what does success look like?"

Rules:
- Each scenario must reference ≥1 success criterion from §1.6. If a scenario maps to no criterion, ask: should we add a criterion, or is this scenario out of scope?
- Scenarios should be concrete: real names, specific actions, observable outcomes.
- For multi-page flows: one scenario can span multiple pages; that's fine and expected.

Output: 1–3 scenario stories per role, each citing its success criterion.

---

## Checkpoint 4.3 — Flow steps (WAIT FOR USER)

For each scenario, guide the designer through an ordered flow-step table:

**Template**:
```markdown
| Step # | Actor | Action | Object touched (from locked P3 list) | State change |
|---|---|---|---|---|
| 1 | Manager | Opens the project list | Project | — |
| 2 | Manager | Clicks on a project | Project | Project detail panel opens |
```

Rules:
- Every "Object touched" cell must reference a locked P3 object by slug. If an unlocked object appears, flag it: "Is {unlocked-object} in scope? If yes, we may need to re-open P3."
- State changes should be concrete: a panel opens, a record is created, a status changes.
- Keep steps at the interaction level (not pixel-level), but detailed enough that each step maps to a page or modal.

Output: one flow-step table per scenario.

---

## Checkpoint 4.4 — Pages / screens / modals (WAIT FOR USER)

Derive the page and screen list from the flow steps. Group flow steps that happen on the same surface.

For each surface, record:
- **Name**: human-readable, not slug (e.g. "Project List", not "project-list")
- **Type**: list | detail | modal | form | landing | dashboard
- **Trigger**: which step(s) arrive here
- **Objects present**: which locked objects appear on this surface

Rules:
- Every step in every flow table must map to a named surface. If a step has no surface, ask: do we need a new page, or does this happen inline?
- Multi-role flows: name surfaces per role if they differ (e.g. "Admin: User Detail" vs "User: My Profile").

Output: page/screen/modal list with type, trigger, and objects present.

---

## Checkpoint 4.5 — Goal-page map (GATE — WAIT FOR USER)

Map every success criterion from §1.6 to a specific page or component.

**Template**:
```markdown
| Success criterion (from §1.6) | Page / component | Notes |
|---|---|---|
| User can see a summary of recent activity at a glance | Dashboard — Activity summary section | |
```

**Gate**: all criteria must map. If any criterion is unmapped, return to 4.4 and add a page or modal to cover it. Do not advance until every criterion has a mapping.

Output: goal-page map (append to flow.md).

---

## Checkpoint 4.6 — Constraints heartbeat (WAIT FOR USER)

For each constraint from §1.5, name the **design move it forces in P6**:

**Template**:
```markdown
| Constraint (from §1.5) | Design move forced in P6 |
|---|---|
| Must work for mobile users on slow connections | Lazy-load all images; use skeleton rows instead of full-page loading states |
| Cannot display individual user names in shared views | Anonymize user cards in collection-level views |
```

An empty constraint list means no forced moves — record "No constraints" rather than skipping.

Output: constraints log (append to flow.md).

---

## Output — `flow.md`

Write `dashes/{slug}/flow.md` with all sections:

```markdown
# Flow — {topic}

**Dash**: {slug}
**Date**: {YYYY-MM-DD}
**User role**: {role}
**In-scope objects**: {comma-separated slugs}

## Mental models

| Object | Role | Mental model (1 sentence) | Tag |
|---|---|---|---|
| {slug} | {role} | {sentence} | observed / assumed |

## Scenarios

### Scenario 1: {name} — maps to "{success criterion}"

{trigger → goal → outcome story}

### Scenario 2: ...

## Flow steps

### Scenario 1 flow

| Step # | Actor | Action | Object touched | State change |
|---|---|---|---|---|

### Scenario 2 flow

...

## Pages / screens / modals

| Name | Type | Trigger (step #) | Objects present |
|---|---|---|---|

## Goal-page map

| Success criterion | Page / component | Notes |
|---|---|---|

## Constraints log

| Constraint | Design move forced in P6 |
|---|---|
```

After writing `flow.md`, patch the design spec's §4 "Scenarios & flow" section with a summary linking to `flow.md`.

---

## Standalone use

A designer can run this sub-skill outside a full Design Dash to derive page architecture from any locked object set. Provide:
- A user role
- A list of locked in-scope objects (with slugs)
- A set of success criteria
- Any constraints

The sub-skill runs checkpoints 4.1–4.6 and writes a `flow.md` wherever the designer specifies.
