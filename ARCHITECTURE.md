# Design Dash — System Architecture

**Status:** Accepted concept · **Date:** 2026-08-23 · **ADRs:** [docs/adr/](./docs/adr/)

This document defines the system boundaries for productizing Design Dash: what is canonical, what is generated, where humans and agents interact, and how artifacts stay synchronized. It establishes boundaries before technology choices.

---

## Thesis

**Five roles, one store, four views, one rule.**

The Dash Model is the only thing anyone edits directly or through sanctioned surfaces; every artifact a human reads is generated from it; and every interaction surface has a defined write-path back into the model. Drift between artifacts becomes structurally impossible rather than procedurally discouraged.

## System boundary

```
        ┌──────────── CONTROL PLANE ────────────┐
        │   Chat — orchestration, facilitation   │
        └──────────────┬─────────────────────────┘
                       │ decisions extracted as records
┌──────────────────────▼─────────────────────────┐
│              DASH MODEL  (canonical)            │
│  Nodes: evidence · assumption · insight ·       │
│  opportunity · requirement · constraint ·       │
│  object · scenario · flow · screen · decision · │
│  outcome · annotation                           │
│  Edges: typed, cited, mandatory anchors         │
│  Store: files (md + YAML frontmatter)           │
│         + generated graph.json (derived)        │
└───────┬───────────────┬───────────────┬─────────┘
   generates        generates       generates
┌───────▼──────┐ ┌──────▼───────┐ ┌──────▼────────┐
│ WORKSHOP     │ │ DESIGN PLAN  │ │ STORY         │
│ elicitation  │ │ living view, │ │ frozen release│
│ activities → │ │ regenerated  │ │ snapshots,    │
│ responses    │ │ continuously │ │ narrative arc │
│ write back   │ │              │ │               │
└──────────────┘ └──────────────┘ └───────────────┘
```

## The five roles

| # | Role | What it is | Audience | Lifecycle |
|---|------|------------|----------|-----------|
| 1 | **Chat** | Control plane: orchestration, facilitation, ambiguity resolution | Human ↔ agent | Ephemeral |
| 2 | **Workshop** | Elicitation plane: structured activities | Human | Sessions ephemeral; **responses persist** |
| 3 | **Dash Model** | Canonical store: nodes + typed edges | Agent-first | Living, git-versioned |
| 4 | **Design Plan** | Generated rich view of the model | Human-primary, agent-navigable | Regenerates continuously (= HEAD) |
| 5 | **Story** | Curated frozen snapshot with narrative | Stakeholder humans | Immutable per release (= tagged) |

The primary architectural boundary is **state vs. views**: roles 4–5 are generated projections; nothing human-meaningful exists only inside a view. Roles 1–2 are interaction planes with bounded, normalized write-paths into state.

### Chat rules

Chat remains available for orchestration, facilitation, and resolving ambiguity about what an activity means. The governing rule: **anything that constitutes a product decision must leave chat as a structured record** (decision, assumption, evidence note) — never live only in transcript.

### Workshop primitives

Activities are composed from six primitives, authored by agents as **declarative specs referencing model node IDs** (agents author data, not code). Hot reload serves them; responses normalize back into the model.

| Primitive | Covers |
|-----------|--------|
| **Question** — statement + typed response schema (single/multi-select, ranked, scale, free text) | MCQs, preference elicitation, prioritization prompts |
| **Artifact panel** — any model node rendered inline + annotation overlay | Critique, user annotations/comments, decision capture |
| **Deck** — ordered/unordered card collection (sort / rank / rate modes) | Card sorting, ranking, brainstorm triage |
| **Compare** — N-up side-by-side, forced-choice or weighted trade-off | Concept testing, A/B comparisons |
| **Board** — spatial clustering canvas | Brainstorming, affinity mapping |
| **Walkthrough** — stepped sequence with checkpoints | Flow walkthroughs |

MVP primitive set: Question + Artifact panel + Compare.

Every activity must have a plain-markdown equivalent so terminal-only sessions satisfy gates honestly (capability-fallback ethos, `method.yaml`).

## The Dash Model

**Store format:** plain files, canonical forever.

- Node files: markdown body + YAML frontmatter (`id`, `type`, `status`, links) — full node/edge contract in [`method/dash-model-schema.md`](./method/dash-model-schema.md)
- Typed edges recorded in frontmatter or a generated edges index
- `graph.json`: generated, rebuildable, never hand-edited — extends the existing `object-graph-export` pattern to all dash nodes

**Write paths (all three sanctioned):**

1. Agents edit model files directly (canonical authoring)
2. Workshop responses normalize into records (the human write path)
3. Power users edit files directly — allowed, never blocked

Integrity is enforced at validation time (gates), not by restricting entry points. This preserves offline parity and honors the portability principle: deliverables are never trapped behind a UI or proprietary format.

## View lifecycles

