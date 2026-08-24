---
name: dataviz-selection
description: Data-visualization selection gate. Decides whether a chart is justified at all, and which form fits the question when it is. Load whenever a UI mapping, wireframe, or prototype considers a chart, graph, sparkline, or dashboard visualization.
stage: _cross-cutting
version: 0.1.0
---

# Dataviz Selection — Justify First, Then Choose the Form

## What this skill provides

A two-stage gate for any visualization candidate:

1. **Justification gate** — most candidates fail here. A chart is justified only when a user has a *question about pattern* (comparison, trend, distribution, composition, relationship) that prose or a table answers worse.
2. **Form selection** — when justified, match the question to the form.

Grounded in established canon: Abela's *Chart Suggestions* thought-starter and the FT *Visual Vocabulary* (both organized by question type, not chart name). Loaded by `skills/_cross-cutting/orca-ui-mapping/SKILL.md` when its representation tree reaches a visualization branch.

---

## Stage 1 — Justification gate

Answer all four; any "no" means **no chart**:

1. **Question** — What pattern question does the user ask? (If the answer is "show the data," use a table.)
2. **Sufficiency** — Is there enough data for a pattern to exist? Fewer than ~5 points rarely forms one.
3. **Task** — Do users need the *shape* of the data (trend, outlier, distribution), or precise values? Precise lookup → table; shape → chart.
4. **Takeaway** — Can you state the expected takeaway in one sentence? If not, the chart has no job.

**Defaults that beat charts:** single value → large numeral ("stat"); 2–4 discrete values → labeled badges or list; one-off reading → sentence; precise comparison of few values → table with tabular numerals.

---

## Stage 2 — Form selection

Match the question to the form:

| Question | Form | Notes |
|---|---|---|
| Compare across categories | Horizontal bar | Horizontal when labels are long; sort by value unless order is intrinsic |
| Trend over time | Line | Area only when cumulative/volume emphasis matters |
| Part-to-whole over time | Stacked bar | Shares time axis with trend reading |
| Static part-to-whole | Sorted bar | Pies/donuts only ≤3 slices, labeled directly, center total on donuts |
| Distribution | Histogram / box plot | Small n → dot strip plot |
| Relationship between two measures | Scatter | Label outliers, not every point |
| Progress toward a goal | Bullet / progress bar | Target line required to make progress meaningful |
| Flow between stages | Funnel / sankey | Only when stage drop-off is the question |
| Geography | Map | Only when location itself is the question |

**Encodings and honesty:**

- Bars start at zero. Truncated axes exaggerate differences — allowed for line charts, never bars.
- Direct-label series where feasible; legends only beyond ~3 series.
- Never color-only series distinction (`A11Y_NO_COLOR_ONLY`).
- State the takeaway as the title or caption ("Overdue invoices tripled in Q3"), not a description ("Invoice status by quarter").
- Provide the underlying table or an accessible summary alongside every chart — precise values remain retrievable (aligns with `chart_with_data` in `decision-tree.json`).

---

## Implementation notes

| Surface | Approach |
|---|---|
| Static HTML wireframe | Inline SVG sketch or honest placeholder box annotated with form + takeaway + data source; never fake realism |
| Coded prototype (React) | Recharts (SVG, accessible defaults) |
| Coded prototype (heavy/static) | Apache ECharts via CDN |
| Bespoke visual identity needs | visx/D3 primitives — only with a designer in the loop |

Mark synthetic data as synthetic in the annotation. A wireframe chart implies real data exists — if the pipeline doesn't produce it yet, log an assumption.

## Anti-patterns

- Decoration charts (failed Stage 1)
- Dual axes without necessity; 3D/perspective effects; rainbow categorical palettes
- Chart without a takeaway sentence
- Pie with 6+ slices "for variety"
- Realistic-looking fake data presented as evidence

## Related skills

- `skills/_cross-cutting/orca-ui-mapping/SKILL.md` — decides *whether* visualization is a candidate; this skill gates and shapes it
- `skills/_cross-cutting/ui-interaction/SKILL.md` — `chart_with_data` rule and accessibility requirements
