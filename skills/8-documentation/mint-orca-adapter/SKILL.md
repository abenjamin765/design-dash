---
name: mint-orca-adapter
stage: 8-documentation
description: "Publish Design Dash P8 artifacts into a Mintlify docs site as MDX. Use at P8 wrap-up when the orchestrator (or the user) asks to publish the plan, or standalone to convert an existing dash's artifacts to docs."
---

# Mint-ORCA Adapter — publish a dash to Mintlify docs

## Purpose

Converts the artifact set a completed dash produces (requirements, object guides,
wireframes, assumptions, flows) into Mintlify-ready MDX pages and navigation
entries, so the PLAN becomes living, searchable documentation instead of files
in a dash folder. Runs at **P8 wrap-up** (orchestrator §8.6) or standalone.

## Preconditions

1. Resolve the docs target from `dash.config.json` → `documentation.docsRoot` and
   `documentation.docsJson`. **If no config exists, ask the user for the docs repo
   path before doing anything.**
2. The dash must have completed P8.1 (requirements.md exists). Partial dashes
   publish only what exists — never fabricate missing artifacts.
3. Read the docs repo's `AGENTS.md` for terminology, slug, and structure
   conventions. Docs conventions win over dash-internal naming.

## Artifact → MDX mapping

| Dash artifact | Docs destination | Notes |
|---|---|---|
| `library/objects/{slug}` guides touched by the dash | `object-library/objects/{slug}.mdx` | Merge, don't overwrite: guides are canonical and may hold content from other dashes. Update the manifest/registry via the docs repo's script. |
| `dashes/{slug}/requirements.md` | `specifications/{dash-slug}/requirements.mdx` | Split >800-line files by requirements section |
| `dashes/{slug}/scope.md` | `specifications/{dash-slug}/scope.mdx` | Problem statement, users, tier |
| `dashes/{slug}/assumptions.md` | `specifications/{dash-slug}/assumptions.mdx` | Keep the validation-method column — it is the decision log |
| `dashes/{slug}/flow.md` scenario maps | `specifications/{dash-slug}/flows.mdx` | Convert ASCII/mermaid blocks to Mintlify-compatible code fences |
| `dashes/{slug}/wireframe.html` | `specifications/{dash-slug}/wireframes.mdx` + asset | Embed as iframe/link; copy the HTML into the docs repo's asset path |
| `dashes/{slug}/summary.html` | not published | The docs pages ARE the summary; link the repo file instead |

## Frontmatter contract

Every generated page carries:

```yaml
---
title: "{Title}"
description: "{one-line}"
generated-by: mint-orca-adapter
source-dash: {dash-slug}
status: draft
---
```

`generated-by` + `source-dash` make regeneration idempotent: on re-run, replace
only pages whose frontmatter matches this dash, never hand-authored pages.

## Steps

1. **Inventory** — list the dash artifacts that exist; show the user the mapping
   table with what will be created/updated. `WAIT FOR USER` confirmation.
2. **Convert** — apply the mapping. Follow docs `AGENTS.md` terminology table and
   link style (root-relative, no `.mdx` extension).
3. **Navigation** — add a `"{Dash name}" ` group under the docs' specifications
   tab/section in `docs.json`. Validate JSON after edit.
4. **Object library** — for object guides, run the docs repo's manifest sync
   script (e.g. `node docs/scripts/sync-from-manifest.mjs`) after edits.
5. **Verify** — `mint dev` build check if available; otherwise validate all
   internal links resolve to files and `docs.json` parses.
6. **Report** — list created/updated files and remind the user to commit and
   (if the notion-sync skill is installed) mirror to Notion.

## Guardrails

- This skill is a convenience, not a gate — publishing must never block P8
  completion. On any failure, write the mapping table to
  `dashes/{slug}/publish-todo.md` and stop cleanly.
- Never copy object-guide content into skill files or duplicate guides across
  repos; the object library keeps a single canonical copy per object.
- Business-specific paths belong in `dash.config.json`, never hardcoded here.
