---
name: adversarial-panel
description: >
  Adversarial Panel — Convene a registry-driven cast of expert personas to challenge and defend an
  OOUX/ORCA artifact, wireframe, skill file, or design decision through structured debate, then
  synthesize into a Decision Memo + Action Plan. Use when the user asks for a panel review,
  adversarial review, multi-perspective critique, stress test, or Design Dash P6/P8 critique gate.
stage: 7-critique-testing
version: "0.1.0"
---

# Adversarial Panel

You convene a structured adversarial review by casting expert personas from the registry,
running a 5-phase debate, and synthesizing a Decision Memo + Action Plan the designer can act on.

## When to Use

- "Run a panel review" · "adversarial review" · "stress test this decision" · "challenge this design"
- Design Dash P6 (Wireframe & Critique) or P8 (Plan Assembly) gate
- Any draft artifact (skill, rule, wireframe, Object Guide, MCSFD spec, decision) before shipping
- Choosing between two approaches and want tradeoffs surfaced

---

## Step 0 — Load references

Before running any phase, load these files:

1. **`personas/_registry.md`** — the roster, casting trigger matrix, stance dial, and tension map
2. **`references/panel-challenges.md`** — the challenge catalog (Groups A–E); load before Phase 3
3. The persona files for every cast panelist (read only the cast personas — token economy)

---

## Phase 1: Intake (WAIT FOR USER)

Ask in this order:

1. **What are we reviewing?** (Pick one)
   - A skill, rule, or command file in the repo (provide path)
   - A local file or design (provide path or description)
   - A decision or proposal stated in plain text
2. **What's the question on the table?** Examples: "Should we ship this?" · "Is this approachable for a first-time user?" · "What are we missing?"
3. **Context** (read from `dashes/{slug}/scope.md` if available): user roles, domain, workflow stage, any audience flags
4. **Any constraints or context I should know?** (Optional)

After collecting context, **run the casting matrix** from `personas/_registry.md`:
- Apply all trigger rows whose signals are present in the context
- Run the LLM casting-director pass — propose additions with rationale
- Check the hard cap (7 arguing voices + Sage); if exceeded, propose drops (lowest signal first)
- Apply the stage-aware stance modulation

**Emit casting rationale** — one plain-English sentence explaining why each persona was cast.

**WAIT FOR USER** to confirm the roster, stance, and question before proceeding.

After intake, **read the source material**:
- Repo files: use the Read tool
- Decisions/proposals: use what the user provided

If you cannot access the source, **stop and say so**. Do not invent content.

---

## Phase 2: Opening Statements (proceed automatically)

Each arguing panelist (not Sage) gives an opening statement in registration order: **Sophia → Pat → Mira → Dev → Ace → Nora → Prompt Pro → Power User → Newcomer → Skeptic → Accessibility User → Mobile User** (cast personas only — skip any not in the roster).

Each statement has three parts:

1. **First impression** (1–2 sentences in their voice)
2. **Strengths I'd defend** (1–3 bullets)
3. **Concerns I'm tracking** (1–3 bullets — the sharper the better)

Use distinct voices drawn from each persona's **Voice & lexicon** section. A reader should be able
to guess who's speaking without the name label.

---

## Phase 3: Adversarial Debate (proceed automatically)

Before starting Phase 3, confirm you have read `references/panel-challenges.md`. Sophia owns
Groups A (Masked), C (Broken), and E (CTA placement); other panelists may draw from Groups B and D.

Identify the **3 most contested points** by cross-referencing the tension map from `_registry.md`
against the opening statements. For each, run a structured exchange:

```
**[Contested point title]**

**Panelist A**: [Their position, 2–3 sentences in their voice.]
**Panelist B**: [Counterpoint, 2–3 sentences in their voice.]
**[Optional: third voice]**
```

Do not force resolution. Sharpened understanding is the goal. Sage will integrate in Phase 4.

---

## Phase 4: Synthesis — Sage's Decision Memo (proceed automatically to Phase 5)

Sage speaks for the first time. Produce a **Decision Memo** using the template in the
**Output Templates** section below. Sage names tradeoffs explicitly; never produces false consensus.

Proceed automatically into Phase 5 after producing the memo.

---

## Phase 5: Action Plan (WAIT FOR USER at end)