- **Design Plan = HEAD.** Regenerated continuously; never hand-edited. In-browser annotations write back as annotation nodes, not HTML surgery. Every rendered view embeds the hash of the model state it was built from — staleness is detectable, not vibes.
- **Story = release tag.** Publishing pins immutable copies of screens, evidence excerpts, and decision rationale at that moment. Its arc (Problem → Evidence → Opportunity → Product Idea → Design Decisions → Experience → Expected Impact) is a curated traversal through the graph; screenshots cite the wireframe node and decision they illustrate.

Naming: the view keeps the name **Design Plan** (per the AGENTS.md disambiguation table); the store is the **Dash Model**. Do not introduce new uses of "plan" for the store.

## Traceability

```
Evidence → Insight → Opportunity → Requirement → Object/Behavior → Decision → UI → Outcome
    ▲__________________________________________________________________________________|
                          (outcomes are new evidence — the loop closes)
```

- **Assumption runs parallel to Evidence**: assumption → test → confirmed/falsified evidence.
- **Constraint feeds Decision**: business, technical, ethical limits are decision inputs.
- **Mandatory anchors** (minimum viable linking): UI→Decision, Decision→Requirement-or-Object, Requirement→Opportunity. Everything else optional. Full-chain citation demands cause link fatigue; anchors keep rigor sustainable and tiered.

Coverage queries become gate checks via `artifact-validator` upgraded to referential integrity:

- Requirements with no UI → gaps
- UI with no Decision → slop
- Open assumptions at a gate → evidence debt
- Evidence consumed by no Insight → wasted collection

## Drift prevention

1. Single write target — only model files are editable; views regenerate
2. Generation stamps — views embed the model-state hash they rendered from
3. Referential-integrity checks pre-gate (dangling IDs, orphan UI, unsourced claims)
4. Story pins true snapshots — "frozen" means frozen

## Persistence matrix

| Persistent | Ephemeral |
|------------|-----------|
| Model nodes + edges, decisions, assumptions, outcomes | Chat threads |
| Activity **responses** (as evidence/decisions) | Activity instances/sessions |
| Published Story snapshots, object library | Intermediate drafts, hot-reload builds |

Activity *specs* are cheap to keep for audit/replay — archival tier.

## Known tensions (accepted, managed)

| Tension | Management |
|---------|------------|
| Richness vs. regenerability — polished views invite hand edits | Write-back annotations; no WYSIWYG editing in v1 |
| Rigor vs. speed on Express-tier dashes | Tiered anchor requirements matching gate tiers |
| Agent creativity vs. interaction consistency | Declarative primitive grammar + spec validation |
| Per-dash model vs. accumulating object library | Reference read-only; fork to modify; promote at P8 ([ADR-0007](./docs/adr/0007-object-library-reference-fork-promote.md)) |
| Scope creep toward mini-Figma/mini-Notion | MVP = declarative specs over six primitives, generated static plan view, snapshot story |

## Sequencing roadmap

1. **Decision record + Dash Model node schema spec** — everything reads/writes through it
2. Generalize `object-graph-export` to full-model `graph.json`
3. Workshop MVP: Question + Artifact panel + Compare primitives
4. Design Plan generation (view renderer + generation stamps)
5. Story snapshot publishing

## Relationship to method.yaml v1.1

`method/method.yaml:12` currently declares *"Living-plan MDX is the source of truth when Node tooling is available."* This architecture supersedes that statement: living-plan MDX becomes a **generated view**, and the Dash Model files become canonical. Method.yaml requires revision in a follow-up change; until then, this document and its ADRs govern intent. Existing per-dash flat artifacts migrate incrementally (see roadmap item 1–2).

## Parked questions

- Exact multi-dash namespacing syntax for forked library objects
- SQLite as an optional derived query cache (allowed only if rebuildable-and-deletable; never canonical)
- Whether `landing-page/` stays marketing-only (current recommendation: yes; the Workshop remains a thin server over declarative specs)

## ADR index

| ADR | Decision |
|-----|----------|
| [0001](./docs/adr/0001-dash-model-canonical-source-of-truth.md) | Dash Model is the single canonical source of truth (plain files) |
| [0002](./docs/adr/0002-five-surface-roles-state-view-separation.md) | Five surface roles; state/view separation; chat as control plane |
| [0003](./docs/adr/0003-sanctioned-write-paths-validation-time-integrity.md) | Three sanctioned write paths; integrity enforced at validation time |
| [0004](./docs/adr/0004-workshop-declarative-activity-primitives.md) | Workshop activities are declarative specs over six primitives |
| [0005](./docs/adr/0005-view-lifecycles-design-plan-head-story-tagged.md) | Design Plan = HEAD (regenerating view); Story = tagged release (snapshot) |
| [0006](./docs/adr/0006-traceability-chain-mandatory-anchors.md) | Traceability cycle with three mandatory anchor links |
| [0007](./docs/adr/0007-object-library-reference-fork-promote.md) | Object library: reference read-only, fork to modify, promote at P8 |
