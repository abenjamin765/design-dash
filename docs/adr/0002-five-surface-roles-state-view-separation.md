# ADR-0002: Five surface roles with state/view separation

**Date:** 2026-08-23 · **Status:** Accepted

## Context

The original proposal named four surfaces: an interactive workshop app, a living product plan, a polished story/case study, and (implicitly) chat. The living plan was described both as *an artifact* and as *the thing containing links into the underlying product model* — conflating state with presentation. If the living plan is hand-authored, it becomes a second source of truth and drifts from everything else.

## Decision

Separate **state from views**, yielding five roles:

| Role | Function | Lifecycle |
|------|----------|-----------|
| **Chat** | Control plane — orchestration, facilitation, ambiguity resolution | Ephemeral |
| **Workshop** | Elicitation plane — structured activities | Sessions ephemeral; responses persist |
| **Dash Model** | Canonical store (ADR-0001) | Living, git-versioned |
| **Design Plan** | Generated rich view of the model | Continuously regenerated (= HEAD) |
| **Story** | Curated frozen narrative snapshot | Immutable per release (= tagged) |

Governing rule: **any product decision made in chat must leave chat as a structured record** (decision, assumption, or evidence node) — transcripts alone never carry decisions.

Every surface has a defined write-path back into the model; no surface is purely a dead-end viewer except chat itself, which extracts rather than writes.

## Consequences

**Positive**

- Resolves the god-object risk: the living plan regenerates instead of accumulating manual edits.
- Chat is demoted for product decisions but retained where it excels (framing ambiguity, facilitation, trust).
- Clear ownership: each surface answers exactly one question ("what do I interact with?" vs. "what is true?" vs. "what do I read?").

**Negative**

- Requires decision-extraction discipline during chat (agents must notice and record, not just converse).
- Adds a role (the store) that is not directly human-legible without its generated views — acceptable because views are cheap to regenerate.

## Alternatives considered

- **Four surfaces with the living plan as both artifact and model**: rejected — the conflation is the primary drift vector.
- **Eliminate chat entirely in favor of the workshop**: rejected — chat handles meta-conversation, ambiguity, and relationship-building that structured activities cannot; also degrades gracefully when the workshop server is unavailable.
