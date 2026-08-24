# ADR-0004: Workshop activities are declarative specs over six primitives

**Date:** 2026-08-23 · **Status:** Accepted

## Context

The proposed workshop supports roughly twelve activity types (prototypes, comparisons, critique, annotations, MCQs, ranking, card sorting, brainstorming, preference elicitation, concept testing, flow walkthroughs, decision capture). Building twelve bespoke features is unfinishable scope. The design goal is that **agents can easily generate interactive activities without building each one from scratch** — while keeping every response machine-comparable and auditable.

## Decision

Compose all activities from **six primitives**:

| Primitive | Response shape | Covers |
|-----------|----------------|--------|
| **Question** | Typed schema: single-select, multi-select, ranked list, scale, free text | MCQs, preference elicitation, prioritization prompts |
| **Artifact panel** | Region annotations + comments on any rendered model node | Critique, annotations, decision capture |
| **Deck** | Sort / rank / rate modes over a card collection | Card sorting, ranking, triage |
| **Compare** | N-up forced-choice or weighted trade-off | Concept testing, A/B |
| **Board** | Spatial clustering | Brainstorming, affinity mapping |
| **Walkthrough** | Stepped sequence with checkpoints | Flow walkthroughs |

Properties that make this composable rather than bespoke:

- Activities are **declarative specs referencing Dash Model node IDs** — agents author data, not code. Hot reload serves updated specs instantly.
- **Responses normalize into model records** (decisions, evidence, annotations) with provenance: prompt context, timestamp, actor. An activity instance is ephemeral; its response is permanent.
- **Markdown fallback equivalents are mandatory** for every primitive, preserving honest gate completion in terminal-only sessions.
- MVP set: Question + Artifact panel + Compare. Deck, Board, Walkthrough follow demand.

The workshop server itself stays thin: it serves declarative specs and captures normalized responses. It holds no truth (ADR-0001) and may be discarded without loss.

## Consequences

**Positive**

- Consistent interaction grammar across all agent-authored activities.
- Responses are comparable across sessions and dashes (structured data, not prose).
- Activity sprawl is structurally capped at six primitives × configuration space.

**Negative**

- Freeform creativity is constrained by the grammar; genuinely novel interactions require extending the primitive catalog deliberately (a versioned change, not a hack).
- Markdown fallbacks double part of the authoring surface; mitigated because both forms derive from one declarative spec.

## Alternatives considered

- **Per-activity-type features**: rejected — unbounded scope, inconsistent UX, duplicated response-capture logic.
- **Embedding a generic survey tool**: rejected — surveys lack model-node rendering, write-back normalization, and provenance capture.
