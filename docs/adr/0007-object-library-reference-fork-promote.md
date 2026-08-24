# ADR-0007: Object library — reference read-only, fork to modify, promote deliberately

**Date:** 2026-08-23 · **Status:** Accepted

## Context

The object library accumulates across dashes (`library/objects/` or a workspace-redirected path via `dash.config.json`). Two failure modes threaten it:

- **Silent divergence**: a dash edits a shared object guide in place, and future dashes inherit unreviewed changes mixed with dash-local assumptions.
- **Stagnation**: dash learnings never escape back into the shared library, so accumulation stalls.

## Decision

A three-stage lifecycle governs every library object touched by a dash:

1. **Reference** — during a dash, library objects are linked by ID and treated read-only. The dash depends on the library as it exists.
2. **Fork** — the moment a dash requires different attributes, behaviors, or representations, fork the object into the dash-local namespace. The fork records its upstream origin ID. Dashes stay reproducible even as the library evolves underneath them.
3. **Promote** — at P8, dash-local forks (and genuinely new objects) may be promoted back into the shared library once, deliberately, reviewed like any other gate output. Promotion records lineage (source dash, fork origin).

## Consequences

**Positive**

- Dashes remain reproducible against a moving library — no hidden coupling to future edits.
- Learnings escape intentionally rather than accidentally or never.
- Lineage metadata makes cross-dash object evolution queryable via `graph.json`.

**Negative**

- Forking creates short-term duplication; acceptable because forks are per-dash and promotion reconciles them.
- Promotion review adds one more gate-time task; scoped to objects actually modified, not all references.

## Alternatives considered

- **Edit shared objects in place during a dash**: rejected — couples every past and future dash to mid-flight changes.
- **Copy everything locally up front (no reference)**: rejected — loses accumulation benefits and makes cross-dash reuse invisible.
