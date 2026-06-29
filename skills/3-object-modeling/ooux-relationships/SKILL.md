---
id: ooux-relationships
title: OOUX Relationships
stage: 3-object-modeling
version: "0.1.0"
orca_round: supporting
orca_pillar: relationships
orca_step: 0
description: >
  Reference knowledge for understanding, mapping, and specifying how objects relate to
  each other. Use when discussing relationships between objects, MCSFD specs, cardinality,
  nested objects, dependency, or how objects connect. Companion to 02-nom-builder
  and 06-mcsfd-spec-writer.
roles:
  - ux-designer
  - product-manager
  - engineer
tags:
  - relationships
  - nom
  - mcsfd
  - navigation
  - ooux
difficulty: beginner
estimated_duration_minutes: 0
system_prompt_file: SKILL.md
---

# OOUX Relationships

Use this knowledge when helping users understand, map, or specify how objects relate to each other.

## The Ancient Truth of Relationships

> Humans navigate most naturally through relationships between objects.

Users don't navigate through menus and feature lists — they navigate from one object to a related object. Relationships are the highways of your system's navigation.

## The Nested-Object Matrix (NOM)

The NOM is a grid that maps which objects appear inside other objects. Read it as: "When I'm looking at [row object], do I see a list of [column object]?"

|  | User | Project | Task | Document |
|---|---|---|---|---|
| **User** | — | Yes | Yes | Yes |
| **Project** | Yes | — | Yes | Yes |
| **Task** | No | No | — | Yes |
| **Document** | No | No | No | — |

Reading: "When I'm looking at a User, I see a list of Projects, Tasks, and Documents."

### NOM Rules

- Asymmetry is normal: User shows Projects, but Project also shows Users
- If A nests B and B nests C, A does NOT automatically nest C (no transitive nesting)
- Every "Yes" cell implies a list view of that object in the context of the parent
- "No" means users don't see that relationship — even if it exists in the database
- The NOM directly feeds the Nav Flow Designer (step 10)

## The Five Relationship Lenses (MCSFD)

"My Cat Saving Fire Department" — a mnemonic for five lenses to analyze every relationship:

### M — Mechanics
How are the objects connected?
- **Nested**: B appears inside A's detail page
- **Linked**: A references B but B has its own page
- **Embedded**: B's data appears inline within A
- **Aggregated**: A shows a summary of B

### C — Cardinality
How many of each?
- **1:1** — One User has one Profile
- **1:many** — One Project has many Tasks
- **many:many** — Many Users belong to many Projects
- **0-or-1:many** — A Task may or may not have a Document attachment

Always specify from both directions: "A User belongs to many Projects; a Project contains many Users."

### S — Sorts
How are related items ordered?
- Default sort (e.g., Tasks sorted by due date)
- Available sort options (e.g., by priority, by assignee, by creation date)

### F — Filters
How can users narrow the related list?
- Available filters
- Default filter state (e.g., show only active Tasks)

### D — Dependency
What happens to B when A changes or is deleted?
- **Cascade delete**: Deleting a Project deletes its Tasks
- **Orphan**: Deleting a Project leaves Users intact
- **Block**: Cannot delete a Team if it has active Projects
- **Archive**: Deleting a Manager archives their assigned Tasks

## Relationship Anti-Patterns

**Isolated Objects** (the key anti-pattern) — Objects that exist in the system but have no visible connections to other objects. Users hit dead ends or can't discover related information.
- Fix: Check the NOM — every object should nest inside at least one other object, and most objects should have at least one nested object of their own.

Other anti-patterns:
1. **Junk drawer**: An object that nests too many unrelated things. Fix: identify what objects actually belong there.
2. **Hidden relationship**: Two objects are related but the UI doesn't show it. Fix: add the NOM cell.
3. **Forced intermediary**: Users must navigate through C to get from A to B when a direct link would be simpler.
4. **Circular dependency**: A depends on B which depends on A. Fix: identify which dependency is primary.
5. **Missing reverse**: A shows B but B doesn't show A, even though users need both directions.

## Questions to Ask Users

1. "When you're looking at [Object A], do you need to see a list of [Object B]?"
2. "How many [Object B]s can one [Object A] have?"
3. "If we delete [Object A], what should happen to its [Object B]s?"
4. "How would you sort the [Object B]s inside [Object A]?"
5. "Do you ever need to filter [Object B]s by some criteria?"
6. "Can you get from [Object A] to [Object B] in the current UI? How many clicks?"

## Junction Objects

When a many-to-many relationship between two objects carries its own attributes or CTAs, the relationship itself becomes a first-class object — a **Junction Object**.

A Junction Object is warranted when you can answer yes to any of:
- Does the relationship have attributes of its own (date, status, role, note)?
- Does the relationship have CTAs of its own ('Approve', 'Withdraw', 'Transfer')?
- Would the back-end require a many-to-many join table to represent it?

Run SIP on the proposed junction. If it passes, model it as a full object with its own row and column in the NOM.

Common examples:
- MEMBERSHIP (USER ↔ PROJECT): join date, role, permissions
- ASSIGNMENT (USER ↔ TASK): assigned date, due date override, notes
- ENROLLMENT (MEMBER ↔ COURSE): start date, progress, completion status

See `ooux-advanced-modeling` § 2 for the full Junction Object reference.

## Related Skills

- For building the full Nested-Object Matrix (Discovery): use skill `02-nom-builder`
- For writing detailed MCSFD specs (Prioritization): use skill `06-mcsfd-spec-writer`
- For designing navigation with nested objects (Representation): use skill `nav-flow-designer`
- For mapping all objects and relationships visually: use skill `04-object-map-builder`
- For Tree Systems and Junction Objects: use skill `ooux-advanced-modeling`
