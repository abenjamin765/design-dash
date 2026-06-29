# Scenario Mapping — Designer Cheat-Sheet

> Loaded by `/explain scenario-mapping` or at P5 first surface.

---

## What scenario mapping is

Scenario mapping bridges OOUX artifacts (locked objects and their relationships) to page-shaped wireframes. It traces a specific user role through a meaningful task, identifying:

1. What the user is **trying to accomplish** (goal)
2. What **objects** they encounter at each step
3. What **pages** those objects imply
4. What **constraints** or edge cases shape the design

Scenario mapping is not a flow diagram of screens — it's a structured thinking exercise that generates a page list before any screen is drawn.

---

## The five outputs of a scenario map

| Output | What it captures | Feeds into |
|---|---|---|
| **User goal** | What the user is trying to accomplish in this scenario | Scope boundary for the design |
| **Steps** | Sequential actions the user takes | Flow structure |
| **Objects per step** | Which OOUX objects appear at each step | Page list and NOM validation |
| **Page list** | Derived set of pages needed to support the scenario | Wireframe scope |
| **Constraint design moves** | Edge cases, permission gates, empty states, error paths | Edge state matrix |

---

## Quick scenario template

```
Scenario: [User role] wants to [goal]

Step 1: [What the user does]
  Objects: [OBJECT A, OBJECT B]
  Page implied: [page name]
  Constraint: [edge case or permission]

Step 2: ...
```

---

## Example (generic SaaS, account manager role)

**Scenario**: An account manager wants to review all overdue tasks across their active projects before a client meeting.

| Step | User action | Objects | Page implied |
|---|---|---|---|
| 1 | Opens their workspace | PROJECT | Projects list / dashboard |
| 2 | Filters for active projects | PROJECT | Projects list (filtered) |
| 3 | Opens a specific project | PROJECT, TASK, MILESTONE | Project detail page |
| 4 | Views overdue tasks | TASK | Tasks collection (filtered by status) |
| 5 | Marks a task as complete | TASK | Task instance action |

Derived page list: Projects dashboard, Project detail, Task detail (optional).

---

## When to use scenario mapping in the Design Dash

At **P5**, after objects and relationships are locked, before wireframing. Run 2–3 scenarios per primary user role. If a page type appears in every scenario, it's core. If it only appears in one, it may be a nice-to-have or a phase-2 surface.

Full guidance: `scenario-flow-mapping` skill.

---

*See also: `mental-model.md` · `nom.md` · `page-collection-instance.md` · `scenario-flow-mapping` skill*
