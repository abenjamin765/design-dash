---
id: object-graph-export
title: Object Graph Export
stage: _cross-cutting
version: "0.2.0"
description: >
  Exports Design Dash knowledge into machine-queryable property graphs. Mode A:
  the local object library (library/objects/*.md) → library/graph.json. Mode B:
  the full dash model (dashes/{slug}/model/*.md, per method/dash-model-schema.md)
  → dashes/{slug}/graph.json with a generation stamp for drift detection and
  mandatory-anchor coverage counts. Nodes carry provenance; OOUX relationships are
  typed edges carrying MCSFD properties. JSON-schema-validated; optional Cypher
  MERGE script for graph database import. Use Mode A at P2 wrap-up or standalone;
  use Mode B at any gate or before handoff to make the dash's traceability chain
  queryable.
roles:
  - ux-designer
  - engineer
  - ai-agent
inputs:
  - name: Object Library
    description: All guides in library/objects/ plus _index.md (Mode A)
    required: false
    source_skill: object-library-context
  - name: Dash Model files
    description: Node files under dashes/{slug}/model/ (Mode B), markdown body + YAML frontmatter per method/dash-model-schema.md
    required: false
outputs:
  - name: Object Graph
    description: Validated library/graph.json export of the library (Mode A)
    artifact_type: data
    template_file: null
  - name: Dash Model Graph
    description: Validated dashes/{slug}/graph.json export of the full model, with generation stamp and anchor coverage (Mode B)
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

# Object Graph Export — Library and Dash Model as Queryable Graphs

You convert Design Dash markdown into **property graph artifacts** that agents and tools can query without re-parsing prose. The markdown files remain the human source of truth; `graph.json` is the derived, validated index. Two modes:

- **Mode A — Library export**: `library/objects/*.md` → `library/graph.json`. Makes accumulated object knowledge queryable across dashes.
- **Mode B — Full dash model export**: `dashes/{slug}/model/*.md` → `dashes/{slug}/graph.json`. Makes a single dash's traceability chain — evidence to outcome — queryable, with drift detection.

**Why this exists**: cross-dash accumulation only works if a future dash can *ask* questions — "which objects share this attribute?", "who can delete a Plan?", "what did decision D-003 supersede?", "which screens have no justifying decision?" Prose answers slowly and inconsistently; a graph answers exactly.

---

## Node types

Mode A extracts these from the library:

| Type | From | Carries |
|---|---|---|
| `object` | one guide per file | name, domain, definition, content class, `average_instances`, `max_instances` |
| `attribute` | each attribute row | name, type, required flag, content class (`core-content` / `metadata`) |
| `cta` | each CTA row | verb, priority tier (P/S/T/Q) |
| `role` | roles named in CTA matrix | role name |
| `dash` | dash-config.yaml identity | slug, tier, date |
| `decision` | decisions log entries | statement, date, rationale |

Mode B additionally extracts the twelve non-object Dash Model node types defined in [`method/dash-model-schema.md`](../../../method/dash-model-schema.md): `evidence`, `assumption`, `insight`, `opportunity`, `requirement`, `constraint`, `scenario`, `flow`, `screen`, `outcome`, `annotation` — plus dash-local `object` forks carrying an `upstream` property. (`decision` is the twelfth non-object type; it already appears in the Mode A table above and Mode B re-extracts it from model files with its full status vocabulary.) Each carries its type-specific fields and status vocabulary exactly as that spec defines; the machine-readable definitions live in `references/graph-schema.json` (v2.0).

**Node test**: make something a node if agents will query it independently or attach facts to it. Everything else stays a property.

## Edge types

Mode A (library) edges:

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

Mode B adds the Dash Model edge vocabulary: the three **mandatory anchors** — `JUSTIFIED_BY` (screen → decision), `IMPLEMENTS` (decision → requirement-or-object), `ADDRESSES` (requirement → opportunity) — plus `EVIDENCES`, `MOTIVATES`, `TESTS`, `CONFIRMS`, `FALSIFIES`, `CONSTRAINS`, `DERIVES_FROM`, `REALIZES`, `ANNOTATES`, `PRODUCES_OUTCOME`, and `FEEDS_BACK`. Definitions and directions are in `method/dash-model-schema.md`; all are in the schema's edge enum.

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

## Mode A — Library export

Output: `library/graph.json`.

1. Read `library/objects/_index.md`, then every guide it lists.
2. Parse each guide into nodes/edges per the schema in `references/graph-schema.json`.
3. Assign stable ids: `{type}-{slug}` (e.g., `object-meal-plan`, `attribute-plan-status`). Ids must be deterministic so repeated exports MERGE instead of duplicating.
4. Write `library/graph.json`.
5. Validate: every edge endpoint resolves to an existing node id; every node has provenance; no orphan `ASSOCIATED_WITH` edges lacking MCSFD properties.
6. Optional (on request): emit `library/graph.cypher` using `MERGE` on the deterministic ids with `SET` for properties — safe to re-run against an existing graph database.

## Mode B — Full dash model export

Output: `dashes/{slug}/graph.json`. Implements roadmap item 2 in ARCHITECTURE.md.

1. Scan `dashes/{slug}/model/**/*.md` — Dash Model node files, one node per file: markdown body + YAML frontmatter per [`method/dash-model-schema.md`](../../../method/dash-model-schema.md). Filename = node id + `.md`.
2. Validate each file's frontmatter against the extended schema: required fields (`id`, `type`, `name`, `status`, `links`, `provenance`), type-specific status vocabulary, evidence-label confidence.
3. Resolve every `links[].to` to a node id within the scan. **Every edge endpoint must resolve** — dangling ids are validation failures, not warnings.
4. Cross-reference the object library:
   - Library objects referenced by id stay **external references** — do not copy them into the dash graph; record the reference on the linking edge or node property instead.
   - Forked objects (ADR-0007) appear as dash-local `object` nodes carrying an `upstream` property pointing at the library object id they were forked from.
5. Compute the **generation stamp** and write it into the output header:

   ```json
   {
     "graph_version": "2.0",
     "mode": "dash-model",
     "generated_at": "<ISO timestamp>",
     "generation": {
       "mode": "dash-model",
       "exported_at": "<ISO timestamp>",
       "hash_algorithm": "sha256",
       "content_hash": "<sha256 over the newline-joined, lexicographically sorted list of '{relative-path}:{file-sha256}' for every scanned model file>",
       "scanned_files": "<count>"
     }
   }
   ```

   This implements ARCHITECTURE.md's drift-detection mechanism: any view can embed the hash it was rendered from, so staleness is detectable rather than vibes.

6. Report **anchor coverage counts** — how many `JUSTIFIED_BY`, `IMPLEMENTS`, and `ADDRESSES` edges exist relative to screens/decisions/requirements/opportunities — in the `anchor_coverage` block. Do not fail hard on missing anchors: tier scaling means Express dashes legitimately satisfy fewer (see `method.yaml` tiers). Disclose the counts; let the gate decide.
7. Same validation rules as Mode A otherwise: provenance present on every node and edge; no orphan `ASSOCIATED_WITH` edges lacking MCSFD properties.
8. Optional (on request): emit `dashes/{slug}/graph.cypher` as in Mode A.

The export is derived state — never hand-edit either `graph.json`; fix the source files and re-export.

## Agent consumption

- `graph.json` is plain data — any MCP tool, script, or agent can load it directly, in either mode.
- Natural-language queries become traversals: "Who can change an order?" → find role nodes, follow `CAN_PERFORM` → `HAS_CTA` → owning object. "Why is this screen here?" → follow `JUSTIFIED_BY` from the screen to its decision.
- Mode B's `generation.content_hash` lets any view or artifact prove which model state it was built from — compare hashes to detect drift.
- Mode B's `anchor_coverage` block is the input `artifact-validator` reads for referential-integrity gate checks; read it as a report, not a pass/fail.
- When the library grows large, pair vector search over node definitions with exact graph traversal for requirements retrieval; embeddings narrow the field, edges deliver the precise facts.
- Re-run Mode A after any P2 that touches the library; re-run Mode B at any gate or before handoff. Both exports are derived state — never hand-edit `graph.json`; fix the source files and re-export.

---

## Checkpoints

1. **Mode** (WAIT FOR USER): Mode A (library), Mode B (full dash model for `{slug}`), or both?
2. **Review mapping** (WAIT FOR USER): present extracted node/edge counts per source file (Mode A) or per node type (Mode B); flag anything ambiguous in the sources rather than guessing.
3. **Publish** (WAIT FOR USER): write `library/graph.json` and/or `dashes/{slug}/graph.json` (+ optional `.cypher`), report validation results and — for Mode B — anchor coverage counts.

## What this skill does NOT do

- Does not modify object guides (fixes go through `05-object-guide-builder`) or Dash Model node files (fix them at the source).
- Does not require a running graph database — `graph.json` is self-contained.
- Does not invent relationships absent from the sources.
- Does not fail a dash on missing mandatory anchors — Mode B reports coverage counts; gate enforcement belongs to `artifact-validator`.
