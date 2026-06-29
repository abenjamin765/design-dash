<!-- TEMPLATE: Object Guide (Object Library)
     Page title: "Object Guide: {Object Name}"
     Parent: library/objects/
     
     This is the comprehensive, finalized reference for an object.
     It should contain EVERYTHING someone needs to know.
     Do NOT include an H1 header — the file name is the title.
-->

**TL;DR:** {One-to-two sentence summary of the object's role and key relationships. Include cross-links to related Object Guides.}

---

## Definition

A **{Object Name}** is {one-sentence plain-language definition that distinguishes this object from all others}.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | {List key attributes. "Could you design a detail page?"} |
| **Instances** | ✅ | {Name 2-3 specific examples} |
| **Purpose** | ✅ | {Why users seek this out, what they do with it} |

**Verdict:** {One-sentence classification — e.g., "Core system object" or "Domain-specific object introduced for {project}"}

---

## Synonyms / Also Known As

| Term | Context | Notes |
| --- | --- | --- |
| {Synonym} | {Where this term is used} | {Clarification} |

<!-- Omit this section if no synonyms exist -->

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **{Name}** | {String, Number, Enum, Date, Reference, Boolean, Image} | {Yes/No} | {System, Manual, API, Computed, etc.} | {What it is and why it matters} |

<!-- Force-rank attributes by importance to the user.
     Include meta-attribute detail inline: editable by, visible to, validation rules, display format.
     Use Reference -> {Object} for foreign key references. -->

---

## Nested Objects

| Nested Object | Relationship | How It Gets There |
| --- | --- | --- |
| [**{Object}**](link) | {One-to-many, Many-to-many, etc.} | {System-generated, user-created, API sync, etc.} |

<!-- List objects that appear on this object's detail page.
     Link to their Object Guides. -->

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **{Verb + context}** | {e.g. admin, member, viewer} | {Read, Write, Admin, System} | {No, or Yes -> {Object}} | {Constraints, conditions} |

<!-- Force-rank CTAs by frequency/importance.
     Every CTA must be tied to this object. -->

---

## Relationship Specs (MCSFD)

### {Object Name} - [{Related Object}](link)

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | {How the relationship is created/maintained} |
| **C - Cardinality** | {One-to-many, many-to-many, typical counts} |
| **S - Sorts** | {Default and available sort orders} |
| **F - Filters** | {Available filter dimensions} |
| **D - Dependencies** | {What happens when one side is deleted/deactivated} |

<!-- Repeat for each significant relationship. -->

---

## User Stories

### {Story Title}

> As a [**{Role}**],
> I want to **{CTA}** a **{Object}**
> so that {outcome - what it enables}.
>
> When I {trigger},
> I should see {expected result}.

<!-- Include one story per major CTA. -->

---

## Business Rules

1. **{Rule name}**: {Description of the constraint, validation, or behavior}

<!-- Number each rule. Cover: uniqueness, creation requirements, lifecycle constraints,
     data privacy, cascading effects, edge cases. -->

---

## Status / Lifecycle

```
{ASCII state diagram -- e.g., Created -> Active -> Inactive}
```

| Status | Description | Triggers |
| --- | --- | --- |
| **{Status}** | {What this state means} | {What causes entry into this state} |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | {Which attributes appear on the card} |
| **Visual Signature** | {Avatar, icon, color coding, layout} |
| **Contextual CTAs** | {Which actions appear on the card, and when} |
| **Nested Object Indicators** | {Counts, badges, summaries of nested objects} |

---

## Shapeshifter Matrix

| Context / View | {Attr 1} | {Attr 2} | {Attr 3} | ... | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- | --- |
| {Context name} | ✓ | ✓ | | | {Available CTAs} | {Compact row, Card, Full page, etc.} |

<!-- One row per context where this object appears.
     ✓ = attribute is shown, blank = hidden. -->

---

## See Also

* [Object Library](../) - All objects at a glance
* [Glossary](../../templates/glossary.md) - OOUX terminology
* {Links to related Object Guides}
* {Links to project artifacts that reference this object}
