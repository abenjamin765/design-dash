# Dash Model — Node & Edge Schema

**Status:** Draft spec · **Date:** 2026-08-23 · **Supersedes:** nothing · **Implements:** roadmap item 1 in [ARCHITECTURE.md](../ARCHITECTURE.md)

This document defines the node types, key fields, status vocabularies, and typed edges of the **Dash Model** — the canonical store for a dash ([ADR-0001](../docs/adr/0001-dash-model-canonical-source-of-truth.md)). It reuses the vocabulary already established in [`method/method.yaml`](./method.yaml) (evidence labels, tiers, gates) rather than inventing new terms.

---

## Purpose

Every artifact a dash produces traces back to a small set of record types. Fixing those types — and the minimum links between them — is what turns "why is this here?" from archaeology into a graph traversal ([ADR-0006](../docs/adr/0006-traceability-chain-mandatory-anchors.md)). This schema is the contract every sanctioned write path authors against ([ADR-0003](../docs/adr/0003-sanctioned-write-paths-validation-time-integrity.md)).

## File format

Nodes are plain files: markdown body + YAML frontmatter. Canonical store = files; no database in the truth path ([ADR-0001](../docs/adr/0001-dash-model-canonical-source-of-truth.md)).

```yaml
---
id: decision-search-first-concept   # {type}-{kebab-slug}, unique within the dash
type: decision                      # one of the 13 types below
name: Search-first concept          # human label
status: selected                    # type-specific vocabulary (below)
links:                              # typed edges, see "Edge vocabulary"
  - to: requirement-saved-searches
    type: IMPLEMENTS
provenance:
  source_dash: meal-planner-v2      # dash slug that produced or last touched this node
  extracted_at: 2026-08-23T14:30:00Z
  confidence: observed              # evidence label, see below
---
```

Common rules:

- **File layout**: Dash Model node files live in `dashes/{slug}/model/*.md` — one node per file, filename = node id + `.md`.
- `id`, `type`, `name`, `status`, `links`, and `provenance` are required on every node.
- The markdown body carries the substance (statement, rationale, excerpts). Frontmatter carries only what queries need.
- `graph.json` is generated from these files — rebuildable, never hand-edited. It extends the existing object-graph export (`skills/_cross-cutting/object-graph-export`) to all dash nodes; object-library node and edge types remain compatible with that schema's v1.0 definitions.
- The machine-readable form of the node fields, status vocabularies, and edge vocabulary in this document is [`skills/_cross-cutting/object-graph-export/references/graph-schema.json`](../skills/_cross-cutting/object-graph-export/references/graph-schema.json) (v2.0).
- Integrity is enforced at validation time (pre-gate referential checks), not by restricting entry points.

## Evidence labels

All nodes carry `provenance.confidence` drawn from the method's single label set (`method.yaml → evidence_labels`):

| Label | Meaning |
|-------|---------|
| `observed` | Directly seen in research or usage data |
| `reported` | Stated by a stakeholder or user |
| `inferred` | Derived by the team from other evidence |
| `assumed` | Believed without support — must also exist as an assumption node if load-bearing |
| `unknown` | Unexamined |

Evidence and assumption nodes additionally use `status` for their lifecycle (below).

### Provenance source

Nodes may also record where a record entered the model via `provenance.source` — values include `chat` (extracted from conversation), `gate-review`, and `workshop` (normalized from a Workshop activity response, which must also carry `provenance.activity_id`). Source is descriptive metadata; it never changes which write path was used ([ADR-0003](../docs/adr/0003-sanctioned-write-paths-validation-time-integrity.md)).

## The thirteen node types

Types fall into three groups along the traceability cycle: **why** (justification), **what** (the product), **how** (the experience and its consequences).

### Why — justification chain

