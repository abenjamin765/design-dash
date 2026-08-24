**TL;DR:** A **Meal Log Entry** is the member's daily completion mark on a [Planned Meal](planned-meal.md): **as-is**, **modified**, or **replaced**. Log-only — marks are never re-approved (intake decision).

---

## Definition

A **Meal Log Entry** records what actually happened at one planned meal: eaten as planned, eaten with modifications, or replaced with something else — captured in one tap, with optional detail.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Mark type, timestamp, optional replacement content |
| **Instances** | ✅ | "Tue lunch: as-is", "Fri dinner: replaced – pizza night" |
| **Purpose** | ✅ | Feeds adherence (M-001) and the coach's weekly picture of reality vs plan |

**Verdict:** Core system object; the execution-side twin of Planned Meal.

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Planned Meal** | Reference → Planned Meal | Yes | System | Subject (snapshot at mark time) |
| 2 | **Mark** | Enum | Yes | Member manual | As-is / Modified / Replaced |
| 3 | **Detail** | String | No | Member manual | What changed / what was eaten instead |
| 4 | **Logged At** | DateTime | Yes | System | Adherence timing analysis |

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Mark** | The ✓ / pencil / swap icon is the entry's whole meaning |
| 2 | **Logged At** | Timestamp feeds adherence timing analysis |
| 3 | **Detail** | Snippet explains modified/replaced marks |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

None — event-style leaf.

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Mark as-is** | Member | Write | No | One tap |
| 2 | **Mark modified** | Member | Write | No | Prompts optional "what changed" |
| 3 | **Mark replaced** | Member | Write | No | Prompts optional "what instead" |
| 4 | **Change mark** | Member | Write | No | Allowed until week closes |

---

## Relationship Specs (MCSFD)

### Meal Log Entry – Weekly Summary

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Entries aggregate into member-week adherence stats |
| **C - Cardinality** | Many entries : one summary contribution |
| **S - Sorts** | Chronological within day view |
| **F - Filters** | Mark type |
| **D - Dependencies** | Week close freezes entries into the summary snapshot |

---

## Business Rules

1. **One entry per planned meal**: re-marking overwrites until week close.
2. **Snapshot integrity**: entry stores meal content at mark time.
3. **No approval loop**: marks never trigger review (log-only model).
4. **Late marking**: allowed any time before week close; timestamps preserved.

---

## Status / Lifecycle

```
(none) -> Logged -> Final(frozen at week close)
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Logged** | Active mark, editable | Member marks |
| **Final** | Frozen into summary | Week closes |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Mark icon (✓ / pencil / swap), time, detail snippet |
| **Visual Signature** | Inline chip on today's meal row |
| **Contextual CTAs** | Three-mark segmented control |
| **Nested Object Indicators** | — |

---

## Shapeshifter Matrix

| Context / View | Mark | Logged At | Detail | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- |
| Today inline chip (member, shipped) | ✓ | ✓ | ✓ (snippet) | Change mark | Inline chip |
| Mark detail / edit (member, shipped) | ✓ | ✓ | ✓ | Save mark | Mini form |
| Weekly summary counts (coach, shipped) | ✓ (aggregated modified/replaced) | | | Open member's week | Data cell |

### Key Observations

1. The log entry is an inline chip in the member's day but pure aggregate counts in the coach's summary — the individual mark never surfaces to the coach, only its tally.

---

## See Also

* [Object Library](../_index.md)
* [Planned Meal](planned-meal.md) · [Weekly Summary](weekly-summary.md)
