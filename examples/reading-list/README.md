# Team reading list

**Synthetic example.** Every quote, count, and “team member said” line in this folder was written to show the method. It does not describe a real team, a real study, or a real product.

A small team keeps losing book and article recommendations in chat. This dash specifies one shared reading list: a title, an optional note, and a status. One role. One page. The list can be abandoned without breaking any other workflow.

Read this folder in a few minutes, in this order:

1. This brief and the tier computation
2. [assumptions.md](assumptions.md) — register, one status change, deferred gates
3. [objects.md](objects.md) — List, Title, Note
4. [flow.md](flow.md) — one scenario
5. [wireframe.html](wireframe.html) — happy path, empty, and error
6. [requirements.md](requirements.md) — excerpt, ethics floor, learning note

## Brief

Team members drop titles into chat. Later, nobody can find them. The team wants one list they can open, add to, and mark as they read. They do not want accounts, profiles, reading streaks, or a catalog of people.

**Role:** Team member. Everyone adds, updates status, and removes. There is no approver and no second role.

**Reach:** One team of fewer than 30 people.

**Reversal:** Stop using the page. Nothing else reads the list. Deleting a title, or the whole list, returns the team to chat.

## Computed tier: Express

Tier is rule-derived. The highest trigger wins. Checked against `method/method.yaml` and the P0 checklist in `skills/0-orchestration/design-dash/SKILL.md`.

| Trigger | Applies? | Why |
|---|---|---|
| T1 Regulated personal data | No | The list stores a title, an optional note, and a status. No name, email, account, health, payment, or data about minors. |
| T2 Payment, health, or scoring | No | Nothing is scored, billed, or used to assess a person. |
| T3 Reach ≥ 10,000, or an enterprise rollout | No | One team, under 30 people. |
| T4 Irreversible, or a core business workflow | No | The list is optional. Stopping use restores the old habit. |
| T5 More than one role, or reach 500–9,999 | No | One role. Reach is under 500. |
| T6 Reach under 500, one role, reversible, no personal data | Yes | This is the floor. |

No higher trigger fired, so the computed tier is **Express**. The only required gate is `edge_ethics_equity`. Evidence, reconciliation, selection, and learning are deferred as dated debt in [assumptions.md](assumptions.md), not dropped. A later ethics flag could only raise the tier.

P6 Section C (data privacy) did not flag. The provisional Express tier stands.
