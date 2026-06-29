# Page / Collection / Instance — Designer Cheat-Sheet

> Loaded by `/explain page-collection-instance` or at P7 Wireframe first surface.

---

## The three layers

Every screen in an OOUX-aligned product is composed of up to three stacked layers.
A single page usually contains all three; knowing which layer you're in determines what content belongs there and how actions should behave.

| Layer | What it is | Central question |
|---|---|---|
| **Page** | The hub object itself — its identity, top-level attributes, and its primary CTA | *What is this thing?* |
| **Collection** | A list, grid, or table of related objects (or instances) attached to the hub | *What does this thing have or contain?* |
| **Instance** | One item within a collection — its own attributes and object-scoped actions | *What can I do with this one item?* |

---

## Definitions

### Page layer
The page layer holds everything that belongs to the **hub object as a whole**:
- Object name / title
- Identity attributes (the handful of properties that define *what* this object is)
- Page-level CTAs (the object's Primary and Secondary actions — e.g. "Edit Project", "Archive Project")
- Navigation context (breadcrumbs, back-link)

Think of the page layer as the "header section" of an object detail page.

### Collection layer
The collection layer holds **a set of related objects or instances** that are contained by or related to the hub:
- A list of tasks inside a project page
- A roster of members attached to a team
- A history of versions of a document

Each collection has its own:
- Title (names the related object type)
- Sort / filter controls
- Collection-level CTAs (e.g. "Add Task", "Invite Member")
- Empty / loading / at-scale edge states

### Instance layer
The instance layer is **one row or card within a collection**. It shows:
- The minimum attributes needed to identify and act on that item (not every attribute — prioritized display)
- Instance-level CTAs (actions scoped to that one item: "Open", "Remove", "Mark Complete")

---

## When to use each type

| Situation | Layer to reach for |
|---|---|
| Describing the hub object itself | Page |
| Showing everything of type X that belongs to the hub | Collection |
| Acting on one item inside a collection | Instance |
| Object with no children/related objects | Page only (no Collection needed) |
| Dashboard / index of many objects | Page (the dashboard) + Collections (one per object type) |

---

## Common misclassifications

| Mistake | Why it's wrong | Fix |
|---|---|---|
| Putting instance-level detail on the page layer | Clutters the hub identity with content that belongs to one item | Move it into a collection row or a dedicated instance detail page |
| Creating a "collection" that is really a single related object | A single linked object is a relationship attribute, not a collection | Use a linked attribute display instead of a list |
| Treating a filter UI as an instance action | Filters operate on the collection, not on one item | Place filters in the collection layer header |
| Duplicating the page's Primary CTA on every instance row | P/S/T/Q ranks are layer-specific — an instance Primary ≠ the page Primary | Define P/S/T/Q per layer independently |
| Using a Collection for a relationship that produces ≤ 3 items always | Small, bounded relationships read better as attributes | Use inline attribute display |

---

## Quick decision rule

```
Is this content about the hub object as a whole?
  └─ Yes → Page layer
  └─ No → Is it a set of related items?
            └─ Yes → Collection layer
            └─ No → Is it one item within that set?
                      └─ Yes → Instance layer
```

---

## In wireframe annotations

Use the `layer` comment on every section:

```html
<!-- layer: page | object: project | hint: page-header -->
<!-- layer: collection | object: task | hint: data-table -->
<!-- layer: instance | object: task | hint: table-row -->
```

---

*See also: `pstq-ranking.md` (action priority per layer) · `nom.md` (NOM objects and relationships)*