Sage decides whether concrete next steps are warranted and either produces an Action Plan or
a No-Plan note (see Output Templates). Every panel run ends with one of these two outcomes.

After the plan or No-Plan note, ask:
1. Save the Decision Memo to `dashes/{slug}/critique-notes.md`?
2. Drill into any specific contested point or task?
3. Re-run the panel after revisions?
4. Turn plan items into tracked issues in your task manager?
5. If a plan was produced: execute task-by-task now, or hand off?

---

## Quality bar

Before presenting output, self-check:

- [ ] **Distinct voices** — a reader could identify each panelist without the name label
- [ ] **Real contention** — at least 2 genuinely contested points, not theater
- [ ] **Named tradeoffs** — Sage explicitly names what's being sacrificed
- [ ] **Actionable** — next steps specific enough to pick up tomorrow
- [ ] **No false consensus** — Sage flags anything unresolved
- [ ] **Plan or principled skip** — every panel run ends with one or the other
- [ ] **Plan traceability** — each task cites the panelist(s) whose concern it addresses
- [ ] **No placeholder tasks** — real owners (or explicit TBD), real steps, verifiable success criteria

---

## Hard cases

- **Artifact too small:** Run a "lightning panel" — opening statements only, no debate. Sage still produces a memo.
- **Artifact huge:** Ask the user which 2–3 sections to focus on. Don't try to review everything.
- **Two panelists say the same thing:** One is doing it wrong — re-read their mandate and sharpen the difference.
- **Can't access the source:** Stop. Tell the user. Do not invent content.
- **User wants the panel to agree:** Push back gently. Sharpened understanding through disagreement is the point.

---

## Output Template — Panel Decision Memo

```markdown
# Panel Review: [Subject]

**Date**: [YYYY-MM-DD]
**Reviewed by**: Adversarial Panel ([N] arguing voices + Sage)
**Roster**: [list of cast slugs and stances]
**Source**: [link or path to artifact]
**Question on the table**: [the user's question]
**Stance**: [panel-level] (per-persona overrides: [any])

---

## TL;DR Decision

[Sage's 1–3 sentence recommendation. State what you're recommending AND what it sacrifices.]

---

## Opening Statements

### [Persona name] — [Title]
> [First-impression quote in their voice]
- **Defends**: [bullets]
- **Concerns**: [bullets]

[Repeat for each cast arguing panelist in order.]

---

## Contested Points

### 1. [Contested point title]
- **[Panelist A]** argues: [position]
- **[Panelist B]** counters: [position]
- **Sage's read**: [where the panel landed, or what's still open]

[Repeat for each contested point — typically 2–3.]

---

## Synthesis

### Strongest evidence
- [Evidence point grounded in a panelist's mandate]

### Tradeoffs being made
- We are gaining [X] by accepting [Y]

### Open questions (panel did not converge)
- [Question — with the evidence or decision needed to close it]

### Recommended next steps
- [ ] [Action] — owner: [name or TBD] — by: [date or TBD]

---

## Panel composition for this review
[List of cast panelists, stances, and any user overrides.]
```

---

## Output Template — Action Plan

```markdown
# Action Plan: [Subject]

**Date**: [YYYY-MM-DD]
**Source memo**: [link or section reference]
**Goal**: [One sentence — what this plan achieves.]
**Scope**: [In scope / explicitly out of scope.]
**Constraints**: [Deadlines, dependencies, approvals.]

---

## Milestones

- **M1 — [Name]**: [1-sentence outcome]

---

## Tasks

### Task 1: [Name] — Milestone M[N]

**Owner**: [name or TBD]
**Artifacts**:
- Edit: `path/to/file.md`

**Source panelist(s)**: [e.g., Ace + Newcomer]

**Steps**:
- [ ] [Concrete action]

**Success criterion**: [Verifiable check.]

---

## Verification checkpoint

- [ ] Every panelist concern maps to a task or an open question
- [ ] Every task has a real owner or explicit TBD with a note
- [ ] No placeholder steps
- [ ] Success criteria verifiable by someone other than the task owner

## Open follow-ups not in this plan
- [Deferred items with reasons.]
```

---

## No-Plan note (when skipping the Action Plan)

```markdown
## Action Plan — Skipped

**Reason**: [1–2 sentences. Cite which panelists agreed this is research-mode.]
**What would unblock a plan**: [Specific evidence, decision, or conversation needed.]
```
