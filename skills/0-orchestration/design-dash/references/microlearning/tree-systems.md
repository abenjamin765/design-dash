# Tree Systems — Designer Cheat-Sheet

> Loaded by `/explain tree-systems` or on demand when object inheritance is discussed.

---

## What a Tree System is

A Tree System is a chain of tightly related objects that link hierarchically from a more general concept (parent) down to more specific instances (children). Objects in a tree are so similar that novice OOUXers often collapse them into one — but collapsing creates duplicate content, messy data models, and authoring pain.

```
PRODUCT TYPE ──parent of──► PRODUCT ──parent of──► USER PRODUCT
(Abstract template)          (Specific item)         (Per-user instance)
```

Parent objects carry **shared attribute values** that children inherit or reference. Children add only the attributes that make individual instances distinct.

---

## When a Tree System is the right call

Use a Tree System when:

- Multiple instances share large blocks of **identical attribute values** (description, image, category)
- Authors would have to **copy-paste** those shared values across every instance manually
- The distinction between a "model" and "an example of that model" is meaningful to users or the business
- A developer would naturally reach for a join table or inheritance pattern in the data model

---

## SIP check for the parent level

Before creating the parent object, run SIP on it:
- **Structure**: Does the parent level have its own attributes (beyond what children would have)?
- **Instances**: Can you name 2+ distinct parent-level examples?
- **Purpose**: Do users (or authors) care about the parent independently of the children?

If the parent fails SIP, it's probably a **category attribute** on the child, not a separate object.

---

## Generic examples

| Level 1 (parent) | Level 2 | Level 3 (child) | What the tree solves |
|---|---|---|---|
| TEMPLATE | — | DOCUMENT | Shared template structure; per-document content separate |
| PRODUCT TYPE | PRODUCT | ORDER LINE ITEM | Shared product definition; per-order quantity and pricing separate |
| PLAN | — | SUBSCRIPTION | Shared plan features and pricing; per-customer billing and dates separate |

---

## Object Map annotation

On the child object's card in the Object Map, add a pointer rather than duplicating the parent's attributes:

```
DOCUMENT
├── Title (own)
├── Content (own)
├── Category ← from TEMPLATE
├── Default Sections ← from TEMPLATE
└── Approval Workflow ← from TEMPLATE
```

---

## Design implications

- The parent object gets its own detail page (the "model page")
- Children link upward to the parent and display inherited attributes without re-authoring them
- MCSFD the parent–child relationship: Mechanics = inherited/linked; Dependency = cascade or orphan based on business rules

---

*See also: `ooux-advanced-modeling` skill (§ 1) · `nom.md` · `mcsfd.md`*
