# ADR-0001: Dash Model is the single canonical source of truth

**Date:** 2026-08-23 · **Status:** Accepted

## Context

A dash produces ~20 loosely-linked artifacts (`assumptions.md`, `design-spec.md`, `flow.md`, `ui-mapping.md`, `wireframe.html`, `pitch/index.html`, …). Relationships between evidence, requirements, objects, decisions, and UI are implicit prose. Nothing prevents drift between them, and "why is this button here?" requires archaeology across files.

Method v1.1 (`method.yaml:12`) declared living-plan MDX the source of truth when Node tooling exists — but a hand-authored rich artifact tends to become a god-object that drifts from the very artifacts it summarizes. Meanwhile the object library already demonstrates a better pattern: plain-file guides plus a generated, queryable `graph.json` export.

## Decision

Establish the **Dash Model** as the single canonical store for a dash:

- Nodes are plain-text files: markdown body + YAML frontmatter carrying stable `id`, `type`, `status`, and typed links.
- Edges are typed and cited.
- `graph.json` is generated from the files — rebuildable at any time, never hand-edited. It generalizes the proven `object-graph-export` pattern beyond objects to all dash nodes.
- Every human-facing artifact (Design Plan view, Story, pitch site) is a **generated projection** of the model. Nothing meaningful lives only inside a projection.

Canonical store = files. No database in the truth path.

## Consequences

**Positive**

- Drift between artifacts becomes structurally impossible instead of procedurally discouraged.
- Greppable, diffable, git-native; agents query via `graph.json`.
- Honors the portability principle: no proprietary formats, no UI required to reach truth.

**Negative**

- Requires validator discipline (referential integrity checks) to stay coherent — see ADR-0003.
- Existing per-dash flat artifacts need incremental migration.
- Frontmatter discipline adds small authoring friction; mitigated by agents doing most writes.

## Alternatives considered

- **Living-plan MDX as source of truth** (status quo v1.1): rejected — hand-authored rich views drift from underlying artifacts and concentrate truth in the hardest-to-maintain format.
- **Database (SQLite or hosted)**: rejected as canonical — violates local-first portability and the `no_node_runtime` capability fallback. Permitted only later as a derived, deletable cache.
- **Status quo (per-artifact sources)**: rejected — implicit links are the problem this architecture exists to solve.
