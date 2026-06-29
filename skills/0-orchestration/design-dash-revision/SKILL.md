---
name: design-dash-revision
description: "Resume or iterate on an existing Design Dash workshop. Use when a designer has feedback to incorporate, a stakeholder wants a change, or a decision needs revisiting. Two paths: Express (≤15 min, surface-level changes) or Full re-entry (deepest affected phase). Alternative entry point to the design-dash orchestrator — do not re-run the full orchestrator for revisions."
version: "0.1.0"
stage: "0-orchestration"
---

# Design Dash Revision — Sub-skill (M10)

You are the re-entry handler for an existing Design Dash workshop. You accept a slug or free-text reference, recover workshop state, determine the correct revision path, and execute targeted changes without overwriting the original audit trail.

**MCP failure-mode contract**: inherit the 10-second timeout. During rehydration, if MCP is unavailable, proceed from cached `workshop-summary.md` data; surface the limitation to the designer.

---

## Step 1 — Locate the workshop

Accept: a slug (e.g. `2026-06-04-assessments-page`) or free text ("the assessments dash from last week").

If slug is provided: verify `dashes/{slug}/` exists.
If free text: list `dashes/` and match by date + topic proximity; ask the designer to confirm before proceeding.

Read `dashes/{slug}/workshop-summary.md` to recover: decisions log, in-scope objects, tier, OOUX-new audience flag.

---

## Step 2 — Determine revision path

Ask the designer:
> What changed? (Be specific — a button label, a whole flow, a new page, stakeholder feedback, or a library object changed?)

Then apply the structural heuristic:

### Express path (target ≤ 15 minutes)
Trigger: the change does **not** touch:
- Design spec §4 (Scenarios & flow)
- Design spec §5 (IA)
- Design spec §6 (Page anatomy)
- In-scope objects (no additions or removals)

Examples: button label edit, copy edit, single attribute rename, single CTA rename, microcopy fix, color token swap.

**Express path steps:**
1. Make the targeted spec edit.
2. Run P6 accessibility verification (scoped to changed sections only).
3. Append a "Revision YYYY-MM-DD" section to `workshop-summary.md` (never overwrite the original decisions log).
4. Stop.

**OOUX-new variant on express**: variant does not fire. Express bypasses P4 Synthesis and P6.1–6.4 wireframe checkpoints.

### Full re-entry path
Trigger: the change touches §4, §5, or §6 of the design spec, OR in-scope objects change.

Choose the deepest affected phase and run the orchestrator forward from there:

| Change type | Re-enter at |
|---|---|
| Button label / copy only | → Express path above |
| Wireframe-level stakeholder feedback | P6.1 (Wireframe) |
| Flow or scenario change that reshapes page architecture | P4.1 (Synthesis) |
| Library object changed canonically | P2.7+ (Context — re-query affected objects); re-run P4 and P6 |
| New page added to existing flow | P4.4 (page derivation) or P6.1 |
| In-scope objects changed | P3.2 (objects lock-in) → forward |
| Problem statement reshaped | P3.1 (problem lock-in) → forward |

Load the design-dash orchestrator SKILL.md and resume from the identified phase. Read the existing `scope.md`, `flow.md`, and `workshop-summary.md` as context — the orchestrator does not re-run prior phases.

---

## Step 3 — Accessibility re-check

Before claiming complete, run the relevant accessibility checks:
- **Express**: scoped to changed sections only (the P6 critique checklist applied to the delta).
- **Full re-entry**: P6 + P7 checklists per the full orchestrator flow.

---

## Step 4 — Audit trail

For any revision path:
- Append a "Revision YYYY-MM-DD — {description of change}" section to `workshop-summary.md`. Preserve the original decisions log in full.
- If the revision raises new library discoveries, invoke `skills/0-orchestration/design-dash/skills/library-update-pr/SKILL.md` per new discovery.
- If assumptions changed or new ones were introduced, update `dashes/{slug}/assumptions.md`.

All output artifacts go to `dashes/{slug}/`.

---

## OOUX-new variant on full re-entry

When §2.4b = yes (OOUX-new audience):
- **Full re-entry fires the variant only at the deepest re-entered phase**, not at all earlier phases. A designer who completed the variant once does not repeat the full demonstration on every revision; the `comprehension-checks.md` is the record of prior understanding.
- Example: full re-entry at P6.1 fires Pre-6.1 + Pre-6.6 + G3/G4/G5 articulation gates but does not re-fire Pre-3.2.
- P4 Synthesis never fires the variant.

---

## What this skill does NOT do

- It does not overwrite the original workshop folder's decisions log. Revisions **append**.
- It does not re-run completed prior phases. It re-enters at the deepest affected phase only.
- It does not merge workshop folders. Each revision is appended to the same folder.
- It does not produce a build or prototype. This dash ends at a plan.
