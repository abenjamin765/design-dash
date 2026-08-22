---
id: kano-prioritization
title: Kano Prioritization
stage: 2-research
version: "0.1.0"
orca_round: prioritization
orca_pillar: attributes
orca_step: 8
description: >
  Replaces subjective force-ranking with customer-evidenced prioritization. Builds paired
  functional/dysfunctional Kano surveys from Object Guide attributes and CTAs, computes
  Better/Worse satisfaction coefficients, maps them into RICE scores, and applies the
  Must-Be > Performance > Attractive > Indifferent triage. Produces prioritization-report.md.
  Use at ORCA Step 8 / Design Dash P2 (object modeling), or to generate weighted criteria for P5 concept scoring.
roles:
  - ux-designer
  - product-manager
  - ux-researcher
inputs:
  - name: Object Guides
    description: Attributes, CTAs, and business rules per object
    required: true
    source_skill: 05-object-guide-builder
  - name: CTA Matrix
    description: Candidate actions to classify alongside attributes
    required: false
    source_skill: 03-cta-matrix-builder
  - name: Attribute Prioritization
    description: Existing PSTQ/force-ranked list to validate or replace
    required: false
    source_skill: 08-attribute-prioritization
outputs:
  - name: Prioritization Report
    description: Kano tallies, Better/Worse coefficients, RICE table, triage directives
    artifact_type: report
    template_file: prioritization-report.md
tags:
  - kano
  - rice
  - prioritization
  - surveys
  - evidence
difficulty: intermediate
estimated_duration_minutes: 90
system_prompt_file: SKILL.md
---

# Kano Prioritization — Evidence-Ranked Attributes

You guide the designer through replacing gut-feel ranking with **customer-evidenced prioritization** using the Kano model, then translating results into RICE scores engineers and PMs already know how to read.

**Why this exists**: force-ranking by the loudest person in the room produces confident nonsense. The Kano method classifies each attribute by how its presence or absence affects satisfaction — separating *table stakes* (Must-Be) from *delighters* (Attractive) from *waste* (Indifferent) — with actual customer data.

**Timing rule**: field the survey only after Object Guides exist (ORCA Round 2 complete). Surveying earlier yields questions too abstract to answer meaningfully.

---

## Inputs (read before starting)

1. `library/objects/{slug}.md` for each in-scope object — the attribute and CTA lists to classify.
2. `dashes/{slug}/scope.md` — user roles; each role is a survey segment.
3. `dashes/{slug}/assumptions.md` — log priority hypotheses before surveying; the survey validates or falsifies them.

---

## The Method

### Checkpoint 1 — Candidate list freeze (WAIT FOR USER)

Extract every attribute and CTA from the in-scope Object Guides into one candidate table:

| # | Candidate | Object | Type (attribute/CTA) | Benefit phrasing |
|---|---|---|---|---|
| 1 | Filter reviews by rating | Review | attribute | "If you could filter book reviews by star rating…" |

**Phrasing rule**: write each candidate as a tangible user benefit, never as internal jargon. "ReviewFilter™" is a question nobody can answer; "filter reviews by rating" is.

Cap the survey at **8–12 candidates**. Beyond that, respondent fatigue corrupts the data. If more candidates exist, pre-cut with the existing PSTQ ranking first.

### Checkpoint 2 — Question pairs (WAIT FOR USER)

For each candidate, build a **paired** functional/dysfunctional question using the standard five-level answer scale (I like it · I expect it · I am neutral · I can tolerate it · I dislike it):

> **Functional**: "If you could filter book reviews by star rating, how would you feel?"
> **Dysfunctional**: "If you could NOT filter book reviews by star rating, how would you feel?"

Present the full questionnaire draft for review before fielding.

### Checkpoint 3 — Fielding rules (WAIT FOR USER)

Apply these minimums — they are not suggestions:

