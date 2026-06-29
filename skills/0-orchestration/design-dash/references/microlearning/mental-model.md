# Mental Model — Designer Cheat-Sheet

> Loaded by `/explain mental-model` or at P5 first surface.

---

## What a mental model is (in OOUX terms)

A mental model is the map of objects and relationships a user carries in their head when they interact with a product. It reflects how they understand the world — what things exist, how those things connect, and what they can do with them.

In OOUX, we say: users don't navigate through menus and features — they navigate through their mental model. When a digital product mirrors a user's mental model, it feels intuitive. When it doesn't, users feel lost.

---

## Two mental models to hold at once

During a Design Dash, you work with two mental models simultaneously:

| Mental model | What it represents | Where it comes from |
|---|---|---|
| **User's mental model** | How the user understands their work and world; what objects they name and care about | User research, interviews, noun foraging |
| **System object model** | How the product (or your object library) has already modeled the domain; the canonical objects | `library/objects/`, object guides, NOM diagrams |

The design goal is **alignment**: the objects users name in research should map to (or inform updates to) the canonical objects. Gaps between the two models are where friction lives.

---

## Mental model → Object model → Design

```
User says: "I need to see how my team is tracking on this project"
  ↓
Mental model objects: team, project, progress, deadline
  ↓
System objects: TEAM, PROJECT, MILESTONE, TASK
  ↓
NOM: PROJECT nests MILESTONE (with progress data) and TASK
  ↓
Design: Project detail page has a Milestones collection and a Tasks collection
```

---

## Common misalignments to watch for

| User says | What they mean | System object | Risk |
|---|---|---|---|
| "My dashboard" | Could be a PROJECT list, a REPORT, or a custom view | Varies | Masked Object risk |
| "The record" | Could be a CASE, a FILE, a TRANSACTION | Domain-specific | Ambiguity — log as a QUESTION |
| "My stuff" | Objects owned or assigned to the current user | Multiple objects | Needs scoping — which objects? |
| "The history" | Could be ACTIVITY LOG, AUDIT TRAIL, or VERSIONS | Multiple objects | Split into distinct objects if SIP passes |

---

## Mental model in the Design Dash

At P5, the scenario-flow-mapping skill captures mental models explicitly: what the user is thinking at each step of a scenario, what objects they reach for, and what they expect to find. The page list that emerges from P5 should mirror those mental models — not the internal data model, not feature flags, not legacy nav.

The Reconciliation Gate (P5) formally surfaces divergences between the user's mental model (captured in P2.9) and the modeled system — and requires a resolution decision for each one.

---

*See also: `scenario-mapping.md` · `nom.md` · `sip-test.md` · `scenario-flow-mapping` skill*
