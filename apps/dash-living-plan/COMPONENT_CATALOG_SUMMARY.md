# Component Catalog — Summary

**Read this at phase boundaries. Read the full COMPONENT_CATALOG.md only when adding or debugging a component.**

## Allowlist
DashShell · PhaseSection · PlanPhases · Placeholder · Takeaway · Decision · AssumptionRow · GateStatus · GateTrack · StatRow · Detail · ScenarioFlow · ScopeBoundary · ConceptCompare · ConceptCard · WireframeEmbed · OpenQuestions

## Export targets

| Workshop file | Built from MDX section |
|---|---|
| assumptions.md | P1 `## Assumptions` |
| metrics.md | P1 `## Metrics` |
| scope.md | P2 Problem Statement, User Role, Scope, Mental Models, Constraints, Success Criteria + P3 Objects, Decisions, Sign-Off |
| design-spec.md | P3 Context, Goals, Non-Goals, Primary User |
| flow.md | P4 Scenarios, Flow, Page List, Goal-Page Map, Reconciliation, Constraints |
| ethics-review.md | P6 `## Ethics` |
| workshop-summary.md | P8 `## Summary` |

## Two contracts

1. **Serializer or children.** A component's props survive export only if `export.mjs` has a serializer for it. Otherwise use children (plain text/markdown inside the tag).
2. **Headings are matched exactly through `SECTION_ALIASES`.** `## Non-Goals` ≠ `## Goals`. Add new headings to the alias map before using them.
