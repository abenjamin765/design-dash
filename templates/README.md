# Design Dash — Template Index

All templates live in this folder. They are used by the orchestrator, skills, and agents to generate design artifacts for each dash. Instructional placeholders use `{curly brace}` format.

---

## OOUX / ORCA artifacts

| Template | Purpose |
|---|---|
| `object-discovery.md` | Structured noun extraction and SIP validation for identifying candidate objects in a product domain |
| `nom.md` | Nested Object Map — defines which objects nest inside other objects and how they relate |
| `cta-matrix.md` | Full inventory of all Calls-to-Action, mapped to their objects and user roles |
| `cta-prioritization.md` | Priority-ranked CTA list (Primary / Secondary / Tertiary / Quaternary) per object and context |
| `cta-placement.md` | Layout decisions for where CTAs appear on pages and cards |
| `object-cards.md` | Object card specification — which attributes and CTAs appear on each card variant |
| `attribute-prioritization.md` | Force-ranked attribute list per object, with visibility and editability rules |
| `object-map.md` | High-level diagram spec showing all objects and their relationships across the system |
| `object-guide.md` | Comprehensive single-object reference: definition, SIP, attributes, CTAs, MCSFD, business rules, lifecycle |
| `object-guide-scoped.md` | Lighter object guide for use within a single dash (not yet promoted to the library) |
| `mcsfd-specs.md` | Mechanics · Cardinality · Sorts · Filters · Dependencies specs for object relationships |
| `meta-attributes.md` | Cross-cutting attribute metadata: permissions, editability, display format, validation rules |
| `shapeshifter-matrix.md` | Per-object matrix showing which attributes and CTAs appear in each context or view |
| `cross-object-artifacts.md` | System-level NOM and CTA matrix combining all objects in a dash |

---

## Flows & IA

| Template | Purpose |
|---|---|
| `nav-flow.md` | Navigation flow diagram spec — entry points, page hierarchy, and transitions |
| `orca-plan.md` | ORCA orchestration plan — the structured sequence of steps for a full design dash |

*Scenario flow mapping is handled by the `scenario-flow-mapping` skill rather than a standalone template.*

---

## Dash governance

| Template | Purpose |
|---|---|
| `dash-config.yaml` | Machine-readable dash configuration: slug, tier, owner, product area, and feature flags for the orchestrator |
| `design-dash.md` | Dash overview and master index — the entry point document for a completed dash |
| `project-hub.md` | Project hub page template for surfacing a dash's artifacts in a shared team space |
| `scope.md` | Auto-generated scope summary produced by the P2 scoping step; do not edit manually |
| `assumptions.md` | Full register of design assumptions, their type, confidence level, and validation plan |
| `metrics.md` | Success metrics register: north-star, guardrail, and proxy metrics with baselines and targets |
| `glossary.md` | Domain glossary — shared definitions for product, UX, and engineering terms used in the dash |
| `sign-off-ledger.md` | Stakeholder sign-off tracker — records who reviewed, approved, or raised blockers at each milestone |
| `edge-state-matrix.md` | Inventory of all edge states per page/component: empty, loading, error, permission-denied, at-scale |
| `ethics-equity-checklist.md` | Structured review of potential harms, biases, and equity issues in the design |

---

## Output artifacts

| Template | Purpose |
|---|---|
| `requirements.md` | Comprehensive product requirements spec populated by the P8 orchestrator step — the canonical design handoff document |
| `summary.html` | Visual dash summary page (generated per dash at `dashes/{slug}/summary.html`); not a template file but part of each dash's output |

---

## Research

| Template | Purpose |
|---|---|
| `ux-research-plan.md` | Research plan template: questions, methods, participant criteria, timeline, and logistics |
| `ux-research-synthesis.md` | Research synthesis report: findings, insights, affinity clusters, and design implications |

---

## Engineering & handoff

| Template | Purpose |
|---|---|
| `engineering-handoff.md` | Engineering handoff document: implementation notes, component specs, API contracts, and open technical questions |
| `user-stories.md` | User story register in Given/When/Then format, mapped to objects and acceptance criteria |
| `case-study.md` | Design case study template for publishing the dash as a portfolio or retrospective artifact |

---

*For the library of finalized object guides, see `library/objects/`. For the example object guide, see `library/objects/_example-account.md`.*
