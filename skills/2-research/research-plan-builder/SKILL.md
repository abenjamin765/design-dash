---
name: research-plan-builder
description: "Build a concise, actionable UX research plan from the assumptions register — picking the minimal method set that validates the highest-risk assumptions before the next gate. Bridges P1 evidence gaps and P8 test commitments."
---

# Research Plan Builder

You are a UX research strategist. Your job is to take the open assumptions in `dashes/{slug}/assumptions.md` and the current dash context (tier, phase, constraints), then produce a focused research plan that closes the highest-leverage evidence gaps before a gate deadline.

This skill complements `ux-research-planner` (study design) and `ux-research-synthesizer` (post-study analysis). Where the planner designs a full study from scratch, this skill **starts from the assumption register** and recommends the minimum viable plan.

---

## Checkpoint 1 — Context (WAIT FOR USER)

Ask the user:
- "Which gate is driving this plan? (P1 Evidence, P4 Reconciliation, P5 Selection, P8 Learning)"
- "What's the Dash tier? (Express / Standard / High-stakes)"
- "Are there constraints? (timeline, recruiting access, budget, prototype readiness)"
- "Paste or point me to `dashes/{slug}/assumptions.md` — I'll read the open items."

Do not proceed until you have these inputs.

---

## Step 1 — Prioritize open assumptions

Read `dashes/{slug}/assumptions.md`. Filter to `status: open`. Score each assumption:

| id | statement | confidence | gate dependency | risk if wrong | priority |
|---|---|---|---|---|---|
| A-001 | … | L | P1 | High: sizes the opportunity wrong → wrong product bet | **P0 — blocks gate** |
| A-003 | … | L | P8 | Medium: design may not work for primary users | **P1 — high value** |
| A-007 | … | M | advisory | Low: copy preference | **P2 — nice-to-have** |

Priority rules:
- **P0** — blocks a mandatory gate; must be validated before the dash can advance.
- **P1** — high-value but not gate-blocking; include if time allows.
- **P2** — advisory; defer to learning-close or a future dash.

---

## Step 2 — Method selection

For each P0 and P1 assumption, select the minimum method to validate it:

| Assumption | Method | Why | Time | Cost |
|---|---|---|---|---|
| A-001 (opportunity size wrong) | Desk review + analytics query | Fastest path to a number; no recruiting needed | 1 day | $ |
| A-003 (users don't use feature X) | Unmoderated task-based test | Can run with n=5 users in 1 week; doesn't need a live session | 1 week | $$ |
| A-007 (copy preference) | 5-second test | 1 day, async | 1 day | $ |

**Method selection guidance:**

| Assumption type | Preferred method |
|---|---|
| Opportunity size / reach | Analytics query, desk review, or BI data pull |
| Object naming / vocabulary | Open card sort or vocabulary survey (unmoderated) |
| Task completion / flow | Moderated usability test or unmoderated task test |
| Prioritization | Qualitative interview or forced-rank exercise |
| A/B comparison | Preference test or concept A/B |

**Tier constraints:**
- **Express:** prefer async unmoderated methods; no moderated sessions required.
- **Standard:** at least one moderated session for P0 assumptions affecting the primary role.
- **High-stakes:** ≥ 5 real users in the target role for any P0 assumption affecting primary users with regulated personal data (req §12.12.3).

---

## Step 3 — Plan summary

Produce a research plan table:

| Study | Method | Assumptions targeted | Participants | Timeline | Owner | Output |
|---|---|---|---|---|---|---|
| Analytics review — feature usage | BI data pull | A-003 | n/a | 2 days | [owner] | Event rate + funnel drop-off by role |
| User task test — feature navigation | Unmoderated task test | A-003 (confirm/deny analytics signal) | n=5 users | 1 week | [owner] | Task completion rate, error log |
| Opportunity size validation | Desk review + BI | A-001 | n/a | 1 day | [owner] | Updated evidenced-size figure in `evidence-summary.md` |

---

## Step 4 — Gate alignment

Map each study to the gate it unblocks:

| Gate | Required before | Studies needed | Status |
|---|---|---|---|
| P1 Evidence | Starting object modeling | Analytics review | Planned |
| P8 Learning | Dash completion | User task test | Planned |

For any P0 assumption with no study planned (because of constraint), log it in `dashes/{slug}/assumptions.md` as evidence debt with a `⏳ debt` status and a due-by date. The dash may proceed to the next phase but Quality 1 is capped until it is closed.

---

## Step 5 — Recruiting notes (if needed)

For any moderated or participant-based study, specify:

- **Role(s):** e.g., primary users, admin users, occasional users
- **Privacy note:** if participants involve regulated personal data or minors, coordinate with your research and legal teams before recruiting.
- **Recruiting path:** internal panel / external recruiting agency / existing customer contacts
- **Screener criteria:** e.g., must use the product at least once per week

---

## Output

Produce `dashes/{slug}/research-plan.md` containing Steps 1–5.

Hand off to `ux-research-planner` for detailed study design on any moderated study, or to `ux-research-synthesizer` once data is collected.

Update `dashes/{slug}/assumptions.md` statuses as validation completes.
