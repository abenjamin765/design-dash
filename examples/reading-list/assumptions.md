# Assumptions — Team reading list

**Dash:** Team reading list
**Dash ID:** reading-list
**Tier:** Express
**Last updated:** 2026-10-04
**Owner:** Example facilitator

**Synthetic example.** Evidence links below are invented counts, labeled synthetic. They are not a study.

The register is append-only. The status-change log is the audit trail. Current status lives in the register; history lives in the log.

## Register

| id | statement | type | confidence | validation-method | owner | status | linked-decision | evidence-link | due-by |
|---|---|---|---|---|---|---|---|---|---|
| A-001 | Team members lose book and article recommendations in chat, and will look them up on a shared list. | reported | M | Desk tally: in the last month, did you lose a recommendation you meant to keep? | Example facilitator | confirmed | P1 problem statement | Synthetic. 2026-09-25. 8 team members. 6 of 8 said yes. Tallied by a teammate who did not write the problem statement. Label: synthetic · reported. | — |
| A-002 | One shared list is enough. Members do not need private lists or separate lists per topic. | assumed | L | After two weeks of use, ask whether anyone kept a second list elsewhere. | Example facilitator | open | P3 non-goal: no private lists | None. Label: synthetic · assumed. | — |
| A-003 | Express is enough until a second role appears or the list is offered past this team. | assumed | M | Re-run the P0 checklist before either change. Escalate; do not stay on Express by default. | Example facilitator | debt | P0 tier | Method rule, not user evidence. Label: synthetic · assumed. | Before a second role or a second team |

## Status change

A-001 is the change in this register.

| date | id | from | to | evidence |
|---|---|---|---|---|
| 2026-09-18 | A-001 | — | open | Logged as assumed. No evidence link. Confidence L. |
| 2026-09-25 | A-001 | open | confirmed | Synthetic desk tally, 8 team members, 6 of 8 reported losing a recommendation in the last month. Type moves from assumed to reported. Confidence stays M because the tally is small and synthetic. |

A-002 is still open. A-003 is debt, not a confirmation.

## Evidence debt log

Express defers these gates. Each one stays dated until the tier changes or the gate is run.

| id | gate-dependency | due-by | owner | cap |
|---|---|---|---|---|
| A-003 | P1 Evidence | Before a second role or a second team | Example facilitator | Problem claim rests on one synthetic tally |
| A-003 | P4 Reconciliation | Before a second role or a second team | Example facilitator | Only the chat-versus-list divergence is recorded |
| A-003 | P5 Selection | Before a second role or a second team | Example facilitator | One concept recorded; no scored alternative |
| A-003 | P8 Learning | Before a second role or a second team | Example facilitator | Learning note written; learning gate not closed |

`edge_ethics_equity` is the required gate and is not in this debt log. See the ethics floor in [requirements.md](requirements.md).
