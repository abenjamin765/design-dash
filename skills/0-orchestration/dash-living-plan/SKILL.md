---
name: dash-living-plan
description: "Manage the Design Dash living plan — a hot-reloading MDX document that is the source of truth for decisions, artifacts, and agent handoff. Use when starting a Design Dash (P0 seed), updating a phase, running check/export, or preparing a handoff brief. Invoke via /design-dash or standalone."
version: "0.1.0"
stage: "0-orchestration"
---

# Dash Living Plan Skill

The living plan is a per-workshop MDX document in `dashes/{slug}/living-plan/`. It is the **source of truth** for decisions, OOUX findings, gate status, and the agent handoff brief. Workshop markdown files (`scope.md`, `flow.md`, etc.) are derived from it via `export.mjs`.

The living plan is the source of truth. `export.mjs` output IS the workshop file.

---

## Step 0 — Read catalog (MANDATORY before any MDX edit)

Before editing any `.mdx` file, read:

```
apps/dash-living-plan/COMPONENT_CATALOG.md
```

Never invent new JSX tags. Unknown tags are a `check` failure and block export. The allowlist is:

`DashShell` · `PhaseSection` · `PlanPhases` · `Placeholder` · `Takeaway` · `Decision` · `AssumptionRow` · `GateStatus` · `GateTrack` · `StatRow` · `Detail` · `ScenarioFlow` · `ScopeBoundary` · `ConceptCompare` · `ConceptCard` · `WireframeEmbed` · `OpenQuestions`

Deferred components must be written as **structured Markdown headings** inside `PhaseSection`. Follow the exact heading names from the catalog's "Deferred" section — export.mjs scrapes them.

**Two contracts the catalog spells out and this skill enforces:**

1. **Serializer or children.** A component's props only survive export because
   `export.mjs` has a serializer for it. Anything else is deleted along with the
   tag. If you need a new component, it ships with a serializer or it holds its
   content as children.
2. **Headings are matched exactly, through an alias map.** `## Non-Goals` is not
   `## Goals`. To rename a heading in content, add the new name to
   `SECTION_ALIASES` in `export.mjs` first — an unlisted heading is silently not
   scraped.

---

## Step 1 — Seed (P0)

Run once at the start of every Design Dash:

```bash
node apps/dash-living-plan/cli.mjs seed \
  --dir dashes/{slug} \
  --slug {slug} \
  --tier {express|standard|high-stakes} \
  --session-mode {interactive|solo}
```

This copies `templates/living-plan/` into `dashes/{slug}/living-plan/`, substituting `{{SLUG}}`, `{{TIER}}`, and `{{SESSION_MODE}}`.

**Pass the tier and session mode P0 actually determined.** Both flags default
from `dash-config.yaml` in the workshop directory when that file already exists
(`dash_tier` / `session-mode`); an explicit flag always wins; the fallback is
`standard` / `interactive`. An invalid `--tier` or `--session-mode` fails the
command rather than seeding a wrong value.

Never hand-edit `tier` or `sessionMode` in `meta.yaml` or `plan.mdx` after
seeding — re-seed with the right flags, or fix `dash-config.yaml` and re-seed.

**If the directory already exists**, seed is skipped — do not re-seed.

---

## Step 2 — Start the viewer (P0, best-effort)

```bash
node apps/dash-living-plan/cli.mjs serve \
  --dir dashes/{slug}/living-plan \
  --open
```

- Starts Vite UI + Hono API on **ephemeral OS-assigned ports** (never hardcode 5275/5173); opens the browser
- Writes bound ports to `living-plan/.ui-port` / `.api-port` and URL to `living-plan/.living-plan-url`
- **Soft-fails:** if the server fails to start, log the error and continue the dash in chat. Never block on the viewer.
- Report the URL to the designer: "Living plan open at http://127.0.0.1:5275"

---

## Step 3 — Update the active phase (per-checkpoint)

**Read only the active phase file** before editing:

```
dashes/{slug}/living-plan/phases/p{N}.mdx
```

Agent edit rules (Prompt Pro anti-drift):
1. Edit `phases/p{N}.mdx` — the file for the phase currently being worked
2. Never edit future-phase files unless adding a Decision or GateStatus update triggered by current work
3. Flip `<PhaseSection status="placeholder">` → `"in-progress"` when you start a phase
4. Flip `"in-progress"` → `"done"` only after check passes and all Placeholders are replaced
5. Prefer replacing `<Placeholder>` children with real components; do not delete the `<PhaseSection>` shell
6. Update `meta.yaml` `currentPhase` when phase advances

**At every phase boundary, re-read:**
- `apps/dash-living-plan/COMPONENT_CATALOG_SUMMARY.md`
- `phases/p{N}.mdx` for the incoming phase

This is the anti-drift re-anchor. Do not rely on earlier context window copies.

---

