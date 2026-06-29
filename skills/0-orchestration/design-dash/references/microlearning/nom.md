# Nested-Object Matrix (NOM) — Designer Cheat-Sheet

> Loaded by `/explain nom` or at P4.2 first surface.

---

## What the NOM is

The NOM is a square grid that maps which objects appear inside other objects. Read it as:

> "When I'm looking at **[row object]**'s detail page, do I see a list of **[column object]**s?"

A mark at row A, column B means: "Object B appears on Object A's detail page."

---

## Example NOM (generic project management domain)

|  | TASK | MEMBER | MILESTONE | ATTACHMENT | COMMENT |
|---|---|---|---|---|---|
| **PROJECT** | ✓ | ✓ | ✓ | ✓ | |
| **TASK** | | ✓ | | ✓ | ✓ |
| **MILESTONE** | ✓ | | — | | |
| **MEMBER** | ✓ | — | | | |
| **COMMENT** | | | | | — |

Reading row 1: "On the PROJECT detail page, I see lists of Tasks, Members, Milestones, and Attachments."

---

## Critical rules

- **Asymmetry is normal**: Project shows Tasks, but Task also shows its assigned Member — evaluate each direction independently
- **No transitive nesting**: If A nests B and B nests C, A does NOT automatically nest C
- **Every ✓ implies a list view**: A collection of that object type in that context (see `page-collection-instance.md`)
- **The NOM is user-facing**: "No" means users don't see that relationship — even if it exists in the database

---

## Pattern analysis

After filling in the NOM, count marks:

| Pattern | Signal |
|---|---|
| Many marks in a row | **Hub object** — rich detail page, primary nav anchor |
| Many marks in a column | **Popular nested object** — appears in many contexts |
| Few marks in a row | **Leaf object** — simple detail page |
| Few marks anywhere | **Isolated object** (anti-pattern) — needs connections or reclassification |

---

## How the NOM feeds design

- **Nav flow** — every ✓ in the NOM becomes a collection on the parent's detail page, which becomes a navigation path
- **MCSFD** — each ✓ gets specified with Mechanics, Cardinality, Sorts, Filters, Dependency
- **Junction Objects** — if a relationship carries its own attributes, that ✓ cell may need to become its own object row/column

---

*See also: `hub-object.md` · `mcsfd.md` · `page-collection-instance.md`*
