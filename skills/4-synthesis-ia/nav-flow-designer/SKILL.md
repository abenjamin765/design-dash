---
name: nav-flow-designer
description: "Design navigation blueprints from OOUX artifacts — NOM, Object Cards, and MCSFD Specs. Maps which pages exist, how users move between them, and catches the Isolated Objects anti-pattern (dead ends with no forward navigation). Use at ORCA Step 10 (Representation Round), or from the design-dash orchestrator at P4 IA phase as an optional sub-skill when full nav-flow design is needed."
version: "0.1.0"
stage: "4-synthesis-ia"
---

# Nav Flow Designer — ORCA Step 10 (Representation Round)

You are guiding a user through designing a **Navigation Flow** — the blueprint for how users move between objects in the system. This step takes Object Cards (ORCA Step 9) and "pops them into" a navigation flow using NOM relationships, producing landing pages, list pages, and detail pages.

**Ancient Truth**: Humans navigate most naturally through relationships between objects. The Nav Flow makes relationships visible and navigable — every nested object is a path forward, every relationship is a link.

**Anti-pattern this step fights**: **Isolated Objects** — objects with no visible connections to others, creating dead ends.

**Inputs required**: Object Cards (Step 9), NOM (Step 2), MCSFD Specs (Step 6).

**Design Dash integration**: when invoked from the orchestrator at P4, read `dashes/{slug}/flow.md` as the primary page list source (derived from scenario-flow-mapping). Do not re-derive pages from scratch — extend the existing page list with nav-flow structure.

---

## Object Library context

Read local object guides before starting:
- `library/objects/_index.md` — registry with all objects and file paths
- `library/objects/{slug}.md` — object guides for the domain

Check `last_synced` to assess freshness. If local guides are missing or stale, ask the designer to supply the relevant object details before proceeding.

---

## Key concepts

### Three page types

1. **Landing Page**: shows cards of **various** object types. Entry point for a role. Example: Manager Dashboard showing Project cards, Task cards, and Team member cards.
2. **List Page**: shows cards of the **same** object type. Sortable and filterable. Example: "My Projects" showing all Project cards.
3. **Detail Page**: full view of one object instance. Shows all attributes, nested object lists, and CTAs. Example: "Project: Q3 Launch" showing tasks, milestones, and team members.

### Navigation tiers

- **Primary navigation** (always visible): 3–5 hub objects in the main nav bar.
- **Secondary navigation** (one click away): objects reachable from primary detail pages.
- **Deep navigation** (drill paths): objects reached via 2+ levels of nesting.

### Dead-end detection (Isolated Objects check)

Every "Yes" cell in the NOM should produce a visible card list on the parent's detail page. A dead end is when a user reaches an object's page with no obvious path forward or back. Check:
- Can they get back? (breadcrumbs, back button)
- Can they navigate to related objects? (nested card lists)
- Can they take meaningful actions? (CTAs from Step 7)

---

## Collaboration flow

### Checkpoint 1 — Entry Points (WAIT FOR USER)
> Where do users enter the system? Let's go role by role.

For each role from intake:
- After logging in, what do they see first?
- What's the first object they interact with?
- Is there a dashboard (landing page) or a list page?

### Checkpoint 2 — Object Priority (WAIT FOR USER)
Present objects with NOM analysis. Hub objects = many nested objects; leaf objects = few.

| Object | Nested objects (NOM) | Suggested tier | Your pick |
|---|---|---|---|
| {Object} | {count} nested | {Primary/Secondary/Deep} | ? |

"Which objects should be in the primary nav? (Recommend max 5)"

### Checkpoint 3 — Page Design (WAIT FOR USER — per primary object)
For each primary and secondary object:
> Let's design the **{OBJECT}** detail page. The NOM says it nests: [list].
- Which nested objects get their own card-list section?
- What order should the sections appear?
- Any nested objects shown as embedded data rather than a card list?

### Checkpoint 4 — Navigation Paths (WAIT FOR USER)
From **{OBJECT}**'s detail page:
- Which card lists link to detail pages?
- Can users get back to the list view?
- Can users jump to a related object that isn't nested here?

### Checkpoint 5 — Dead Ends and Isolated Objects (WAIT FOR USER)
Report: dead ends · islands (unreachable from primary nav) · long drill paths (3+ clicks) · NOM connections without visible card lists. "How should we resolve these?"

### Checkpoint 6 — Flow Review (WAIT FOR USER)
Present the complete Nav Flow diagram.

### Checkpoint 7 — Hand-off (WAIT FOR USER)
In a Design Dash context: append the Nav Flow to `dashes/{slug}/flow.md` as a new "Nav Flow" section, and update the spec §5 IA section. In standalone ORCA context: save the nav flow to the location the designer specifies.

---

## Output format

### Navigation Flow Diagram

```
[Login] --> [Dashboard (Landing Page)]
              |
              |-- [PROJECT List] --> [PROJECT Detail]
              |                        |-- [TASK Cards] --> [TASK Detail]
              |                        |-- [MILESTONE Cards] --> [MILESTONE Detail]
              |
              |-- [USER List] --> [USER Detail]
              |                        |-- [ACTIVITY Cards] --> [ACTIVITY Detail]
              |
              +-- [TEAM Detail]
                     |-- [PROJECT Cards] --> [PROJECT List]
                     +-- [MEMBER Cards] --> [MEMBER Detail]
```

### Page Type Assignments

| Object | List page? | Detail page? | Appears on landing pages? |
|---|---|---|---|
| {Object} | Yes/No | Yes/No | {role} Dashboard / No |

### Navigation Tier Summary

| Tier | Objects | How accessed |
|---|---|---|
| Primary nav | | Always visible in nav bar |
| Secondary | | Nested on primary object pages |
| Deep | | Drill through 2+ levels |

### Entry Points by Role

| Role | Entry page | Type | First objects visible |
|---|---|---|---|
| {Role} | {Page} | Landing / List / Detail | {Objects} |

### Isolated Objects Check

| Object | Reachable? | Dead end? | Fix |
|---|---|---|---|
| {Object} | Yes/No | Yes/No | {fix or N/A} |

---

## Standalone ORCA use

When not in a Design Dash context, read the NOM and Object Cards from local `library/objects/` guides before starting Checkpoint 1. After completing Checkpoint 7, instruct the designer: "Next in the Representation Round: use the **CTA Placement Designer** (Step 11) to position CTAs on cards and detail pages."
