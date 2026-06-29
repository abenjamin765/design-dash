# QUESTIONS Object — Designer Cheat-Sheet

> Loaded by `/explain questions-object` or when open unknowns surface during a Design Dash.

---

## What the QUESTIONS object is

QUESTIONS is the back-end object that tracks every open unknown surfaced during the ORCA process. The book calls the output of this tracking the **"million-dollar questions" deliverable** — the showstoppers that complexity was hiding, surfaced early enough to fix cheaply.

QUESTIONS passes SIP:
- **Structure**: question text, owner, date opened, status, answer, ORCA element it blocks
- **Instances**: "Can a User belong to multiple Organizations?", "Who can delete a Transaction?", "What triggers automatic archival?"
- **Purpose**: Teams need to find, assign, answer, and close open questions; the queue is a delivery risk register

---

## When questions become million-dollar questions

A question becomes million-dollar caliber when it blocks a design decision that would be expensive to reverse — and it surfaces *before* wireframes instead of *during* development.

Signs a question is high-value:
- Two stakeholders define the same object or relationship differently
- An attribute's source is unclear ("Who authors the Description field?")
- A relationship direction is contested ("Does CATEGORY belong to PRODUCT or PRODUCT to CATEGORY?")
- A business rule is assumed but undocumented ("Can a user enroll in two simultaneous plans?")

---

## How to capture QUESTIONS in a Design Dash

Open QUESTIONS live in `dashes/{slug}/assumptions.md` (governed by the `evidence-and-assumptions` skill):

```
| # | Question | ORCA element blocked | Owner | Status | Classification |
|---|---|---|---|---|---|
| Q1 | Can a USER belong to multiple ORGANIZATIONs simultaneously? | NOM: USER ↔ ORG | PM | Open | assumed |
| Q2 | Who populates the Description attribute? | PRODUCT.Description | Content team | In progress | borrowed |
| Q3 | What happens to ORDERs when a USER is deleted? | MCSFD: Dependency | Engineering | Resolved | observed |
```

Classification follows the evidence-and-assumptions taxonomy:
- **observed** — evidence in hand (user research, analytics, documented business rule)
- **borrowed** — inferred from analogous context
- **assumed** — pure hypothesis, no evidence yet

---

## When to surface QUESTIONS during the Dash

| Phase | What to log |
|---|---|
| P1 Opportunity | Questions about user goals, pain points, success metrics |
| P4 Object Modeling | Definition disputes, synonym ambiguity, NOM direction debates |
| P3 Framing lock | Questions that could invalidate the framing if answered differently |
| P5 Synthesis | Attribute-source questions, relationship dependency questions |
| P7 Edge/Ethics | Privacy questions, permission edge cases |

---

## Resolution protocol

Before each gate, review the open QUESTIONS queue:
1. **Can be resolved now** → answer it, update `dashes/{slug}/assumptions.md` to `observed`
2. **Needs research** → log it as a research task, mark `in-progress`
3. **Remains open at gate** → it becomes a tracked assumption that must be validated in P8 (Learning Gate)

---

*See also: `ooux-advanced-modeling` skill (§ 3) · `evidence-and-assumptions` skill · `prioritization-cuts.md`*
