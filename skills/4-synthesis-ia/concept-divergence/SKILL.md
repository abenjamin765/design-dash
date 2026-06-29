---
name: concept-divergence
description: "Generate 2–3 structurally distinct design concepts for the scoped problem, score each on user success criteria and a business metric, and enforce the Selection Gate. Invoked by the design-dash orchestrator at P5 Divergence. Independently invokable for any design exploration that needs structured concept comparison before committing to a direction."
version: "0.1.0"
stage: "4-synthesis-ia"
---

# Concept Divergence — Sub-skill (P5)

You guide the designer through generating structurally distinct design concepts, scoring them honestly, and selecting the strongest one through the Selection Gate. The adversarial panel verifies that concepts are genuinely different before scoring begins.

**This sub-skill guards against**: two cosmetically different wireframes being treated as conceptual divergence. The Selection Gate rejects concept pairs that do not differ on at least one **declared structural dimension**.

---

## Inputs (read before starting)

1. `dashes/{slug}/scope.md` — in-scope objects, success criteria, constraints, user role, problem statement, opportunity sizing.
2. `dashes/{slug}/flow.md` — the derived page list and flow steps from P4 Synthesis (scenario-flow-mapping).
3. `dashes/{slug}/assumptions.md` — the assumption register; new assumptions from concept exploration go here.
4. `dashes/{slug}/metrics.md` — the instrumentation plan; the business metric used for scoring must appear here or be added now.

---

## What counts as a structural dimension

A concept must differ from every other concept on **at least one** of these:

| Dimension | Example difference |
|---|---|
| **Hub object** | Concept A organizes the view around Project; Concept B organizes it around User |
| **Flow spine** | Concept A uses a wizard flow; Concept B uses a single-page dashboard |
| **Primary action** | Concept A makes "Create" the primary CTA; Concept B makes "Review" the primary CTA |
| **IA model** | Concept A shows collection-level before instance-level; Concept B leads with instance |
| **Information hierarchy** | Concept A surfaces status prominently; Concept B surfaces timeline prominently |

Cosmetic differences (color, icon, label copy, rounded vs sharp corners) are **not** structural and do not satisfy the divergence requirement.

---

## Checkpoint 5.1 — Structural dimensions declaration (WAIT FOR USER)

Ask the designer:
> Before we generate concepts, let's agree on what "meaningfully different" means here. Based on the problem statement and flow, which structural dimension would most change the user experience if flipped?

Guide toward 1–2 primary dimensions. Record the declared dimensions — these become the scoring dimensions for structural distinctness.

---

## Checkpoint 5.2 — Concept generation (WAIT FOR USER)

Generate **2–3 concepts**. For each concept:
1. Name it with a short label (e.g. "Project-first", "User-first", "Timeline-first").
2. State the structural dimension(s) it differs on from the others.
3. Write a 2–4 sentence description: which hub object is the entry point, what the primary action is, how the flow spine works, and what the main trade-off is.
4. List which pages from `flow.md` this concept would redesign and how.

Work with the designer iteratively — propose a concept, ask for refinement or a counter-proposal, and refine before moving to the next. Aim for concepts that represent genuine alternative theories of what users need, not the same theory expressed differently.

---

## Checkpoint 5.3 — Panel distinctness verification (WAIT FOR USER)

Load `skills/7-critique-testing/adversarial-panel/SKILL.md`.

Ask the panel: "Are these concepts structurally distinct on the declared dimensions, or are they cosmetic variants of the same approach?"

**If the panel finds two or more concepts are not structurally distinct**: return to 5.2, revise the similar concepts until they differ. Do not advance to scoring until the panel confirms distinctness.

**If only one concept is proposed**: the panel asks whether a genuine alternative exists. If the designer argues convincingly that only one approach is viable, record the reasoning in `assumptions.md` and proceed with a single concept (note: Selection Gate is waived; log as evidence debt).

---

## Checkpoint 5.4 — Scoring: user criteria (WAIT FOR USER)

Score each concept against the success criteria from §1.6 of `scope.md`.

For each criterion, rate each concept: Strong fit (3) · Partial fit (2) · Weak fit (1) · Conflicts (0).

| Success criterion | Concept A | Concept B | Concept C |
|---|---|---|---|
| {criterion from §1.6} | 3 | 2 | 1 |
| {criterion 2} | 2 | 3 | 2 |
| **Total** | | | |

Ask the designer to explain any rating where concepts score differently — the reasoning is the audit trail.

---

## Checkpoint 5.5 — Scoring: business metric (WAIT FOR USER)

Identify the relevant business metric from `metrics.md` (or add one now if missing).

Choose an outcome-linked or impact-linked metric as the north-star. Avoid selecting pure engagement or time-in-app metrics as the deciding business metric — these measure attention rather than user success. If the north-star candidate is purely engagement-oriented (e.g. "more session time", "more streak days"), flag it and ask for an outcome-linked alternative.

Score each concept: which concept best supports the north-star metric? Rate: Strong fit (3) · Partial fit (2) · Weak fit (1).

| Business metric (north-star) | Concept A | Concept B | Concept C |
|---|---|---|---|
| {metric from metrics.md} | | | |

Add value/effort estimate if available: effort = rough implementation complexity (Low/Med/High); value = expected north-star impact (Low/Med/High).

---

## Checkpoint 5.6 — Selection Gate (WAIT FOR USER)

Present the combined scoring summary:

| | Concept A | Concept B | Concept C |
|---|---|---|---|
| User criteria total | | | |
| Business metric score | | | |
| Value/effort | | | |
| **Recommendation** | | | |

**Selection Gate pass criteria**:
1. Scoring references **both** user criteria **and** a business metric.
2. Concepts were verified as structurally distinct by the panel.
3. The winning concept's north-star metric is outcome-linked, not a pure engagement proxy.

If any criterion is unmet → return to the appropriate checkpoint and fix before calling the gate passed.

Ask the designer to confirm the selected concept and state the reason in 1–2 sentences. Record in the design spec §5 "Concept selection" section:
- Selected concept + rationale
- Runner-up(s) + why not selected
- Gate pass confirmation

*Express skip*: Selection Gate is deferred. Proceed with the single strongest concept; log in `assumptions.md` as evidence debt with a note to compare alternatives in P8 usability testing.

---

## Checkpoint 5.7 — Assumption registration (WAIT FOR USER)

Any assumption introduced during concept generation (e.g. "users prefer Project-first navigation") must be added to `assumptions.md` with:
- statement · type (design-hypothesis) · confidence · validation method · owner · linked concept

---

## Output

1. Updated design spec §5 "Concept selection" with all scoring tables, panel verdict, selected concept, and gate confirmation.
2. Updated `assumptions.md` with any new rows from 5.7.
3. Updated `metrics.md` if a new business metric was added.

Return control to the orchestrator at P6 Wireframe & Critique.

---

## Standalone use

Invoke to compare design directions for any artifact — not only within a full Design Dash. Provide:
- A problem statement
- Success criteria (at least 2, checkable)
- A north-star business metric
- Any flow or IA context

The sub-skill runs checkpoints 5.1–5.7 and writes a concept-comparison summary to whatever output path the caller specifies.
