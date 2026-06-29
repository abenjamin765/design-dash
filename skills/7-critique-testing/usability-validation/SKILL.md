---
name: usability-validation
description: >
  Usability validation protocol for the Design Dash P8 Plan Assembly gate. Plans a
  role-representative usability test against a wireframe or prototype, enforces a minimum-n
  requirement per user role, checks edge-state coverage, and maps test results back to open
  assumptions. Use when the Design Dash reaches P8 (Plan Assembly), when asked to plan a
  usability test, or when validating that a design works for real users in a declared role.
stage: 7-critique-testing
version: "0.1.0"
---

# Usability Validation

Plan and commit to a minimum-viable usability test at the P8 gate. Enforce role-representativeness,
minimum-n, edge-state coverage, and assumption reconciliation.

## When to Use

- Design Dash P8 (Plan Assembly) — the Learning Gate requires a committed, scheduled test
- "Plan a usability test" · "validate this prototype" · "run user testing"
- Any time the team needs to convert `assumed` mental-model entries to `observed`
- When the panel's Skeptic or Newcomer persona flagged validation gaps in a prior panel run

---

## Step 1 — Confirm test scope

Ask if not already in `dashes/{slug}/scope.md`:

1. **What artifact are we testing?** (prototype HTML path, Figma URL, wireframe description)
2. **What is the primary user role(s)?** (describe the real user population — job title, context, domain)
3. **What dash tier applies?** (Express / Standard / High-stakes) — determines whether this test is optional, required, or blocking
4. **Which open assumptions in `dashes/{slug}/assumptions.md` does this test target?** (list by assumption ID)
5. **What is the deadline?** (Learning-close SLA: Standard = 15 business days from P8 commit; High-stakes = 30 business days)

---

## Step 2 — Apply participant minimums

Nielsen saturation heuristic, role-representative:

| Role | Minimum n | Notes |
|---|---|---|
| Any user role (general) | **n ≥ 5** representative users | Must hold the declared role in a real working context |
| Regulated / vulnerable population (minors, health, finance) | **n ≥ 5 real members of the population** | May require special recruitment; check applicable consent requirements |
| Any role (Express tier) | **n ≥ 3** | Minimum viable; logged as `assumed` evidence debt if fewer |

**Proxy rule:** A stand-in user (e.g., adult simulating a child user, or colleague simulating a domain expert) does **not** count toward the target role's n. Log proxy sessions as `assumed`, never `observed`. Tag in `assumptions.md` with:
`confidence: assumed | method: proxy | note: does not satisfy target-role validation`.

---

## Step 3 — Build the test plan

Produce a test plan at `dashes/{slug}/research-plan.md`:

```markdown
# Usability Test Plan: [artifact name]

**Dash**: [slug]
**Date created**: [YYYY-MM-DD]
**Owner**: [name — this person owns the learning-close gate]
**Learning-close deadline**: [YYYY-MM-DD] ([15 | 30] business days from P8 commit)
**Tier**: [Express | Standard | High-stakes]

---

## Participants

| Role | Min n | Target n | Recruitment path | Proxy? |
|---|---|---|---|---|
| [role] | [min] | [target] | [channel: research ops / partner org / internal] | [No / Yes — tagged assumed] |

---

## Open assumptions under test

| ID | Statement | Type | Validation method |
|---|---|---|---|
| [A-001] | [assumption text] | [behavioral / mental-model / market] | [This test — task [N]] |

---

## Tasks

Each task targets one or more open assumptions. Tasks should be scenario-based
("You just signed up. Find out how to invite a teammate to your workspace.")
— not feature tours ("Click the Settings tab").

### Task 1: [Scenario title]
**Scenario**: [1–2 sentences of realistic context]
**Assumption(s) under test**: [A-001, A-002]
**Success metric**: [Task completion | Error count | Time-on-task (diagnostic, not a maximization target)]
**Edge state to check**: [empty | loading | error | permission-denied | scale — if relevant]
**Observation focus**: [what behavior to watch for]

[Repeat for each task — typically 3–7 tasks per session.]

---

## Edge-state coverage checklist

The following edge states must be reachable during the test session, not simulated by the
facilitator describing them (edge states must be rendered/visible in the prototype):

- [ ] Empty state — zero items in the primary list
- [ ] Loading state — simulated or real network latency
- [ ] Error state — network failure or server error
- [ ] Permission-denied — user attempts an action outside their role
- [ ] Content-at-scale — maximum realistic content volume

Mark any edge state not reachable as a prototype gap; do not skip the state — record it in
`dashes/{slug}/assumptions.md` as an open validation item.

---

## Ethics / participant wellbeing

- [ ] Informed consent obtained before session
- [ ] Parental / guardian consent obtained if participants are minors
- [ ] No personal data retained beyond the test period
- [ ] No public identification of participants in any test artifacts
- [ ] Debrief provided; participants know the design is under test, not their ability

---

## Data collection

| Metric | Collection method | Analysis target |
|---|---|---|
| Task completion | Observation note | % success per task |
| Errors / confusion points | Think-aloud + note | Common failure modes |
| Time-on-task | Timer (diagnostic only — lower is better for efficiency) | Efficiency baseline |
| Self-reported confidence | Post-task question (1–5 scale) | Subjective usability signal |

> **Direction rule:** Time-on-task is a *diagnostic*, not a maximization target. Record for
> efficiency benchmarking. Never use as a business-case metric or report as "engagement."
> Lower time-on-task (for a completed task) is generally better.

```

---

## Step 4 — Run and record results

After the test sessions complete, append a results summary to `dashes/{slug}/research-plan.md`:

```markdown
# Usability Test Results: [artifact name]

**Dash**: [slug]
**Test date(s)**: [YYYY-MM-DD]
**Owner**: [name]
**Sessions run**: [n] of [planned n]
**Roles represented**: [list]
**Proxies (tagged assumed)**: [n, if any]

---

## Assumption reconciliation

For each assumption under test:

| ID | Statement | Result | Evidence |
|---|---|---|---|
| [A-001] | [text] | ✅ Validated / ❌ Falsified / ⚠️ Inconclusive | [Session note + participant count] |

**Re-entry trigger:** Any falsified assumption triggers a re-entry check (see learning-loop skill).
Record which phase owns the falsified decision and whether the dash must re-enter.

---

## Task results

| Task | Completion rate | Common failure mode | Edge state reached? |
|---|---|---|---|
| Task 1 | [%] | [description] | [Yes / No — gap noted] |

---

## Key findings

1. [Finding tied to an assumption or design decision]
2. [...]

---

## Recommended actions

- [ ] [Action] — owner: [name] — by: [date]
  - Assumption affected: [ID]
  - Re-entry: [phase — or "none required"]

---

## Learning-close status

- [ ] All planned sessions ran (n ≥ minimum)
- [ ] All assumptions under test have a result recorded
- [ ] Any falsified assumptions have a re-entry decision
- [ ] Results linked in `dashes/{slug}/assumptions.md` for each validated/falsified row

**Learning-close: complete / incomplete / deadline missed**
```

---

## Step 5 — Update `dashes/{slug}/assumptions.md`

For each assumption with a test result:
- Set `status: validated` or `status: falsified` or `status: inconclusive`
- Add evidence link (link to results doc + session date + participant count)
- For `observed` tags: confirm the evidence link is present (no bare self-attestation)
- For `falsified` assumptions: set a re-entry flag and note which phase owns the decision

---

## Integration with the learning-loop skill

When any assumption is **falsified**, hand off to the `learning-loop` skill to:
- Identify which phase owns the falsified decision
- Determine re-entry point
- Update the dash tier if needed
