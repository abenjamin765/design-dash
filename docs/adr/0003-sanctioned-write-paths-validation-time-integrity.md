# ADR-0003: Three sanctioned write paths; integrity enforced at validation time

**Date:** 2026-08-23 · **Status:** Accepted

## Context

The Dash Model needs writes from multiple actors: agents authoring during a dash, humans responding through the workshop, and power users who prefer editing files. Restricting entry to a single UI would violate the portability principle ("outputs remain portable across tools", `method.yaml`) and would make terminal-only sessions second-class — contradicting the capability-fallback ethos where gates must stay completable without any server.

## Decision

Sanction exactly **three write paths**, all landing in model files:

1. **Agents edit model files directly** — canonical authoring path.
2. **Workshop responses normalize into records** — the primary human write path; every activity response becomes a decision/evidence/annotation node with provenance.
3. **Power users edit files directly** — always allowed, never blocked.

Integrity is enforced **after the fact at validation time** (gates, pre-commit checks), not by restricting entry points:

- Referential-integrity checks: no dangling IDs, no orphan UI, no unsourced claims
- Coverage queries as gate checks (see ADR-0006)
- **Generation stamps**: every rendered view embeds the hash of the model state it was built from, making stale views detectable

## Consequences

**Positive**

- Offline/terminal parity: the method completes with nothing but files and an agent.
- No single point of failure — if the workshop is down, work continues.
- Validation errors are teachable moments (the validator explains what link is missing) rather than locked doors.

**Negative**

- Bad writes can enter between validations; drift windows exist until the next gate.
- The validator must grow real referential-intelligence — `artifact-validator` upgrades from structural completeness to graph integrity (roadmap dependency).

## Alternatives considered

- **Workshop-only sanctioned writes**: rejected — traps truth behind a running server; violates portability and fallback principles.
- **Schema-enforced writes via a CLI/API gateway**: rejected for v1 — adds infrastructure before value; revisit only if validation-time enforcement proves too leaky in practice.
