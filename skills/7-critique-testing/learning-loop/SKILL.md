---
name: learning-loop
description: >
  Learning-close gate and re-entry contract for the Design Dash P8 Plan Assembly phase. Closes
  the learning loop after a usability test, records whether the scheduled test ran and how many
  assumptions were validated, enforces a 15/30-business-day SLA, and triggers re-entry when
  assumptions are falsified. Use when the Design Dash reaches P8, when test results are ready,
  or when a falsified assumption requires re-entry into an earlier phase.
stage: 7-critique-testing
version: "0.1.0"
---

# Learning Loop — P8 Learning-Close Gate

Execute the two-gate learning model and enforce the SLA and re-entry logic.

## The two-gate model

The Design Dash uses two distinct gates to ensure learning is scheduled, not deferred:

| Gate | When | What it checks | Owner |
|---|---|---|---|
| **Dash-exit commitment gate (P8 in-dash)** | During the Design Dash session | Test plan exists · named owner · deadline set | Dash author |
| **Learning-close gate (post-dash, time-boxed)** | 15 BD (Standard) / 30 BD (High-stakes) after P8 commit | Test ran (y/n) · assumptions validated (count) · falsified assumptions re-entered | Dash author |

> **Quality 3 (research evidence) is provisional until learning-close.** A dash cannot claim
> fully validated research confidence until the loop is closed with a real test result.

---

## Step 1 — P8 Commitment checkpoint (run during the Design Dash)

At P8, before the dash session closes, verify all three conditions:

- [ ] **Test plan exists** at `dashes/{slug}/research-plan.md`
- [ ] **Named owner** is recorded in the plan (the person who will close the loop)
- [ ] **Deadline is set** — Standard: P8 date + 15 business days; High-stakes: P8 date + 30 business days

If any condition fails: **P8 does not complete** until it is met. Record the blocking item in
`dashes/{slug}/scope.md` as a `⏳ debt` row.

Produce a P8 commitment block in `dashes/{slug}/scope.md`:

```yaml
learning_close:
  owner: "[name]"
  deadline: "[YYYY-MM-DD]"
  sla_tier: "[Standard | High-stakes]"
  test_plan: "dashes/{slug}/research-plan.md"
  status: pending
```

---

## Step 2 — Learning-close execution (post-dash, at deadline)

When the learning-close deadline arrives (or the test completes early), run this protocol.

### 2a — Did the test run?

- **Yes:** proceed to Step 2b.
- **No — deadline missed:** set `status: deadline_missed`. Record in `dashes/{slug}/scope.md`;
  raise a tracked item with the owner. A new deadline must be set — the gap is not closed until
  learning-close completes.

### 2b — Record test results

Pull results from `dashes/{slug}/research-plan.md` (produced by `usability-validation` skill)
and fill in the learning-close record:

```yaml
learning_close:
  status: complete
  completed_date: "[YYYY-MM-DD]"
  sessions_run: [n]
  sessions_planned: [n]
  assumptions_tested: [n]
  assumptions_validated: [n]
  assumptions_falsified: [n]
  assumptions_inconclusive: [n]
  time_to_learning_bd: [business days from P8 commit to learning-close complete]
  re_entry_triggered: [true | false]
  re_entry_phase: "[P2 | P3 | P4 | P5 | null]"
```

---

## Step 3 — Assumption reconciliation

For each assumption that was under test:

1. Read the result from `dashes/{slug}/research-plan.md` (validated / falsified / inconclusive)
2. Update `dashes/{slug}/assumptions.md`:
   - `validated` → set `status: validated`; add evidence link (results doc + date + participant count)
   - `falsified` → set `status: falsified`; record re-entry trigger (see Step 4)
   - `inconclusive` → set `status: open`; note what additional evidence is needed; log as `⏳ debt`
3. Confirm all `observed` tags carry an evidence link (no bare self-attestation)

---

## Step 4 — Re-entry trigger logic

When any assumption is **falsified**, determine whether the dash must re-enter an earlier phase.

### Re-entry decision matrix

| Falsified assumption type | Phase that owns the decision | Re-entry point |
|---|---|---|
| Problem/opportunity sizing | P1 · Opportunity & Evidence | Re-enter P1; revise evidence register |
| Mental-model element (user expects X) | P2 · Intake & Context | Re-enter P2; update `observed`/`assumed` model |
| Framing or scope | P3 · Framing | Re-enter P3; revise provisional lock |
| System-model divergence | P4 · Object Modeling | Re-enter P4; re-run reconciliation |
| Concept viability (concept A doesn't work) | P5 · Divergence / Selection | Re-enter P5; reconsider concept selection |
| Wireframe usability gap | P6 · Wireframe & Critique | Re-enter P6; revise wireframe + run panel |

### Re-entry rules

- **Record reversibility explicitly.** In `dashes/{slug}/scope.md` re-entry block, state which
  phase the dash re-enters and why.
- **Tier protection.** A dash cannot downgrade its tier on re-entry. If the falsified assumption
  reveals new risk (broader reach, new regulated data surface), **tier must upgrade**; the
  newly-mandatory gates apply.
- **Express tier re-entry.** Express dashes that deferred gates as debt entries may need to
  promote to Standard if a falsified assumption exposes a previously-deferred gate.

Produce a re-entry record in `dashes/{slug}/scope.md`:

```yaml
re_entry:
  triggered_by: "[assumption ID(s)]"
  re_entry_phase: "[P2 | P3 | P4 | P5 | P6]"
  rationale: "[1–2 sentences: what was falsified and why that phase owns the decision]"
  tier_change: "[none | upgraded to Standard | upgraded to High-stakes]"
  new_deadline: "[YYYY-MM-DD if applicable]"
```

---

## Step 5 — Time-to-learning metric

Compute and record time-to-learning:

```
time_to_learning_bd = business_days(P8_commit_date, learning_close_complete_date)
```

SLA thresholds:
- Standard tier: **≤ 15 business days** = on-time
- High-stakes tier: **≤ 30 business days** = on-time
- Missed: record as `sla_status: missed`; note in `dashes/{slug}/scope.md`

---

## Step 6 — Close the gate

Mark the gate complete when all conditions are met:

- [ ] Test ran with ≥ minimum-n role-representative participants
- [ ] All assumptions under test have a recorded result with an evidence link
- [ ] All falsified assumptions have a re-entry decision (or documented rationale for no re-entry)
- [ ] `dashes/{slug}/assumptions.md` updated for all tested rows
- [ ] `learning_close.status: complete` in `dashes/{slug}/scope.md`
- [ ] Time-to-learning computed and recorded

---

## Integration

- `usability-validation` skill produces the test plan and results that this gate reads
- `dashes/{slug}/assumptions.md` is updated by both skills — append-only, no retroactive rewrites
- The re-entry decision feeds back into the relevant phase skill (e.g., P4 → `scenario-flow-mapping`;
  P5 → `concept-divergence`; P6 → `adversarial-panel`)
