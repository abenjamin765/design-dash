---
id: ooux-advanced-modeling
title: OOUX Advanced Modeling
stage: 3-object-modeling
version: "0.1.0"
orca_round: supporting
orca_pillar: meta
orca_step: 0
description: >
  Reference knowledge for advanced OOUX structural modeling concepts: Tree Systems,
  Junction Objects, the QUESTIONS object and million-dollar questions deliverable,
  Phase + Ranking metadata, and the core-content vs. metadata attribute distinction.
  Use when a system has inheritance hierarchies, relationship-objects, open unknowns,
  or when the Object Map needs a second structural pass before prioritization.
roles:
  - ux-designer
  - product-manager
  - engineer
tags:
  - tree-systems
  - junction-objects
  - questions-object
  - phase-ranking
  - core-content
  - metadata
  - ooux
difficulty: intermediate
estimated_duration_minutes: 0
system_prompt_file: SKILL.md
---

# OOUX Advanced Modeling

Use this knowledge when standard Object Discovery or Object Mapping reveals structural complexity the basic toolkit doesn't cleanly handle: objects that share a parent template, relationships that carry their own attributes, open unknowns that risk blocking decisions, or a need to phase-gate the system before Representation begins.

Source: *X-Ray UX: From Chaos to Clarity with the ORCA Process* by Sophia V. Prater (2025), Chapters 5, 8, 9, 11–12.

---

## 1. Tree Systems

### What they are

A Tree System is a chain of tightly related objects that link hierarchically from a more general concept down to more specific instances. Objects in a tree look so similar that novice OOUXers often collapse them into one — but collapsing creates duplicate content, messy data models, and authoring pain.

```
TEMPLATE ──defines──► INSTANCE ──produces──► RECORD
(shared model/spec)   (specific item)        (per-user occurrence)
```

The parent object carries shared attribute values that the children inherit (pull-down). Children add the attributes that distinguish individual instances.

### When to use a Tree System

Reach for a Tree System when you notice:

- Multiple instances of an object share large blocks of identical attribute values (Description, Image, Category, Price)
- Content authors would have to copy-paste those shared values across every instance manually
- The distinction between a "model" and an "example of that model" is meaningful to both users and the business

**Common examples across domains:**

- **Product catalog**: PRODUCT TYPE (shared spec) → PRODUCT SKU (specific variant) → ORDER LINE ITEM (per-purchase record)
- **Content library**: CONTENT TEMPLATE → CONTENT ITEM → USER CONTENT RECORD (tracking completion or progress)
- **Org hierarchy**: ROLE → POSITION → EMPLOYEE RECORD
- **Taxonomy**: CATEGORY → SUBCATEGORY → ITEM
- **Training**: COURSE TEMPLATE → COURSE OFFERING → ENROLLMENT

### SIP check for Tree System validity

Run SIP on the proposed parent level. If the parent passes SIP on its own, it's a real object — not just a glorified attribute. If it fails SIP (no instances, no purpose users care about), it's probably just a category attribute on the child.

### Design implications

- Parent object has its own detail page; children link up to it and inherit its display attributes
- MCSFD the relationship: Mechanics = inherited/linked; Cardinality = 1 TYPE to many INSTANCES
- Flag the tree in the NOM so nav-flow can surface navigation between levels
- Add a pointer in the Object Map card: "References: TEMPLATE (parent)"

---

## 2. Junction Objects

### What they are

A Junction Object is an object that emerges when a many-to-many relationship between two objects carries its own attributes or CTAs. The relationship itself becomes a full object.

Standard relationship (no junction needed):
```
USER ←──member of──► PROJECT
```

When membership carries its own data (join date, role, permissions, status), that data has nowhere to live without a junction:
```
USER ←──► MEMBERSHIP ◄──► PROJECT
           (join date, role,
            permissions, status)
```

### When to use a Junction Object

A junction is warranted when the relationship between A and B:
1. Has attributes of its own (date, status, role, score, note)
2. Has CTAs of its own ('Revoke', 'Approve', 'Transfer')
3. Would require a many-to-many join table in the data model anyway

Run SIP on the proposed junction. "A MEMBERSHIP has its own attributes (join date, role, status), instances ('Alice's membership in Project X'), and purpose (users need to view, edit, and revoke individual memberships)." — that's an object.

