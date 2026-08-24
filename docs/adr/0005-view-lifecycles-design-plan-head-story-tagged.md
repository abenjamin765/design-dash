# ADR-0005: Design Plan = HEAD (regenerating view); Story = tagged release (snapshot)

**Date:** 2026-08-23 · **Status:** Accepted

## Context

Two human-facing views need opposite lifecycle guarantees. The living plan must evolve continuously throughout the dash without accumulating hand edits that drift from the model. The stakeholder story must be stable, polished, and quotable after publication — readers cite it, so it cannot silently change underneath them.

## Decision

**Design Plan (= HEAD):**

- Generated continuously from the Dash Model; never hand-edited.
- In-browser annotations (comments, questions, pins) **write back** into the model as annotation nodes — never as HTML surgery on the view.
- Every render embeds a generation stamp: hash of the model state it displays.

**Story (= tagged release):**

- Publishing pins immutable copies of the screens, evidence excerpts, decision rationale, and imagery referenced by the narrative.
- Its arc (Problem → Evidence → Opportunity → Product Idea → Design Decisions → Experience → Expected Impact) is a curated traversal through the graph — features are presented as responses to evidence and constraints, not attractive screens.
- Screenshots and product imagery carry provenance citations to the wireframe/screen node and the decision they illustrate.

Rule of thumb: **Design Plan is what we currently believe; Story is what we claimed at a moment in time.**

## Consequences

**Positive**

- "Frozen" means frozen — published stories remain valid citations.
- Staleness of any rendered view is mechanically detectable via generation stamps.
- The story's persuasive structure (decision-as-response-to-evidence) falls out of the traceability chain rather than being authored separately.

**Negative**

- Requires a capture pipeline so imagery exists at publish time with provenance (screenshots become derived artifacts, canonical source stays the wireframe HTML).
- Multiple published stories across a dash's life can diverge in narrative; acceptable — each documents its own milestone.

## Alternatives considered

- **Single artifact toggling between "living" and "published" states**: rejected — mutable history invites retroactive edits to claims already cited by stakeholders.
- **Story authored independently of the model**: rejected — decoupled narratives drift exactly like the flat-artifact status quo.
