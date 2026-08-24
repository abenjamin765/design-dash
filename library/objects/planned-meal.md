**TL;DR:** A **Planned Meal** is one meal slot on one day inside a [Meal Plan](meal-plan.md): a named meal with a food/portion list and auto-summed macros. It is what the member later marks done via a [Meal Log Entry](meal-log-entry.md).

---

## Definition

A **Planned Meal** is a single scheduled eating occasion — e.g., "Tuesday Lunch" — holding intended foods, portions, and computed macros against that day's target share.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Day, slot, name, food lines, macro sums |
| **Instances** | ✅ | "Mon Breakfast: oats + whey + banana", "Wed Dinner: salmon, rice, greens" |
| **Purpose** | ✅ | The unit members plan and execute; coaches scan these to judge plan quality |

**Verdict:** Core system object.

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Day** | Date | Yes | System | Within parent plan's week |
| 2 | **Slot** | Enum | Yes | Manual | Breakfast / Lunch / Dinner / Snack (custom labels allowed) |
| 3 | **Name** | String | Yes | Manual | e.g., "Post-workout shake" |
| 4 | **Food Lines** | List of {food, portion} | Yes | Manual | Free-text food + quantity (no DB in v1) |
| 5 | **Macros** | Number ×4 | Computed | Computed | Auto-summed from lines; manual override per line allowed |
| 6 | **Notes** | String | No | Manual | Prep hints |

Meta: v1 has no food database (scope N1) — food lines are free text with optional manual macro entry per line; totals recompute on change.

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Slot** | Slot label positions the meal in the day grid |
| 2 | **Name** | Human-readable meal identity |
| 3 | **Macros** | Macro chips are the planning-quality signal |
| 4 | **Mark state** | Logged state icon shows execution progress |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

None — leaf within its plan.

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Add food line** | Member | Write | No | Draft states only |
| 2 | **Duplicate meal** | Member | Write | No | To another day/slot |
| 3 | **Mark as-is / modified / replaced** | Member | Write | Yes → Meal Log Entry | Logging state only |

---

## Relationship Specs (MCSFD)

### Planned Meal – Meal Log Entry

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Member taps mark on today's planned meal; creates log entry |
| **C - Cardinality** | Zero or one log entry per planned meal |
| **S - Sorts** | By slot order within day |
| **F - Filters** | Marked / unmarked |
| **D - Dependencies** | Plan edit after logging preserves existing entries against old content snapshot |

---

## Business Rules

1. **Macro summing**: line-level overrides recalculate meal and day totals immediately.
2. **Slot flexibility**: custom slot names permitted; defaults offered.
3. **Snapshot on log**: a log entry stores the meal content at mark time so later edits don't falsify history.

---

## Status / Lifecycle

```
Planned -> Logged(as-is | modified | replaced)
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Planned** | Awaiting execution | Member adds |
| **Logged** | Has completion mark | Member marks |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Slot label, name, macro chips, logged state icon |
| **Visual Signature** | Compact row card; checkmark / pencil / swap icons for the three marks |
| **Contextual CTAs** | "Mark", "Edit" (state-dependent) |
| **Nested Object Indicators** | Food-line count |

---

## Shapeshifter Matrix

| Context / View | Slot | Name | Macros | Mark state | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- | --- |
| Plan editor meal slot (member, shipped) | ✓ | ✓ | ✓ | | Add food line, Duplicate, Edit | Editable compact card |
| Today meal row (member, shipped) | ✓ | ✓ | | ✓ | Mark as-is / modified / replaced | Compact row |
| Review detail day cell (coach, shipped) | ✓ | ✓ | ✓ | | (none — read-only) | Mini row |

### Key Observations

1. The planned meal flips from an editable build-time card to a one-tap logging row to a read-only coach scan target; only Slot and Name persist across all three.

---

## See Also

* [Object Library](../_index.md)
* [Meal Plan](meal-plan.md) · [Meal Log Entry](meal-log-entry.md)
