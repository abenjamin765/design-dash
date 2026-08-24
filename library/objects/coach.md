**TL;DR:** A **Coach** is a professional user who owns [Groups](group.md), sets member [Macro Targets](macro-targets.md), approves [Meal Plans](meal-plan.md), and reads [Weekly Summaries](weekly-summary.md).

---

## Definition

A **Coach** is a user account with authority over one or more groups of members: it defines nutrition targets, reviews submitted plans, and consumes group activity digests.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Profile, groups, pending reviews queue |
| **Instances** | ✅ | "Coach Dana (2 groups)", "Coach Ravi (1 group)" |
| **Purpose** | ✅ | Coaches seek their review queue and group adherence at a glance |

**Verdict:** Core system object.

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Name** | String | Yes | Manual | Display name shown to their members |
| 2 | **Email** | String | Yes | System | Login identity; unique; private |
| 3 | **Groups** | Reference → Group | Computed | System | One-to-many |
| 4 | **Pending Reviews** | Number | Computed | Computed | Drives badge/nav urgency |

Meta: a coach can see only members inside their own groups. Cross-coach visibility is structurally impossible (enforced server-side, P7 privacy gate will verify).

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Avatar** | Primary visual identity on rosters and cards |
| 2 | **Name** | Display name shown to their members |
| 3 | **Groups** | Group count signals coaching scope at a glance |
| 4 | **Pending Reviews** | Drives badge/nav urgency |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

| Nested Object | Relationship | How It Gets There |
| --- | --- | --- |
| [Group](group.md) | One-to-many (typical 1–5) | Coach creates |
| [Plan Review](plan-review.md) | One-to-many (as reviewer) | Created when coach decides on a submission |

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Review submitted plan** | Coach | Write | Yes → Plan Review | Primary daily action |
| 2 | **Set macro targets** | Coach | Write | Yes → Macro Targets | Per member |
| 3 | **Create group / invite member** | Coach | Admin | Yes → Group | Invite via link/code |
| 4 | **Open weekly summary** | Coach | Read | Yes → Weekly Summary | Dashboard + push nudge |
| 5 | **Remove member** | Coach | Admin | Yes → Member | Archives member data for that group |

---

## Relationship Specs (MCSFD)

### Coach – Group

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Coach creates groups; ownership immutable in v1 |
| **C - Cardinality** | One coach : many groups (typical 1–5) |
| **S - Sorts** | Most-recent-activity first |
| **F - Filters** | — |
| **D - Dependencies** | Deleting a coach account requires explicit member-data disposition choice (export or anonymize) — high-stakes data rule |

---

## Business Rules

1. **Scope isolation**: all reads are filtered to groups the coach owns.
2. **Review SLA surface**: plans waiting >24h flagged in the review queue (supports M-003).
3. **No self-coaching**: an account is either coach or member role per group context; v1 forbids one account holding both.

---

## Status / Lifecycle

```
Active -> Suspended -> Deleted(disposition required)
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Active** | Normal operation | Signup |
| **Suspended** | Temporarily blocked; groups read-only | Admin action / violation |
| **Deleted** | Removed after data disposition | Account deletion request |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Avatar, name, group count, pending-review badge |
| **Visual Signature** | Avatar + accent ring when reviews pending |
| **Contextual CTAs** | "Open review queue" |
| **Nested Object Indicators** | Group chips |

---

## Shapeshifter Matrix

| Context / View | Avatar | Name | Groups | Pending Reviews | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- | --- |
| Coach Home header (proposed) | ✓ | ✓ | ✓ | ✓ | Open review queue | Medium card |
| Dashboard nav badge (shipped) | | | | ✓ | Open review queue | Badge |
| Today — "Your coach" (member view, shipped) | ✓ | ✓ | | | View profile | Inline identity chip |
| Review detail — reviewer identity (shipped) | ✓ | ✓ | | | Approve / Request changes | Compact row |
| Profile / Settings (self, shipped) | ✓ | ✓ | ✓ | ✓ | Edit profile | Full page |

### Key Observations

1. The coach shapeshifts from a full authority surface (own console) down to a bare identity chip inside the member's world — pending-review urgency is the only attribute that follows the coach across contexts.

---

## See Also

* [Object Library](../_index.md)
* [Group](group.md) · [Plan Review](plan-review.md) · [Weekly Summary](weekly-summary.md)