### Common examples

| Object A | Object B | Junction Object | Junction attributes |
|---|---|---|---|
| USER | PROJECT | MEMBERSHIP | Join date, role, status |
| USER | TASK | ASSIGNMENT | Assigned date, due date override, notes |
| MEMBER | COURSE | ENROLLMENT | Start date, progress, completion status |
| DOCUMENT | WORKFLOW | REVIEW | Reviewer, submitted date, decision, comments |
| PRODUCT | ORDER | ORDER LINE ITEM | Quantity, unit price, discount |

### NOM and MCSFD notes

- Junction Objects appear as both a row and a column in the NOM
- MCSFD the two relationships: USER ↔ MEMBERSHIP (1:many) and MEMBERSHIP ↔ PROJECT (many:1)
- Junction Objects are often leaf objects (simple detail pages, no major nested objects of their own)

---

## 3. The QUESTIONS Object and Million-Dollar Questions

### The million-dollar questions deliverable

One of ORCA's most valuable outputs is not an artifact — it's a list of open unknowns that surface during the process. These are *million-dollar questions*: the showstoppers that complexity was hiding. They emerge when:

- Two stakeholders define an object differently ("Is TASK the template the manager creates, or the assigned instance the member completes?")
- An attribute's source is unclear ("Who populates the Description? Is it the content team or an automated feed?")
- A relationship direction is contested ("Does a DOCUMENT belong to a PROJECT, or does a PROJECT belong to a DOCUMENT?")
- A business rule is assumed but undocumented ("Can a USER be assigned to two TASKS that have conflicting deadlines?")

Capture every one. These questions, surfaced before wireframes, save weeks of late-stage rework.

### QUESTIONS as a back-end object

QUESTIONS itself passes SIP:
- **Structure**: question text, owner, date opened, status (open / in-progress / resolved), answer, ORCA element it blocks
- **Instances**: "Can a User belong to multiple Organizations?", "Who can delete a Result?", "What triggers automatic Archival?"
- **Purpose**: Teams need to find, assign, answer, and close open questions; the question queue is a delivery risk register

Model QUESTIONS as a back-end object in your documentation system. Tag each QUESTION to the ORCA element it blocks (an object, a nestie, a CTA, an attribute). The ORCA element becomes a nestie of QUESTION (or vice versa, depending on which direction your team queries more often).

### How to use it in practice

At every ORCA checkpoint, before advancing to the next step, surface the open QUESTIONS list:

1. **During Object Discovery** — log questions about object definitions, synonyms, and scope
2. **During NOM Building** — log questions about relationship direction and cardinality
3. **During Object Guide** — log questions about attribute sources, validation rules, and edge cases
4. **Before Prioritization** — review the queue; questions that remain open after prioritization become tracked assumptions

Open QUESTIONS should be captured in `assumptions.md` (see `evidence-and-assumptions` skill). A QUESTION that gets an answer becomes a resolved assumption; one that stays open after the gate deadline becomes a tracked risk.

### Connection to evidence-and-assumptions

The `evidence-and-assumptions` skill governs `assumptions.md` throughout a Design Dash. Every QUESTION that surfaces an assumption should be logged there with classification: **observed** (evidence in hand), **borrowed** (inferred from analogous context), or **assumed** (pure hypothesis). Open QUESTIONS with no evidence are `assumed` — the highest-risk class.

---

## 4. Phase + Ranking Metadata

### What it is

Phase + Ranking metadata is a tagging convention applied to every ORCA element — objects, nesties (nested objects), CTAs, and attributes — to track which phase of delivery they belong to and their relative importance within that phase.

| Metadata field | Values | Purpose |
|---|---|---|
| **Phase** | 1, 2, 3, … (or MVP / Future / Research) | Delivery planning |
| **Rank** | Integer or priority tier | Within-phase ordering |
| **Status** | Scoped / Deferred / Cut / Research | Disposition of the element |

### The domino / ripple effect

The power of phase-tagging is the ripple. When an **object** is deprioritized:
- All of its **nesties** are automatically deferred
- All of its **CTAs** are automatically deferred
- All of its **attributes** are automatically deferred

