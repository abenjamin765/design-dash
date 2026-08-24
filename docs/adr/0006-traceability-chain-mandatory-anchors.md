# ADR-0006: Traceability cycle with three mandatory anchor links

**Date:** 2026-08-23 · **Status:** Accepted

## Context

The system needs an explicit, queryable chain connecting why things exist to how they are built and what happened next. Without it, coverage gaps, orphan UI, and unsourced claims stay invisible. But demanding full-chain citation on every node causes link fatigue — authors stop linking, and the graph rots.

## Decision

Adopt the traceability **cycle** as the model's spine:

```
Evidence → Insight → Opportunity → Requirement → Object/Behavior → Decision → UI → Outcome
    ▲__________________________________________________________________________________|
                          (outcomes are new evidence — the loop closes)
```

Amendments to the linear chain:

- **Assumption runs parallel to Evidence**: assumption → test → confirmed/falsified evidence. The P1→P8 learning loop depends on this branch being first-class.
- **Constraint feeds Decision**: business, technical, ethical limits are recorded decision inputs alongside requirements.

**Mandatory anchors** — the minimum viable linking set:

| Anchor | Catches |
|--------|---------|
| UI → Decision | Orphan interface elements ("slop") |
| Decision → Requirement or Object | Unjustified behavior |
| Requirement → Opportunity | Build-ready work with no reason to exist |

All other links are optional. Rigor scales by tier: Express dashes satisfy fewer anchors, mirroring existing gate tiers (`method.yaml`).

Coverage queries run at gates via `artifact-validator` upgraded to referential integrity:

- Requirements with no UI → gaps
- UI with no decision → slop
- Open assumptions at a gate → evidence debt
- Evidence consumed by no insight → wasted collection

## Consequences

**Positive**

- "Why is this here?" becomes a graph traversal instead of archaeology.
- Quality checks become mechanical queries rather than reviewer judgment calls.
- The loop closure makes P8 outcomes feed P1 of the next iteration naturally.

**Negative**

- Mandatory anchors add authoring overhead on every screen/decision; mitigated because agents perform most writes and validation explains missing links precisely.
- Partial graphs (Express tier) support weaker queries; disclosed per tier rather than hidden.

## Alternatives considered

- **Full-chain citation mandatory everywhere**: rejected — link fatigue guarantees abandonment within a few dashes.
- **Free-form linking with no minimums**: rejected — degenerates to the status quo where relationships are implicit prose.
