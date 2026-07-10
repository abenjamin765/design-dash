---
name: object-library-context
stage: _cross-cutting
description: "Structured access to the local object guide library at library/objects/. Use when any skill needs to read, reference, or discover existing object guides."
---

# Object Library Context

## Purpose

Gives agents working in this Design Dash repository structured access to the local object guide library at `library/objects/`. Use when prototyping or referencing objects discovered in a dash, when checking whether an object has already been modeled, or when writing a new object guide.

---

## Step 0 — Resolve the library root

Check for `dash.config.json` in the repo root:

- **If present**, use `library.objectsPath` as the objects directory and
  `library.indexPath` as the index, and honor `library.format` (`md` or `mdx`).
  Paths are relative to the repo root. All later steps that say
  `library/objects/` mean the resolved path.
- **If absent**, use the defaults: `library/objects/` and `library/objects/_index.md`.

When `library.format` is `mdx`, guides carry Mintlify-style YAML frontmatter
(`title`, `description`, `slug`, `status`, `source`) and the index may be a
`manifest.yaml` (one entry per object: `slug`, `display_name`, `domain`,
`nav_group`, `hub`, `status`, `path`, `summary`) instead of a markdown table —
parse accordingly.

---

## Step 1 — Load the index

Read `library/objects/_index.md` if it exists. This file is an auto-generated index of all guides with slug, name, status, dash origin, and one-line summary.

If `_index.md` is missing or empty (no rows), fall back to Step 2.

---

## Step 2 — Scan for guides (no index fallback)

If the index is absent or has no rows:

1. List all `*.md` files in `library/objects/`.
2. Exclude any files matching `_*.md` (underscore-prefixed files are internal, e.g. `_index.md`, `_example-*.md`).
3. For each file found, read the YAML frontmatter to extract `name`, `status`, `dash`, and `summary`.
4. Present the list to the user or consuming skill as: `{slug} — {name} ({status}): {summary}`.

---

## Step 3 — Read a specific object guide

To look up a single object by slug:

1. Construct the path: `library/objects/{slug}.md`.
2. Read the file. If it does not exist, report that no guide was found and suggest checking the index for similar slugs.
3. Parse the guide top-down:
   - **Frontmatter** (`name`, `status`, `dash`, `summary`, `relationships`)
   - **Definition** — one-sentence definition in the `## Identity` or `## Definition` section
   - **Attributes** — the `## Attributes` or `## Prioritized Properties` section
   - **CTAs** — the `## Actions` or `## CTAs` section
   - **Relationships** — the `## Relationships` section

---

## Step 4 — Write a new object guide

When an object has been modeled and needs a guide written:

1. Read `templates/object-guide.md` as the template.
2. Fill in all sections using the modeled object data.
3. Write the completed guide to `library/objects/{slug}.md` where `{slug}` is the lowercase, hyphenated object name (e.g., `user-account`, `subscription`, `project`).
4. Update `library/objects/_index.md` — append a new row to the index table (see index format below).

---

## Step 5 — Index format

`library/objects/_index.md` uses this structure:

```markdown
# Object Library Index
Last updated: {YYYY-MM-DD}

| Slug | Name | Status | Dash | Summary |
|---|---|---|---|---|
| account | Account | stable | my-saas-dash | A registered user account... |
| project | Project | draft | my-saas-dash | A container for work items... |
```

**Status values:** `draft` | `stable` | `needs-review`

When adding a row, append it at the bottom of the table. Update the `Last updated` date. Never remove existing rows — mark deprecated objects with status `archived` instead.

---

## When to use this skill

| Phase | Trigger |
|---|---|
| **P0 — Context** | Check existing objects before beginning discovery; avoid re-modeling already-documented objects |
| **P4 — Reconcile** | After object modeling is complete, write or update guides for all newly discovered objects |
| Any phase | Whenever a skill needs to read a relationship, CTA list, or attribute list for an existing object |

---

## Notes

- Object guides in `library/objects/` accumulate across dashes. An object modeled in one dash is available to all future dashes in the same repo.
- When `dash.config.json` redirects the library to an external docs repo, writes must respect that repo's conventions (frontmatter, flat `objects/` directory, domain-prefixed slugs for name collisions) and its manifest/registry regeneration scripts — check that repo's `AGENTS.md` before writing.
- The index is the canonical lookup; the individual `*.md` files are the source of truth for guide content.
- If a guide exists but is `draft` or `needs-review`, surface that status to the consuming skill so it can decide whether to trust the guide or prompt for validation.
