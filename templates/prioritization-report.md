# Prioritization Report — {Dash Name}

> **Method**: surveyed (Kano, N={total valid responses}) · or · heuristic — no survey fielded
> **Date**: {YYYY-MM-DD} · **Segments**: {role segments with per-segment N}
> **Candidates evaluated**: {count} · **Survey window**: {start}–{end}

## 1. Candidate List

| # | Candidate | Object | Type | Benefit phrasing (as surveyed) |
|---|---|---|---|---|
| 1 | | | attribute / CTA | |

## 2. Kano Tallies

Per candidate: counts per category. R and Q are excluded from coefficient math.

| # | Candidate | M | O | A | I | R | Q | Modal class |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | |

## 3. Better / Worse Coefficients

```
Better = (A + O) / (A + O + M + I)
Worse  = (O + M) / (A + O + M + I) × −1
```

| # | Candidate | Better (+1→0) | Worse (0→−1) | Consensus (tight/polarized) |
|---|---|---|---|---|
| 1 | | | | |

## 4. RICE Table

| # | Candidate | Reach | Impact source | Impact | Confidence | Effort | RICE |
|---|---|---|---|---|---|---|---|
| 1 | | cohort × instance scale | \|Worse\| or Better | | 100/50/20% | dev-weeks | |

## 5. Triage Verdict

Ordering rule: **Must-Be ≻ Performance ≻ Attractive ≻ Indifferent**

| Verdict | Candidates | Directive |
|---|---|---|
| Must-Be (MVP table stakes) | | Build; non-negotiable |
| Performance (invest to win) | | Prioritize by RICE |
| Attractive (selective delighters) | | Only high-Better / low-Effort |
| Indifferent (cut) | | Remove from scope; log in assumptions.md |

## 6. Segment Divergence Notes

Where segments disagreed materially (e.g., Admins treat X as Must-Be, Members as Indifferent), record the split and which segment the decision serves.

## 7. Assumptions Affected

| Assumption ID | Statement | Survey verdict | Action |
|---|---|---|---|
| A-### | | validated / falsified | update guide / cut / keep watching |

## 8. Limitations

- Sample size vs threshold (≥30/cohort): {met/not met}
- Segment coverage gaps: {list}
- Heuristic substitution disclosure (if applicable): {METHOD line repeated}