| Type | Purpose | Key fields | Status values |
|------|---------|-----------|---------------|
| `evidence` | A sourced observation: quote, metric, session finding, workshop response | `source`, `collected_at`, `method`, excerpt in body | `open` (uncollected by any insight) → `consumed`; open evidence at a gate = wasted collection |
| `assumption` | A belief the plan currently depends on but does not yet support | `risk_if_wrong`, `validation_path`, linked test/evidence | `open` → `testing` → `confirmed` \| `falsified` \| `retired`; open assumptions at a gate = evidence debt |
| `insight` | An interpretation that synthesizes evidence into meaning | `synthesizes` (evidence ids), statement in body | `draft` → `accepted` → `superseded` |
| `opportunity` | A framed, falsifiable problem worth solving | `problem_statement`, `metric_hypotheses`, `tier` inputs | `framed` → `validated` \| `deferred` \| `dropped` |

### What — the product definition

| Type | Purpose | Key fields | Status values |
|------|---------|-----------|---------------|
| `requirement` | Build-ready work derived from opportunities and objects | `acceptance_criteria`, `phase` (P0–P8 origin) | `proposed` → `in_scope` \| `non_goal` → `build_ready` |
| `constraint` | A business, technical, ethical, or regulatory limit that shapes decisions | `category`, `source`, limit in body | `active` \| `lifted` |
| `object` | A domain noun from the ORCA model; mirrors the object library guide | `domain`, `content_class`, attribute/CTA links | Library priority tiers `P` \| `S` \| `T` \| `Q`; reference vs. forked per [ADR-0007](../docs/adr/0007-object-library-reference-fork-promote.md) |

### How — experience and consequence

| Type | Purpose | Key fields | Status values |
|------|---------|-----------|---------------|
| `scenario` | A named situation a user is in, anchoring flows | `actor`, `trigger`, `goal` | `draft` → `mapped` → `reconciled` |
| `flow` | A path through screens for a scenario, happy or edge | `scenario_id`, `path_kind` (`happy` \| `edge`) | `draft` → `reconciled` |
| `screen` | A page/surface in the wireframe; the `UI` end of the anchors | `wireframe_ref`, `edge_states_covered[]` | `wireframe_draft` → `annotated` → `states_covered` → `ethics_reviewed` |
| `decision` | A recorded choice with rationale; chat decisions must land here | `statement`, `rationale`, `alternatives_considered` | `proposed` → `selected` \| `rejected`; `superseded` when replaced |
| `outcome` | What happened after build/test — closes the loop as new evidence | `measure`, `result`, `collected_at` | `hypothesized` → `observed` \| `inconclusive` |
| `annotation` | A comment or critique attached to any node or rendered view | `target_id`, `author`, comment in body | `open` → `resolved`; view annotations write back here, never as HTML surgery |

## Edge vocabulary

Edges are typed and cited. Three are **mandatory anchors** (bold); everything else is optional. Rigor scales by tier — see below.

| Edge type | From → To | Required | Notes |
|-----------|-----------|----------|-------|
| **`JUSTIFIED_BY`** | screen → decision | **Anchor** | Catches orphan UI ("slop") |
| **`IMPLEMENTS`** | decision → requirement *or* object | **Anchor** | Catches unjustified behavior |
| **`ADDRESSES`** | requirement → opportunity | **Anchor** | Catches work with no reason to exist |
| `EVIDENCES` | evidence → insight | optional | Insight synthesis input |
| `MOTIVATES` | insight → opportunity | optional | Interpretation behind the framing |
| `TESTS` | assumption → test/activity record | Branch | The assumption branch is first-class: assumption → test → confirmed/falsified evidence |
| `CONFIRMS` / `FALSIFIES` | evidence → assumption | Branch | Resolution side of the branch; drives assumption `status` |
| `CONSTRAINS` | constraint → decision | optional | Limits recorded alongside requirements as decision inputs |
| `DERIVES_FROM` | requirement → object | optional | Object-grounded requirements |
| `REALIZES` | scenario → flow → screen | optional | Experience hierarchy (`PART_OF` inverse acceptable) |
| `ANNOTATES` | annotation → any node | optional | Write-back target for rendered views |
| `PRODUCES_OUTCOME` | screen/decision → outcome | optional | Measurement hook |
| `FEEDS_BACK` | outcome → evidence | optional | Loop closure: outcomes are new evidence for the next iteration |

