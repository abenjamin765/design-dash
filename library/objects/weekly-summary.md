**TL;DR:** A **Weekly Summary** is the computed end-of-week activity digest for one [Group](group.md): per-member plan status, adherence, and deviation highlights. Delivered via always-on dashboard plus a weekly push nudge (intake decision).

---

## Definition

A **Weekly Summary** is a system-computed snapshot of one group's week — who submitted, who was approved, who logged, who drifted — generated when the week closes and readable any time.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Week, per-member rows, aggregate stats |
| **Instances** | ✅ | "Summer Cut – week of Aug 17: 8/10 submitted, 64% adherence" |
| **Purpose** | ✅ | The coach's weekly management view (A-004); drives M-001 visibility |

**Verdict:** Core system object; computed artifact.

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Group** | Reference → Group | Yes | System | Scope |
| 2 | **Week Start** | Date (Monday) | Yes | System | Uniqueness key with group |
| 3 | **Member Rows** | Computed list | Yes | Computed | Per member: plan status, adherence %, modified/replaced counts, streak |
| 4 | **Group Stats** | Computed | Yes | Computed | Submission rate, median adherence, review turnaround |
| 5 | **Highlights** | Computed | No | Computed | Notable deviations (e.g., ≥3 replaced dinners) |
| 6 | **Generated At** | DateTime | Yes | System | Snapshot time |

Meta: visible only to the owning coach. Member rows show first name + initial only in v1 UI.

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Week Start** | Week label identifies the snapshot |
| 2 | **Group Stats** | Submission rate is the headline number |
| 3 | **Member Rows** | Per-member adherence % drives severity sorting |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

| Nested Object | Relationship | How It Gets There |
| --- | --- | --- |
| [Member](member.md) | Aggregated rows | Computed from plans/logs |

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Open summary** | Coach | Read | No | From dashboard or push nudge deep link |
| 2 | **Open member's week** | Coach | Read | Yes → Meal Plan | Drill-through from row |
| 3 | **Compare weeks** | Coach | Read | No | Adherence trend sparkline |

---

## Relationship Specs (MCSFD)

### Weekly Summary – Group

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Generated at week close; also recomputable live for current week on dashboard |
| **C - Cardinality** | One per group-week |
| **S - Sorts** | Reverse-chronological; rows by severity (no plan > low adherence > healthy) |
| **F - Filters** | Status chip, adherence band |
| **D - Dependencies** | Frozen snapshots survive member departure (privacy: departed members' rows anonymize after leave) |

---

## Business Rules

1. **Coach-only visibility**: summaries never expose member data across groups.
2. **Push nudge**: sent at week close to coach's device; deep-links to summary.
3. **Anonymization on departure**: left members appear as "former member" rows without detail.

---

## Status / Lifecycle

```
Live(current week) -> Final(week closed)
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Live** | Rolling dashboard view of current week | Always available |
| **Final** | Frozen snapshot + push sent | Week closes |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Week label, submission rate, adherence % |
| **Visual Signature** | Summary card with trend arrow |
| **Contextual CTAs** | "Open", "Share export" (v1.1) |
| **Nested Object Indicators** | Member-row count |

---

## Shapeshifter Matrix

| Context / View | Week Start | Submission rate | Adherence % | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- |
| Weekly summary page (coach, shipped) | ✓ | ✓ | ✓ | Open member's week, Compare weeks | Full page |
| Dashboard live-week card (coach, shipped) | ✓ | ✓ | ✓ | Open summary | Medium card |
| Push nudge deep link (coach, shipped) | ✓ | ✓ | | Open summary | Banner |
| Compare-weeks trend (coach, shipped) | ✓ | | ✓ (sparkline) | (none) | Mini chart row |
| Coach Home group adherence tile (proposed) | ✓ | ✓ | ✓ | Open dashboard | Tile |

### Key Observations

1. The summary keeps its three headline numbers in every shape; only the trend sparkline and drill-through actions appear in dedicated views.

---

## See Also

* [Object Library](../_index.md)
* [Group](group.md) · [Meal Log Entry](meal-log-entry.md)
