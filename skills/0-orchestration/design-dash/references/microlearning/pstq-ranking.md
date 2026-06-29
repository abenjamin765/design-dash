# PSTQ Ranking — Designer Cheat-Sheet

> Loaded by `/explain pstq-ranking` or at P7 Critique first surface.

---

## What PSTQ is

PSTQ is a **force-ranking system** for every CTA (call-to-action) on an object. Each action must land in exactly one tier. The tier directly governs UI placement and visual weight — it is not a suggestion.

| Tier | Name | UI treatment | Rule |
|---|---|---|---|
| **P** | Primary | Filled / high-emphasis button · Always visible | Exactly **one** per object per layer |
| **S** | Secondary | Outlined / medium-emphasis button · Always visible | As few as needed — typically 1–3 |
| **T** | Tertiary | Text link or ghost button · Visible but quiet | Occasional actions; avoid overcrowding |
| **Q** | Quaternary | Overflow menu (⋯) or settings panel | Rare, admin-only, or destructive actions |

---

## Scoring each dimension

PSTQ is not a score you add up — it is a **forced ranking**. The four tiers represent a strict priority order. Use the questions below to force-rank correctly.

### Step 1 — Identify the Primary (P)

Ask: *If a user could only tap one button on this object, which would it be?*

- Usually the action that represents the object's core purpose (e.g., "Submit" on a FORM object, "Purchase" on an ORDER object)
- Role-specific: an admin's Primary on USER may be "Edit"; the user's own Primary may be "View Profile"
- If you feel two actions are equally Primary, you haven't decided yet — force the choice

### Step 2 — Identify Secondaries (S)

Ask: *What actions do users perform regularly but less often than the Primary?*

- These are predictable, recurring actions a user expects to find without hunting
- Cap at 2–3; more than 3 signals that your Primary might not be identified correctly

### Step 3 — Identify Tertiaries (T)

Ask: *What actions are valid but infrequent — once a session or less?*

- "Rename", "Duplicate", "Export as PDF" — useful, but not the main event
- Surface as text links, icon buttons, or secondary toolbar items

### Step 4 — Identify Quaternaries (Q)

Ask: *What actions are rare, dangerous, or administrative?*

- "Archive", "Delete", "Reset", role-based admin functions
- Bury in overflow (⋯) menus, settings drawers, or confirmation dialogs
- Destructive actions must always be Q (never S or T)

---

## Scoring scale (1–3 for documentation)

When ranking for written artifacts (CTA Matrix, spec), use numeric confidence:

| Score | Meaning |
|---|---|
| **3 — Confident** | Strong evidence (research, analytics, observed behavior) supports this rank |
| **2 — Assumed** | No direct evidence; reasoned from product context and domain knowledge |
| **1 — Uncertain** | Contested or unknown; flag for usability testing |

A score of 1 on a P-ranked CTA is a red flag — plan a test or log as an assumption.

---

## Worked example — generic SaaS objects

Context: a **PROJECT** detail page, project manager role.

| CTA | Tier | Score | Rationale |
|---|---|---|---|
| Add Task | **P** | 3 | Core workflow; most-visited action in project context |
| View Members | **S** | 2 | Regularly needed; second most common navigation from project page |
| Edit Project Settings | **T** | 2 | Changed once at setup; infrequent after creation |
| Archive Project | **Q** | 3 | End-of-lifecycle only; destructive; must not be accidentally triggered |

Now the **TASK instance** inside that project:

| CTA | Tier | Score | Rationale |
|---|---|---|---|
| Mark Complete | **P** | 2 | Most likely reason to tap a task row |
| Remove from Project | **Q** | 3 | Rare, consequential — overflow only |

Note: each **layer** (page vs instance) has its own independent P — they do not conflict.

---

## Rules and guardrails

- **One Primary per object per layer.** No exceptions. If two actions share a layer, one is Secondary.
- **Destructive actions are always Q.** Never surface "Delete" or "Reset" as P or S.
- **Rank is role-aware.** Admin Primary ≠ End-user Primary — document both if roles differ.
- **P-ranked CTA with score 1** → log as an assumption in `dashes/{slug}/assumptions.md`; schedule a test.

---

*See also: `page-collection-instance.md` (which layer a CTA belongs to) · `ooux-ctas` skill (full CTA matrix building)*