Object-subgraph edges (`HAS_ATTRIBUTE`, `HAS_CTA`, `CAN_PERFORM`, `INHERITS_FROM`, `ASSOCIATED_WITH`, …) keep their existing definitions from the object-graph export schema and are unchanged by this document.

## When each type is authored

Node authoring maps onto the nine-phase model in `method.yaml`. A type may be revisited later, but its first write lands in these phases:

| Phase | Types first authored |
|-------|---------------------|
| P0 Preconditions | `constraint` (participation, compliance limits) |
| P1 Opportunity & evidence | `evidence`, `assumption`, `insight`, `opportunity` |
| P2 Intake & object modeling | `object` (plus library reference/forks), more `constraint` |
| P3 Framing lock | `requirement` (scope and non-goals) |
| P4 Flow & reconciliation | `scenario`, `flow` |
| P5 Divergence & selection | `decision` (concept selection with tradeoffs) |
| P6 Wireframe & ethics | `screen`, `annotation`, ethics-driven `constraint` |
| P7 Optional build | `decision` (build-path or stub decision) |
| P8 Validate & learn | `outcome`, closing evidence from the loop |

This mapping is why open assumptions block gates from P1 onward and why outcomes only exist after something shipped or was tested.

## Worked example

A minimal but anchor-complete slice of a dash graph:

```
evidence-usertest-quote-17   (observed)  ──EVIDENCES──▶  insight-plans-feel-rigid
insight-plans-feel-rigid     ──MOTIVATES──▶              opportunity-flexible-planning
opportunity-flexible-planning ◀─ADDRESSES── requirement-swap-meals      [anchor]
constraint-no-backend-v1     ──CONSTRAINS──▶  decision-client-side-swap
decision-client-side-swap    ◀─JUSTIFIED_BY── screen-weekly-plan        [anchor]
decision-client-side-swap    ──IMPLEMENTS──▶  object-meal-plan          [anchor]
assumption-users-swap-weekly ──TESTS──▶ unmoderated-test ─▶ CONFIRMS/FALSIFIES evidence
outcome-swap-adoption        ──FEEDS_BACK──▶  evidence-analytics-q4
```

Every mandatory anchor resolves; the assumption branch and the outcome loop are both present. This is the shape `artifact-validator` checks for at gates.

## Coverage queries at gates

Referential-integrity checks run pre-gate via `artifact-validator` ([ADR-0003](../docs/adr/0003-sanctioned-write-paths-validation-time-integrity.md), [ADR-0006](../docs/adr/0006-traceability-chain-mandatory-anchors.md)):

| Query | Failure means |
|-------|--------------|
| Requirement with no `REALIZES` path to a screen | Gap |
| Screen with no `JUSTIFIED_BY` decision | Slop |
| Open assumption at a gate | Evidence debt |
| Evidence consumed by no insight | Wasted collection |

## Tiers

Anchor requirements mirror the gate tiers in `method.yaml`. **Express-tier dashes satisfy fewer anchors** — typically only the three mandatory anchors on the screens and decisions that actually ship — and run only the `edge_ethics_equity` gate. Standard and high-stakes dashes add the full coverage-query set. Partial graphs are disclosed per tier in the sign-off ledger, never hidden.

## Cross-references

- [ARCHITECTURE.md](../ARCHITECTURE.md) — five roles, state/view separation, drift prevention
- [ADR-0001](../docs/adr/0001-dash-model-canonical-source-of-truth.md) — why files are canonical
- [ADR-0003](../docs/adr/0003-sanctioned-write-paths-validation-time-integrity.md) — write paths and validation-time integrity
- [ADR-0006](../docs/adr/0006-traceability-chain-mandatory-anchors.md) — the traceability cycle and mandatory anchors
- [ADR-0007](../docs/adr/0007-object-library-reference-fork-promote.md) — how `object` nodes relate to the accumulating library
- [`method/method.yaml`](./method.yaml) — evidence labels, tiers, gates, capability fallbacks