One cut propagates through the entire ORCA stack. This makes scope decisions concrete and fast — stakeholders can see the exact surface area they're trading when they defer an object.

Conversely, when an object is promoted to Phase 1, all elements tagged to it surface as candidates; the team still makes explicit choices, but the candidate set is clear.

### Cutting heuristics (from the book)

Apply these questions when deciding whether to cut, defer, or keep an element:

**Objects:**
- Will cutting this object break the core user experience? (If yes, do not cut)
- Is there a compelling business reason to include this object in Phase 1? (If no, defer)
- Does any other Phase 1 object depend on this one? (Check the Dependency column in MCSFD)

**Nesties (nested objects):**
- Is this nestie required to complete the Primary CTA of the parent object? (If yes, keep)
- Can the user accomplish their main goal on the parent without seeing this nestie? (If yes, consider deferring)

**CTAs:**
- Is this action critical to the Phase 1 user journey? (P-ranked CTAs almost always survive)
- Would removing this CTA create a Broken Object? (If yes, do not cut)

**Attributes:**
- Will cutting this attribute make it impossible to identify or differentiate instances? (If yes, keep)
- Where do the values come from — is that source available in Phase 1? (If not, defer the attribute)
- Who populates the values? Does that role exist in Phase 1? (Authoring dependencies matter)

### Phase metadata in the Object Guide

Add Phase and Rank columns to every table in the Object Guide and CTA Matrix:

```
| Attribute         | Phase | Rank | Notes             |
|-------------------|-------|------|-------------------|
| Name              | 1     | 1    | Required for MVP  |
| Status            | 1     | 2    |                   |
| Description       | 2     | 1    | Needs content ops |
| Analytics         | Res   | —    | Research first    |
```

### Phase-ranking connections

The `05-object-guide-builder` skill captures business rules and constraints; Phase + Rank metadata extends that table. The `07-cta-prioritization` skill captures P/S/T/Q — add Phase as a column alongside the tier. The `evidence-and-assumptions` skill tracks the assumptions underlying each phase decision.

---

## 5. Core Content vs. Metadata

### The distinction

Every attribute on an object belongs to one of two categories:

| Category | Definition | Workshop convention |
|---|---|---|
| **Core content** | The substance of the object — what it IS. Values that define the instance. | Yellow sticky |
| **Metadata** | Data about the data — classification, sorting, filtering, grouping. Values that describe how the object is organized or managed. | Pink sticky |

Examples for a DOCUMENT object:

| Attribute | Category | Why |
|---|---|---|
| Title | Core content | Names the instance |
| Body / Summary | Core content | Describes what it is |
| Version | Core content | Defines its iteration |
| Category | Metadata | Used to filter and categorize |
| Tags | Metadata | Used to filter and group |
| Created Date | Metadata | Used to sort |
| Author | Metadata | Administrative tracking |

### Why it matters

The distinction drives layout and interaction decisions:
- **Core content** appears prominently in the object card and at the top of the detail page — it answers "What is this?"
- **Metadata** drives filter panels, sort controls, and search indexing — it answers "Which ones?"

When an Object Map sticky note mixes core content and metadata without distinction, the card design tends to surface the wrong things (useful-for-filtering metadata appearing where identity-defining core content should be). The separation also informs who authors what: editorial teams own core content; taxonomy or operations teams often manage metadata.

### In the Object Map

During Attribute Discovery (step 4), mark each attribute as core content (C) or metadata (M) alongside the attribute name. During Attribute Prioritization (step 8), force-rank core content and metadata separately — the top-ranked core content attributes are the card face; the top-ranked metadata attributes become the filter/sort controls.

---

## Related Skills

- Core procedural use: `04-object-map-builder` (Tree Systems, core-content/metadata tagging)
- Core procedural use: `08-attribute-prioritization` (Tree Systems for content de-dup, cutting heuristics, core vs. metadata ranking)
- Core procedural use: `02-nom-builder` and `ooux-relationships` (Junction Objects)
- Core procedural use: `01-object-discovery` and `05-object-guide-builder` (QUESTIONS object, Phase/Ranking metadata)
- Log open QUESTIONS: `evidence-and-assumptions` (`assumptions.md` register)
- Phase decisions become gate inputs: `design-dash` P0 tier classification and P3 Framing lock