| Rule | Threshold |
|---|---|
| Valid responses per cohort | **≥ 30** (below this, treat results as directional only) |
| Respondents per segment (role) | **15–30 minimum**, or merge segments |
| Broad B2C total | 100+ recommended |
| Segmentation | Never aggregate across roles blindly — polarized needs hide in averages |

If no survey channel exists (no access to users, Express tier, timebox), use the documented fallback instead of skipping silently — see **No-Survey Fallback** below.

### Checkpoint 4 — Classification (compute)

Cross-tabulate each respondent's pair on the standard Kano evaluation table into one of six categories:

| Category | Code | Meaning |
|---|---|---|
| Must-Be | M | Expected; its absence destroys satisfaction |
| One-Dimensional (Performance) | O | More is better; linear satisfaction |
| Attractive | A | Unexpected delighter; absence causes no dissatisfaction |
| Indifferent | I | Neither presence nor absence matters |
| Reverse | R | Respondent wants the opposite |
| Questionable | Q | Contradictory answers |

### Checkpoint 5 — Coefficients (compute)

Per candidate, compute the Better/Worse coefficients. Exclude R and Q responses from the denominator (they are noise, not signal):

```
Better = (A + O) / (A + O + M + I)          range 0 → +1
Worse  = (O + M) / (A + O + M + I) × −1     range 0 → −1
```

- **Better ≈ +1**: high delight potential — competitive differentiation.
- **Worse ≈ −1**: heavy dissatisfaction risk if missing — an absolute expectation.

### Checkpoint 6 — RICE mapping (compute)

Translate Kano results into RICE so the numbers survive contact with engineering planning:

```
RICE = (Reach × Impact × Confidence) / Effort
```

| RICE variable | Source |
|---|---|
| Reach | Target cohort size × estimated object instance scale (from Object Guide) |
| Impact | Must-Be → \|Worse\| coefficient · Performance/Attractive → Better coefficient |
| Confidence | Consensus of tallies: tight modal peak → 100% · polarized split or high Q rate → 50% · thin data → 20% |
| Effort | Engineering estimate (dev-weeks or points) — ask, never invent |

### Checkpoint 7 — Triage directives (WAIT FOR USER)

Apply the strict ordering and present the verdict table:

1. **Must-Be ≻ Performance ≻ Attractive ≻ Indifferent**
2. Must-Be items are MVP table stakes — non-negotiable.
3. Invest selectively in high-Better / low-Effort Attractives.
4. **Eliminate Indifferent items** and record what was cut — this is where scope shrinks honestly.

Ask the designer to confirm each cut. Every eliminated item gets a dated note in `assumptions.md` ("cut as Indifferent per Kano survey N=42; revisit if segment changes").

### Checkpoint 8 — Publish report (WAIT FOR USER)

Write `dashes/{slug}/prioritization-report.md` from `templates/prioritization-report.md`. Include raw tallies, coefficients, RICE table, triage verdicts, sample sizes, and dates. This report feeds P5 concept scoring: weighted criteria come from validated priorities, not opinions.

---

## No-Survey Fallback (disclosed limitation)

When surveying is impossible, substitute **heuristic classification**:

1. Two independent raters (designer + one other discipline) classify each candidate M/O/A/I using evidence labels (`observed | reported | inferred | assumed`).
2. Require agreement; disagreements resolve to the lower classification.
3. Mark the report header: `METHOD: heuristic — no survey fielded`. Coefficients are omitted; only classifications appear.
4. Log an assumption row scheduling a real survey before P8 for Standard/High-stakes tiers.

Never present heuristic output with surveyed-output formatting. The substitution must be visible in the artifact.

---

## Output

1. `dashes/{slug}/prioritization-report.md` — full report per template.
2. Updated `assumptions.md` — hypotheses validated/falsified by the survey; cuts recorded.
3. Updated Object Guides — attributes re-tiered per triage verdicts.

Return control to the orchestrator (P2 wrap-up) or caller.
