# MCSFD — Designer Cheat-Sheet

> Loaded by `/explain mcsfd` or at P4 relationship steps on demand.

---

## What MCSFD is

MCSFD ("My Cat Saving Fire Department") is a mnemonic for the five lenses used to fully specify a relationship between two objects. A ✓ cell in the NOM becomes a complete relationship spec when all five lenses are answered.

---

## The five lenses

### M — Mechanics
*How are the two objects connected?*

| Mechanic | Meaning | When to use |
|---|---|---|
| **Nested** | Object B appears as a list inside Object A's detail page | Most common — the object is browsable from the parent |
| **Linked** | Object A references Object B but B has its own separate page | When B is shared or high-level (e.g., a CATEGORY linked from many objects) |
| **Embedded** | Object B's data appears inline within Object A | When B's full content belongs in the parent's context |
| **Aggregated** | Object A shows a summary or count of Object B | When users need the total, not individual instances |

### C — Cardinality
*How many of each?*

State cardinality from **both directions**:
- "One PROJECT has many TASKs; one TASK belongs to one PROJECT" (1:many)
- "One TEAM has many MEMBERs; one MEMBER belongs to many TEAMs" (many:many)

Common types: 1:1, 1:many, many:many, 0-or-1:many.

### S — Sorts
*How are related items ordered by default? What sort options exist?*

- Default sort (e.g., Tasks sorted by due date, ascending)
- Available sort options (by priority, by assignee, by status)

### F — Filters
*How can users narrow the related list?*

- Available filter dimensions
- Default filter state (e.g., show only Active tasks)
- Filters always visible vs. hidden in "More Filters"

### D — Dependency
*What happens to Object B when Object A is deleted or changed?*

| Type | What it means |
|---|---|
| **Cascade delete** | Deleting A deletes all its Bs |
| **Orphan** | Deleting A leaves Bs intact (they exist independently) |
| **Block** | Cannot delete A if it has Bs |
| **Archive** | Deleting A archives its Bs |
| **Reassign** | Deleting A prompts reassignment of Bs to another A |

---

## MCSFD spec table format

```
| Lens | Spec |
|---|---|
| Mechanics | Nested: Project shows a paginated list of Tasks |
| Cardinality | 1 Project → many Tasks; 1 Task → 1 Project |
| Sorts | Default: Due Date ascending. Options: Priority, Assignee, Status |
| Filters | Status (multi-select), Assignee (multi-select). Default: Active only |
| Dependency | Archiving a Project archives its Tasks |
```

---

## When to use MCSFD

- After the NOM is complete (P4.2 in the Design Dash)
- When a relationship is contested or ambiguous
- When a developer asks "what happens when we delete X?"
- When designing sort/filter controls for a collection

Full guidance: `06-mcsfd-spec-writer` skill.

---

*See also: `nom.md` · `hub-object.md` · `page-collection-instance.md` · `ooux-relationships` skill*
