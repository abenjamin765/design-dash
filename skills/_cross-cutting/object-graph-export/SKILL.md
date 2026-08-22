---
id: object-graph-export
title: Object Graph Export
stage: _cross-cutting
version: "0.1.0"
description: >
  Exports the local object library (library/objects/*.md) into a machine-queryable
  property graph — objects, attributes, CTAs, roles, dashes, and decisions as nodes;
  OOUX relationships as typed edges carrying MCSFD properties and provenance. Produces
  graph.json (JSON-schema-validated) plus an optional Cypher MERGE script for graph
  database import. Makes accumulated object knowledge queryable by AI agents across
  dashes. Use at P4 wrap-up, or standalone to upgrade an existing library.
roles:
  - ux-designer
  - engineer
  - ai-agent
inputs:
  - name: Object Library
    description: All guides in library/objects/ plus _index.md
    required: true
    source_skill: object-library-context
outputs:
  - name: Object Graph
    description: Validated graph.json export of the library
    artifact_type: data
    template_file: null
tags:
  - object-library
  - knowledge-graph
  - agents
  - mcsfd
  - provenance
difficulty: intermediate
estimated_duration_minutes: 45
system_prompt_file: SKILL.md
---

# Object Graph Export — Library as a Queryable Graph

You convert the markdown object library into a **property graph artifact** that agents and tools can query without re-parsing prose. The markdown files remain the human source of truth; `graph.json` is the derived, validated index.

**Why this exists**: cross-dash accumulation only works if a future dash can *ask* the library questions — "which objects share this attribute?", "who can delete a Plan?", "what did decision D-003 supersede?" Prose answers slowly and inconsistently; a graph answers exactly.

---

## Node types

| Type | From | Carries |
|---|---|---|
| `object` | one guide per file | name, domain, definition, content class, `average_instances`, `max_instances` |
| `attribute` | each attribute row | name, type, required flag, content class (`core-content` / `metadata`) |
| `cta` | each CTA row | verb, priority tier (P/S/T/Q) |
| `role` | roles named in CTA matrix | role name |
| `dash` | dash-config.yaml identity | slug, tier, date |
| `decision` | decisions log entries | statement, date, rationale |

**Node test**: make something a node if agents will query it independently or attach facts to it. Everything else stays a property.

## Edge types

| Edge | Connects | Notes |
|---|---|---|
| `HAS_ATTRIBUTE` | object → attribute | one per attribute row |
| `HAS_CTA` | object → cta | one per CTA row |
| `CAN_PERFORM` | role → cta | permission mapping from CTA matrix |
| `INHERITS_FROM` | object → object | tree systems / base objects |
| `ASSOCIATED_WITH` | object → object | NOM + object map relationships |
| `DEFINED_IN` | object/decision → dash | accumulation provenance |
| `APPLIES_TO` | decision → object | why-changed links |
| `SUPERSEDES` | decision → decision | causal chain of requirement changes |

### MCSFD lives on the edges

Every `ASSOCIATED_WITH` edge carries the relationship spec as **edge properties**, not prose:

```json
{
  "from": "plan-review",
  "to": "member",
  "type": "ASSOCIATED_WITH",
  "mechanics": "user-triggered",
  "cardinality": "1-to-many",
  "sort": "submitted_at desc",
  "filter": "status, reviewer",
  "dependency": "cascade-delete"
}
```

### Reification rule

A fact connecting three or more entities cannot be one binary edge. Promote it to an intermediate node with one edge per participant (e.g., a `showtime` node linking film, theater, and time slot). Signal: you are about to put a property on an edge that describes something other than that exact pair.

## Provenance (mandatory on every node and edge)

| Property | Meaning |
|---|---|
| `source_dash` | slug of the dash that produced/last-touched this element |
| `extracted_at` | ISO timestamp of export |
| `confidence` | `observed` \| `reported` \| `inferred` \| `assumed` — reuse the method's evidence labels |

Provenance is what makes accumulation safe: a future dash can weigh a 2024 `assumed` relationship differently from a 2026 `observed` one.

---

## Export procedure

1. Read `library/objects/_index.md`, then every guide it lists.
2. Parse each guide into nodes/edges per the schema in `references/graph-schema.json`.
3. Assign stable ids: `{type}-{slug}` (e.g., `object-meal-plan`, `attribute-plan-status`). Ids must be deterministic so repeated exports MERGE instead of duplicating.
4. Write `library/graph.json`.
5. Validate: every edge endpoint resolves to an existing node id; every node has provenance; no orphan `ASSOCIATED_WITH` edges lacking MCSFD properties.
6. Optional (on request): emit `library/graph.cypher` using `MERGE` on the deterministic ids with `SET` for properties — safe to re-run against an existing graph database.

## Agent consumption

- `graph.json` is plain data — any MCP tool, script, or agent can load it directly.
- Natural-language queries become traversals: "Who can change an order?" → find role nodes, follow `CAN_PERFORM` → `HAS_CTA` → owning object.
- When the library grows large, pair vector search over node definitions with exact graph traversal for requirements retrieval; embeddings narrow the field, edges deliver the precise facts.
- Re-export after any P4 that touches the library. The export is derived state — never hand-edit `graph.json`; fix the guide and re-export.

---

## Checkpoints

1. **Scope** (WAIT FOR USER): full library or specific domains?
2. **Review mapping** (WAIT FOR USER): present extracted node/edge counts per object; flag anything ambiguous in the guides rather than guessing.
3. **Publish** (WAIT FOR USER): write `library/graph.json` (+ optional `.cypher`), report validation results.

## What this skill does NOT do

- Does not modify object guides (fixes go through `05-object-guide-builder`).
- Does not require a running graph database — `graph.json` is self-contained.
- Does not invent relationships absent from the guides.