## Step 4 — Per-phase content checklist

What must appear in each phase before flipping status to `done`:

**Every phase** opens with a `<Takeaway>` — one plain-language sentence, above the
first heading, written for a reader who will read nothing else on the page.

| Phase | Required in plan MDX |
|---|---|
| P0 | `<Decision>` for tier + session mode; all `<GateStatus>` initialized to `pending` |
| P1 | Problem statement (real, not Placeholder); `<AssumptionRow>` for each unvalidated item; metrics heading; `<GateStatus name="Evidence Gate">` updated |
| P2 | Problem statement, user role, build mode, scope, success criteria, mental models, hub object — all real |
| P3 | Context, goals, non-goals, primary user, objects table, decisions, sign-off table — all real |
| P4 | Primary scenario, page list, goal-page map, constraints; `<GateStatus name="Reconciliation Gate">` updated |
| P5 | At least one Concept section with scores and selection rationale; `<GateStatus name="Selection Gate">` updated |
| P6 | `<WireframeEmbed>` pointing to `wireframe.html`; ethics section; `<GateStatus name="Ethics Gate">` updated |
| P7 | Prototype path; component deviations table |
| P8 | Summary, learning gate plan, handoff brief (must stand alone); `<GateStatus name="Learning Gate">` updated |

---

## Step 5 — Check + export (at every phase boundary)

Run before advancing to the next phase:

```bash
# Validate MDX
node apps/dash-living-plan/cli.mjs check \
  --dir dashes/{slug}/living-plan

# Export to workshop files (runs check first; fails if check fails)
node apps/dash-living-plan/cli.mjs export \
  --dir dashes/{slug}/living-plan
```

`export.mjs` writes: `assumptions.md`, `metrics.md`, `scope.md`, `design-spec.md`, `flow.md`, `ethics-review.md`, `workshop-summary.md` — stripped of all Placeholder content.

`check` also verifies that content-bearing components reach the exported
Markdown. If a component sits inside an exported section but produces nothing,
check names the file, the section, and the component. **Never work around that
error by hand-authoring the workshop file** — it means a serializer is missing or
broken, and hand-authoring makes the next export silently overwrite your fix.

The living plan is the source of truth. `export.mjs` owns the seven exported files; do not hand-author them. Run `export` and they are regenerated.

---

## Step 6 — WireframeEmbed (P6)

After the wireframing skill writes `dashes/{slug}/wireframe.html`:

1. Open `phases/p6.mdx`
2. Remove the `<Placeholder>` for wireframe
3. Add:

```mdx
<WireframeEmbed src="wireframe.html" title="[Screen name] wireframe" />
```

The server maps `/workshop/wireframe.html` → `workshopDir/wireframe.html`. The path in `src` is relative to the workshop root (not living-plan/).

---

## Step 7 — Handoff brief (P8)

Before finalizing P8, the `### Handoff Brief` section (Catalog v2 heading) must stand alone. A reader with no chat history should understand:

- Hub object + slug + maturity
- Primary surface and approved concept
- Key constraints
- What the next agent needs to build from this plan

`<OpenQuestions>` in `plan.mdx` is the only parking lot for unresolved items. Everything else must be resolved or explicitly deferred in an `<AssumptionRow>`.

---

## Claude Code prerequisites

Run once per machine on migration from Cursor:

1. `./install.sh --claude` — symlinks skills to `~/.claude/skills/`
2. Ensure `/design-dash` command is available in Claude Code commands path
3. Object library: ensure `library/objects/` exists (local guides accumulate across dashes)
4. Start `/design-dash` from this repo (or any workspace where `dashes/` is writable)

---

## Error reference

| Error | Cause | Fix |
|---|---|---|
| `Unknown component <Foo>` | Tag not in allowlist | Replace with allowed tag or use Markdown heading |
| `<Placeholder> in status="done"` | Placeholder not replaced before marking done | Replace content, then flip status |
| `<PhaseSection> missing required prop` | id, title, or status absent | Add missing prop |
| `No .mdx files found` | Wrong --dir path | Confirm path to `living-plan/` dir |
| `export aborted: check failed` | check errors exist | Fix errors, re-run check, then export |
| `section "X" holds <Foo> but exports with no content` | No serializer for `<Foo>` in export.mjs, or the section heading is not in `SECTION_ALIASES` | Add the serializer or the alias — do not hand-write the workshop file |
| `<Foo> content is missing from the exported "X" section` | Serializer exists but drops that prop | Fix the serializer in `export.mjs` |
| A section exports empty with no error | Heading name is not in `SECTION_ALIASES` | Add the heading name to the alias map |
| `tier "X" from --tier is not one of…` | Bad `seed` flag | Use `express`, `standard`, or `high-stakes` |
| `DASH_LIVING_PLAN_DIR not set` | Server launched without env var | Always use `cli.mjs serve --dir` |
