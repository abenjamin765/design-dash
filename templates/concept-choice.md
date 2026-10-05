<!-- TEMPLATE: Concept Choice
     Page title: "Concept Choice: {Project Name}"
     Parent: Project folder page

     P5 scorecard from concept-divergence. design-spec.md §5 records
     the short decision and links here for the tables.
-->

**Project:** [{Project Name}](link-to-project-hub)
**Dash:** {slug}
**Date:** {YYYY-MM-DD}

---

## Concepts

| Label | Structural difference | Hub entry | Primary action | Main trade-off | Pages from flow.md |
| --- | --- | --- | --- | --- | --- |
| {Concept A} | {Dimension vs others} | {Object} | {Action} | {Trade-off} | {How this redesigns which pages} |
| {Concept B} | {Dimension vs others} | {Object} | {Action} | {Trade-off} | {How this redesigns which pages} |
| {Concept C} | {Dimension vs others} | {Object} | {Action} | {Trade-off} | {How this redesigns which pages} |

**Description (2–4 sentences per concept):**

### {Concept A}

{Which hub object is the entry point, how the flow spine works, and what is traded away.}

### {Concept B}

{…}

### {Concept C}

{…}

<!-- Express: one strongest concept only. Skip B/C and mark Selection Gate deferred below. -->

---

## Distinctness

| Check | Result |
| --- | --- |
| **Panel verdict** | distinct / revise |
| **Notes** | {Why they differ, or what was revised} |

Do not score until concepts are structurally distinct (or Express records a single concept with debt).

---

## User criteria scores

Rate: Strong fit (3) · Partial fit (2) · Weak fit (1) · Conflicts (0).

| Success criterion (from scope §1.6) | {Concept A} | {Concept B} | {Concept C} |
| --- | --- | --- | --- |
| {criterion} | | | |
| {criterion} | | | |
| **Total** | | | |

---

## Business metric score

North-star from [metrics.md](metrics.md). Prefer an outcome-linked metric over a pure engagement proxy.

| Business metric (north-star) | {Concept A} | {Concept B} | {Concept C} |
| --- | --- | --- | --- |
| {metric} | 3 / 2 / 1 | 3 / 2 / 1 | 3 / 2 / 1 |

| | {Concept A} | {Concept B} | {Concept C} |
| --- | --- | --- | --- |
| **Value** | Low / Med / High | Low / Med / High | Low / Med / High |
| **Effort** | Low / Med / High | Low / Med / High | Low / Med / High |

---

## Selection

| | {Concept A} | {Concept B} | {Concept C} |
| --- | --- | --- | --- |
| User criteria total | | | |
| Business metric score | | | |
| Value / effort | | | |
| **Recommendation** | | | |

| Field | Value |
| --- | --- |
| **Selected** | {Concept label} |
| **Rationale** | {1–2 sentences} |
| **Runner-up(s)** | {Label + why not} |
| **Selection Gate** | passed / deferred (Express debt) |
| **Copied to** | [design-spec.md](design-spec.md) §5 |

**Selection Gate pass criteria:**

1. Scoring references both user criteria and a business metric.
2. Concepts were verified as structurally distinct (or Express single-concept debt is logged in [assumptions.md](assumptions.md)).
3. The winning concept's north-star metric is outcome-linked, not a pure engagement proxy.

---

## See Also

* [design-spec.md](design-spec.md) — Framing lock; §5 holds the short decision
* [flow.md](flow.md) — Pages each concept would redesign
* [metrics.md](metrics.md) — North-star and guardrails
* [assumptions.md](assumptions.md) — New hypotheses from concept generation
