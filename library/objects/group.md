**TL;DR:** A **Group** is a coach-owned container of members. It scopes visibility: everything inside a group is seen by that [Coach](coach.md) and its [Members](member.md) — and no one else.

---

## Definition

A **Group** is the unit of coaching organization: one coach, a named roster of members, and the aggregate activity (plans, logs, summaries) those members produce.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Name, roster, weekly activity — detail page natural |
| **Instances** | ✅ | "Summer Cut 2026", "Team Ravi – Nutrition" |
| **Purpose** | ✅ | Coaches organize clients; summaries are per-group |

**Verdict:** Core system object.

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Name** | String | Yes | Manual | Coach-set |
| 2 | **Coach** | Reference → Coach | Yes | System | Owner |
| 3 | **Invite Code** | String | Yes | System | Rotatable; grants member join |
| 4 | **Member Count** | Number | Computed | Computed | Roster size |
| 5 | **Created At** | Date | Yes | System | Audit |

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Name** | Coach-set identity of the container |
| 2 | **Member Count** | Roster size at a glance |
| 3 | **This-week adherence %** | Drives dashboard severity sorting |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

| Nested Object | Relationship | How It Gets There |
| --- | --- | --- |
| [Member](member.md) | One-to-many | Join via invite code |
| [Weekly Summary](weekly-summary.md) | One-to-many (one per week) | Computed at week close |

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Create group** | Coach | Admin | No | Open platform: any coach account |
| 2 | **Copy invite link/code** | Coach | Admin | No | Rotating invalidates old links |
| 3 | **Rename / archive group** | Coach | Admin | No | Archive freezes activity, keeps history readable |
| 4 | **View group dashboard** | Coach | Read | Yes → Weekly Summary | Always-on pull surface |

---

## Relationship Specs (MCSFD)

### Group – Member

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Member redeems invite code; membership unique per member |
| **C - Cardinality** | One group : many members (typical 5–50) |
| **S - Sorts** | Roster alphabetical; dashboard sorted by week status severity |
| **F - Filters** | Status chip (no plan / in review / approved / logging), adherence band |
| **D - Dependencies** | Archiving preserves member data read-only; deletion requires disposition choice |

---

## Business Rules

1. **One group per member**: joining a new group requires leaving the current one; confirm dialog warns history becomes inaccessible.
2. **Visibility boundary**: group content never crosses groups — enforced server-side.
3. **Invite rotation**: rotating the code immediately invalidates outstanding links.

---

## Status / Lifecycle

```
Active -> Archived
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Active** | Normal operation | Creation |
| **Archived** | Read-only history | Coach archives |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Name, member count, this-week adherence % |
| **Visual Signature** | Named card with adherence bar |
| **Contextual CTAs** | "Open dashboard", "Invite" |
| **Nested Object Indicators** | Pending-review count badge |

---

## Shapeshifter Matrix

| Context / View | Name | Member Count | This-week adherence % | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- |
| Coach Dashboard groups overview (shipped) | ✓ | ✓ | ✓ | Open dashboard | Medium card |
| Group dashboard — roster + live stats (shipped) | ✓ | ✓ | ✓ | Invite, Rename / archive | Full page |
| Group settings (shipped) | ✓ | | | Copy invite code, Archive | Full page |
| Join group screen (member, shipped) | ✓ | | | Join | Mini card |
| Coach Home group adherence tile (proposed) | ✓ | ✓ | ✓ | Open dashboard | Tile |

### Key Observations

1. To members the group is a single named container they join once; to coaches it is a management surface that collapses into an adherence tile on the proposed console home.

---

## See Also

* [Object Library](../_index.md)
* [Coach](coach.md) · [Member](member.md) · [Weekly Summary](weekly-summary.md)
