**TL;DR:** A **Plan Review** is the record of a [Coach](coach.md)'s decision on a submitted [Meal Plan](meal-plan.md): approve, or request changes with feedback. It creates the accountability gate (A-002).

---

## Definition

A **Plan Review** is a decision event linking one coach, one meal plan version, and an outcome (approved / changes requested) plus optional feedback.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Reviewer, decision, timestamp, note |
| **Instances** | ✅ | "Approved in 3h", "Changes: add protein to Tue lunch" |
| **Purpose** | ✅ | Members need the verdict; coaches need their queue; metrics M-003/M-004 measure it |

**Verdict:** Core system object.

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Meal Plan** | Reference → Meal Plan | Yes | System | Subject |
| 2 | **Reviewer** | Reference → Coach | Yes | System | Owning coach only |
| 3 | **Decision** | Enum | Yes | Coach manual | Approved / Changes requested |
| 4 | **Feedback** | String | No | Coach manual | Shown to member; supports per-meal anchors in v1.1 |
| 5 | **Decided At** | DateTime | Yes | System | SLA measurement (M-003) |

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Meal Plan → Member name** | Queue rows are identified by member |
| 2 | **Meal Plan → Week label** | Week label disambiguates resubmissions |
| 3 | **Decided At (wait time)** | Wait-time chip drives queue urgency (>24h flagged) |
| 4 | **Decision + Feedback** | Macro-vs-target delta and verdict inform the coach's action |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

None — event-style leaf.

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Approve** | Coach | Write | Yes → Meal Plan | Sets plan Approved |
| 2 | **Request changes** | Coach | Write | Yes → Meal Plan | Requires feedback text; reopens member editing |
| 3 | **View review history** | Both | Read | No | Full resubmit trail |

---

## Relationship Specs (MCSFD)

### Plan Review – Coach

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Queue = pending reviews across coach's groups |
| **C - Cardinality** | Many per coach; ordered by wait time |
| **S - Sorts** | Longest-waiting first (>24h flagged) |
| **F - Filters** | Group, member, wait time |
| **D - Dependencies** | Coach suspension freezes queue read-only |

---

## Business Rules

1. **Single reviewer**: only the plan owner's coach can decide.
2. **Feedback required on changes-requested**: members must never face a silent rejection.
3. **Immutable decisions**: reviews are append-only audit records.

---

## Status / Lifecycle

```
Pending -> Decided(approved | changes-requested)
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Pending** | In coach queue | Member submits |
| **Decided** | Closed with outcome | Coach acts |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Member name, week label, wait-time chip, macro-vs-target delta |
| **Visual Signature** | Queue row; amber when >24h |
| **Contextual CTAs** | "Review" opens side-by-side plan vs targets |
| **Nested Object Indicators** | Resubmission count |

---

## Shapeshifter Matrix

| Context / View | Member name | Week label | Wait time | Decision + Feedback | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- | --- |
| Review queue row (coach, shipped) | ✓ | ✓ | ✓ | | Review | Compact row |
| Review detail decision panel (coach, shipped) | ✓ | ✓ | ✓ | ✓ | Approve / Request changes | Panel |
| Plan review history timeline (both, shipped) | | ✓ | | ✓ | (none) | Timeline rows |
| Changes-requested notification (member, shipped) | | ✓ | | ✓ (feedback) | Open plan | Banner |
| Coach Home pending-review queue row (proposed) | ✓ | ✓ | ✓ | | Review | Compact row |
| Member Detail review-history block (proposed) | | ✓ | | ✓ | Approve / Request changes | Panel card |

### Key Observations

1. Wait time exists only in queue contexts; once decided, the review collapses to decision + feedback — the audit trail members and coaches both read.

---

## See Also

* [Object Library](../_index.md)
* [Meal Plan](meal-plan.md) · [Coach](coach.md)
