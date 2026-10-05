<!-- TEMPLATE: Flow
     Page title: "Flow: {Project Name}"
     Parent: Project folder page

     P4 output from scenario-flow-mapping. Wireframes read the
     Pages / screens / modals table and the Constraints log.
     Do NOT invent pages that are not traceable to a scenario step,
     a success criterion, or an explicit constraint.
-->

# Flow — {topic}

**Dash**: {slug}
**Date**: {YYYY-MM-DD}
**User role**: {role}
**In-scope objects**: {comma-separated slugs}

---

## Mental models

| Object | Role | Mental model (1 sentence) | Tag |
| --- | --- | --- | --- |
| {slug} | {role} | {sentence} | observed / assumed |

Any `assumed` element with an irreversible design implication must become a row in [assumptions.md](assumptions.md).

---

## Scenarios

### Scenario 1: {name} — maps to "{success criterion}"

{trigger → goal → outcome story}

### Scenario 2: {name} — maps to "{success criterion}"

{trigger → goal → outcome story}

<!-- Express: one primary scenario is enough. -->

---

## Flow steps

### Scenario 1 flow

| Step # | Actor | Action | Object touched | State change |
| --- | --- | --- | --- | --- |
| 1 | {role} | {Action} | {locked object slug} | {Concrete state change, or —} |

### Scenario 2 flow

| Step # | Actor | Action | Object touched | State change |
| --- | --- | --- | --- | --- |
| 1 | {role} | {Action} | {locked object slug} | {Concrete state change, or —} |

Every "Object touched" cell must reference a locked P3 object by slug.

---

## Pages / screens / modals

| Name | Type | Trigger (step #) | Objects present |
| --- | --- | --- | --- |
| {Human-readable name} | list / detail / modal / form / landing / dashboard | {Scenario N, step #} | {locked object slugs} |

Every flow step must map to a named surface. This table is the page list for P6 wireframes.

---

## Goal-page map

| Success criterion | Page / component | Notes |
| --- | --- | --- |
| {Criterion from scope §1.6} | {Page or component} | |

**Gate:** every success criterion must map. Do not advance until the table is complete.

---

## Constraints log

| Constraint | Design move forced in P6 |
| --- | --- |
| {Constraint from scope §1.5} | {Design move the wireframe must honor} |

If there are no constraints, record one row: `No constraints` / `None`.

---

## See Also

* [design-spec.md](design-spec.md) — Framing lock and concept selection
* [scope.md](scope.md) — Success criteria and constraints
* [nav-flow.md](nav-flow.md) — Optional navigation blueprint
* [wireframe.html](wireframe.html) — P6 wireframes (after this file)
