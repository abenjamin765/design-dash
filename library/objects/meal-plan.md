**TL;DR:** A **Meal Plan** is a member's dated Monday–Sunday set of [Planned Meals](planned-meal.md) for one week, drafted against their [Macro Targets](macro-targets.md) and gated by a [Plan Review](plan-review.md). It is the app's central weekly object.

---

## Definition

A **Meal Plan** is one week's plan instance belonging to a single member: 7 days × N meal slots, each holding a food list with auto-summed macros, moving through draft → in review → approved (or changes requested) → logging.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Week dates, day grid, meals, review state, macro totals |
| **Instances** | ✅ | "Maria – Week of Aug 24", "Devon – Week of Aug 31" |
| **Purpose** | ✅ | The thing members build and coaches approve; adherence is measured against it |

**Verdict:** Core system object — the hub of the weekly loop.

---

## Synonyms / Also Known As

| Term | Context | Notes |
| --- | --- | --- |
| "My plan for the week" | Member language | UI: "This week" / "Next week" |

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Member** | Reference → Member | Yes | System | Owner |
| 2 | **Week Start** | Date (Monday) | Yes | System | Uniqueness key with member |
| 3 | **Status** | Enum | Yes | System | Draft / In review / Changes requested / Approved / Logging / Closed |
| 4 | **Planned Meals** | Reference → Planned Meal | Computed | Computed | 7-day grid contents |
| 5 | **Macro Totals** | Number ×4 per day + week | Computed | Computed | Auto-summed from food lists |
| 6 | **Target Snapshot** | Reference → Macro Targets version | Yes | System | Targets the plan was built against |
| 7 | **Submitted At** | DateTime | No | System | Set on submit |
| 8 | **Coach Note** | String | No | Coach manual | Feedback carried on review |

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Week Start** | Week label identifies the plan instance |
| 2 | **Status** | Status chip drives state-dependent CTAs |
| 3 | **Macro Totals** | Daily-macro-vs-target bar is the quality signal |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

| Nested Object | Relationship | How It Gets There |
| --- | --- | --- |
| [Planned Meal](planned-meal.md) | One-to-many (7–35 typical) | Member adds meal slots |
| [Plan Review](plan-review.md) | One-to-many (history) | Created on each coach decision |
| [Meal Log Entry](meal-log-entry.md) | One-to-many via planned meals | Member marks daily |

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Add / edit / remove meal** | Member | Write | Yes → Planned Meal | Only while Draft or Changes requested |
| 2 | **Submit for approval** | Member | Write | Yes → Plan Review | Locks editing |
| 3 | **Approve / request changes** | Coach | Write | Yes → Plan Review | Coach-only |
| 4 | **Copy last week's plan** | Member | Write | No | Fastest drafting path (A-001) |
| 5 | **View plan** | Both | Read | No | Read-only after submit |

---

## Relationship Specs (MCSFD)

### Meal Plan – Plan Review

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Submit creates pending review; coach decision closes it |
| **C - Cardinality** | Many reviews per plan across its life (resubmit cycles) |
| **S - Sorts** | Reverse-chronological |
| **F - Filters** | Pending / decided |
| **D - Dependencies** | "Changes requested" reopens member editing; resubmission creates new pending review |

### Meal Plan – Week

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | One plan per member-week; auto-created skeleton on week rollover or via "draft next week" |
| **C - Cardinality** | Exactly one per member per week |
| **S - Sorts** | Chronological |
| **F - Filters** | Status |
| **D - Dependencies** | Week close computes Weekly Summary contribution and freezes logging |

---

## User Stories

### Submit my week

> As a **Member**, I want to **submit** my **Meal Plan** so that my coach can approve it before Monday.
>
> When I hit "Submit", I should see a macro summary vs targets and a confirmation that editing is locked.

---

## Business Rules

1. **Uniqueness**: one plan per member per week-start.
2. **Edit lock**: editing allowed only in Draft / Changes-requested states.
3. **Log-only execution**: after approval, mid-week swaps are recorded as log entries — never re-approved (intake decision).
4. **Late plans**: a week starting without an approved plan is allowed but flagged to both parties.

---

## Status / Lifecycle

```
Draft -> In review -> Approved -> Logging -> Closed
                \-> Changes requested -> (edit) -> In review
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Draft** | Member building | Week created |
| **In review** | Waiting on coach | Member submits |
| **Changes requested** | Coach feedback; editable again | Coach requests changes |
| **Approved** | Contract of record for the week | Coach approves |
| **Logging** | Daily marks active | Week starts (approved) |
| **Closed** | Week ended; summary computed | Week ends |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Week label, status chip, daily-macro-vs-target bar |
| **Visual Signature** | Week grid thumbnail; status color coding |
| **Contextual CTAs** | Member: Edit/Submit/Copy-last-week by state; Coach: Review |
| **Nested Object Indicators** | Meal count, review count |

---

## Shapeshifter Matrix

| Context / View | Week Start | Status | Macro Totals | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- |
| Today — week status header (member, shipped) | ✓ | ✓ | | Draft next week, Submit | Status banner |
| My Week grid (member, shipped) | ✓ | ✓ | ✓ | Add / edit meal, Copy last week | Full page |
| Plan editor (member, shipped) | ✓ | ✓ | ✓ | Add / edit / remove meal, Submit | Full page |
| Review queue row (coach, shipped) | ✓ | ✓ | ✓ (delta vs targets) | Review | Compact row |
| Coach Home pending-review queue row (proposed) | ✓ | ✓ | ✓ (delta vs targets) | Review | Compact row |
| Member Detail plan-status block (proposed) | ✓ | ✓ | | Approve / Request changes | Panel card |

### Key Observations

1. The plan is the app's hub object, so its shape swings widest: full editing grid for the member, a single status chip on Today, and a delta-vs-targets row in every coach queue.

---

## See Also

* [Object Library](../_index.md)
* [Planned Meal](planned-meal.md) · [Plan Review](plan-review.md) · [Meal Log Entry](meal-log-entry.md)
