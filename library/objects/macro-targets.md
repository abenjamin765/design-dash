**TL;DR:** **Macro Targets** are the coach-set daily nutrition goals (protein / carbs / fat / calories) a [Member](member.md) plans against. They are the yardstick for every [Meal Plan](meal-plan.md) and the reference the [Coach](coach.md) uses when approving.

---

## Definition

A **Macro Targets** object is one versioned set of daily macro goals assigned by a coach to a single member, effective from a start date until replaced.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Four numeric goals + effective dates — detail/editable panel natural |
| **Instances** | ✅ | "Maria: 150P/180C/55F/1,900 kcal", "Devon: 200P/300C/70F/2,700 kcal" |
| **Purpose** | ✅ | Members plan against them; coaches approve against them |

**Verdict:** Core system object; domain-specific to coached nutrition.

---

## Synonyms / Also Known As

| Term | Context | Notes |
| --- | --- | --- |
| "My macros" | Member language | UI should say "My macros" (mental-model row 1) |

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Protein (g)** | Number | Yes | Coach manual | Daily goal |
| 2 | **Carbs (g)** | Number | Yes | Coach manual | Daily goal |
| 3 | **Fat (g)** | Number | Yes | Coach manual | Daily goal |
| 4 | **Calories** | Number | Computed | Computed | Derived from macros; editable override allowed |
| 5 | **Effective From** | Date | Yes | System | Version start |
| 6 | **Set By** | Reference → Coach | Yes | System | Audit |
| 7 | **Note** | String | No | Coach manual | e.g., "high-carb training days" |

Meta: editable only by the owning coach (locked at intake: "coach sets targets"). Members see current + history read-only.

---

## Top Attributes

| Rank | Attribute | Rationale |
| --- | --- | --- |
| 1 | **Protein / Carbs / Fat / Calories** | The four-stat figures members plan against |
| 2 | **Effective From** | Versions the target set; anchors history |

> Provisional ranking — validate at the next usability test.

---

## Nested Objects

None — leaf object.

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Set / update targets** | Coach | Write | No | Creates new version, never edits history |
| 2 | **View targets & history** | Member (self), Coach | Read | No | Members see change timeline |

---

## Relationship Specs (MCSFD)

### Macro Targets – Meal Plan

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Plan snapshots the active target set at creation |
| **C - Cardinality** | One active target set : many plans |
| **S - Sorts** | History reverse-chronological |
| **F - Filters** | — |
| **D - Dependencies** | Mid-week target changes do not retroactively alter existing plans; next plan picks up new targets |

---

## Business Rules

1. **Versioned**: updates create a new version; prior versions immutable for audit.
2. **Snapshot on plan creation**: each plan records which target version it was planned against.
3. **Calories derived unless overridden**: if overridden, show "custom calories" badge.

---

## Status / Lifecycle

```
Draft -> Active -> Superseded
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Active** | Current goals member plans against | Coach sets/saves |
| **Superseded** | Historical version | Newer version saved |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | P/C/F/kcal figures, effective date |
| **Visual Signature** | Four-stat strip |
| **Contextual CTAs** | Coach: "Edit"; Member: "View history" |
| **Nested Object Indicators** | — |

---

## Shapeshifter Matrix

| Context / View | P/C/F/kcal figures | Effective From | CTAs | Card Shape |
| --- | --- | --- | --- | --- |
| My Macros — current + history (member, shipped) | ✓ | ✓ | View history | Full page |
| Plan editor pinned targets (member, shipped) | ✓ | | (none) | Pinned banner strip |
| Review detail target snapshot (coach, shipped) | ✓ | ✓ | Approve / Request changes | Side-by-side panel |
| Set macros editor (coach, shipped) | ✓ | ✓ | Save new version | Form page |
| Member Detail macro-targets block (proposed) | ✓ | ✓ | Edit | Panel card |

### Key Observations

1. The four figures are the invariant core; everything else (history, editability, version date) appears only in coach-facing or self-service contexts.

---

## See Also

* [Object Library](../_index.md)
* [Member](member.md) · [Meal Plan](meal-plan.md)
