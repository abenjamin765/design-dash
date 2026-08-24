**TL;DR:** A **Member** is a person on a nutrition program who drafts weekly meal plans, submits them for coach approval, and logs daily execution. Members belong to exactly one [Group](group.md) led by one [Coach](coach.md).

---

## Definition

A **Member** is a user account representing an individual following a coached nutrition program, holding their macro targets, meal plans, and meal logs.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Profile, group membership, macro targets, plans — a detail page is natural |
| **Instances** | ✅ | "Maria (cut phase)", "Devon (recomp)" |
| **Purpose** | ✅ | Members seek their week's plan, today's meals, and their adherence standing |

**Verdict:** Core system object.

---

## Synonyms / Also Known As

| Term | Context | Notes |
| --- | --- | --- |
| Client | Coach-speak | Avoid in UI; use "member" everywhere |

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Name** | String | Yes | Manual | Display name; editable by member |
| 2 | **Email** | String | Yes | System | Login identity; unique; private |
| 3 | **Group** | Reference → Group | Yes | System | Exactly one; set at join time |
| 4 | **Timezone** | Enum | Yes | System | Drives day/week boundaries for logging |
| 5 | **Avatar** | Image | No | Manual | Optional |
| 6 | **Joined At** | Date | Yes | System | Audit |
| 7 | **Adherence Streak** | Number | Computed | Computed | Consecutive weeks ≥70% logged; motivational surface only |

Meta: email visible only to the member and their coach (A-007). Name/avatar visible to group peers? Default **no** — group roster shows first name + initial only.

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Avatar** | Primary visual identity on rosters and cards |
| 2 | **Name** | First name + initial is the privacy-safe roster identity |
| 3 | **Adherence Streak** | Motivational surface; distinguishes member cards |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

| Nested Object | Relationship | How It Gets There |
| --- | --- | --- |
| [Macro Targets](macro-targets.md) | One-to-one (active) | Coach sets/updates |
| [Meal Plan](meal-plan.md) | One-to-many (one per week) | Member creates |
| [Meal Log Entry](meal-log-entry.md) | Many-to-many via plans | Member marks daily |

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Draft next week's plan** | Member | Write | Yes → Meal Plan | Primary weekly action |
| 2 | **Mark meal** | Member | Write | Yes → Meal Log Entry | Daily, one tap per meal |
| 3 | **Edit profile / timezone** | Member | Write | No | Timezone change mid-week warns about boundary shift |
| 4 | **View member detail** | Coach (own group), self | Read | No | Peers cannot open member profiles |

---

## Relationship Specs (MCSFD)

### Member – Group

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Member joins via coach invite link/code |
| **C - Cardinality** | One member : one group (locked at intake) |
| **S - Sorts** | Roster alphabetical by first name |
| **F - Filters** | Active/left |
| **D - Dependencies** | Leaving a group archives plans/logs; data retained for that coach's summaries until deletion request |

---

## User Stories

### Draft my week

> As a **Member**, I want to **draft** a **Meal Plan** so that my coach can approve it before the week starts.
>
> When I open "Next Week" on Sunday, I should see an empty Mon–Sun grid with my macro targets pinned.

---

## Business Rules

1. **Single group**: a member belongs to at most one group at a time.
2. **Privacy**: member activity visible only to self + own coach (A-007).
3. **Timezone lock**: log-day boundaries follow member timezone captured at plan creation.

---

## Status / Lifecycle

```
Invited -> Active -> Left
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Invited** | Has join code, not yet signed up | Coach invite |
| **Active** | Full participation | Signup complete |
| **Left** | Departed group; data archived | Self-leave or coach removal |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Avatar, first name, adherence streak |
| **Visual Signature** | Round avatar, neutral card |
| **Contextual CTAs** | Coach view: "Set macros", "Open plan"; Member view: none (self page) |
| **Nested Object Indicators** | This week's status chip (Drafting / In review / Approved / Logging) |

---

## Shapeshifter Matrix

| Context / View | Avatar | Name | Adherence Streak | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- |
| Today — self header (shipped) | ✓ | ✓ | ✓ | Edit profile | Header strip |
| History (self, shipped) | ✓ | ✓ | ✓ | View past weeks | Medium card |
| Group dashboard roster row (coach, shipped) | ✓ | ✓ (first + initial) | | Set macros, Open plan | Data row |
| Weekly summary member row (coach, shipped) | | ✓ (first + initial) | ✓ | Open member's week | Data row |
| Review queue row (coach, shipped) | | ✓ | | Review | Compact row |
| Member Detail page (proposed) | ✓ | ✓ | ✓ | Set macros, Open plan | Full page |

### Key Observations

1. The member's biggest shape shift is privacy-driven: peers never see the card at all, coaches see first name + initial only, and only the self view exposes the full identity.

---

## See Also

* [Object Library](../_index.md)
* [Group](group.md) · [Macro Targets](macro-targets.md) · [Meal Plan](meal-plan.md)
