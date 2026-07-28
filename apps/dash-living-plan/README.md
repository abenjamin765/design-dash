# Design Dash Living Plan

Hot-reloading MDX viewer for the Design Dash workflow. Seeded at P0, populated by the orchestrator as phases complete. The living plan is the source of truth for decisions, artifacts, and the agent handoff doc.

## Quick start

```bash
cd apps/dash-living-plan
npm install

# Seed a new workshop
node cli.mjs seed --dir dashes/my-slug --slug my-slug

# Start the hot-reload viewer (soft-fails if browser can't open)
node cli.mjs serve --dir dashes/my-slug/living-plan --open

# Validate MDX (run before export)
node cli.mjs check --dir /path/to/.../living-plan

# Export to workshop markdown files
node cli.mjs export --dir /path/to/.../living-plan
```

## Architecture

```
apps/dash-living-plan/
  cli.mjs              # main entry point (serve · check · export · seed)
  check.mjs            # MDX allowlist validator
  export.mjs           # MDX → workshop markdown
  vite.config.ts       # Vite + @mdx-js/rollup; @plan alias → DASH_LIVING_PLAN_DIR
  server/index.ts      # Hono API (meta, phases, workshop file serving)
  src/
    main.tsx           # React root + MDXProvider
    App.tsx            # Header + phase loader
    PlanLoader.tsx     # import.meta.glob → MDX phase rendering
    components/        # MVP 8 component allowlist
    styles/            # Global CSS (document-first, a11y floor)

# Per-workshop (in product repo):
dashes/{slug}/
  living-plan/
    plan.mdx           # DashShell + composition root
    phases/
      p0.mdx … p8.mdx  # One file per phase — agent edits only the active one
    meta.yaml
    .living-plan-url   # gitignore
```

## Component catalog

Read [`COMPONENT_CATALOG.md`](./COMPONENT_CATALOG.md) before editing any MDX file.

MVP allowlist: `DashShell` · `PhaseSection` · `Placeholder` · `Decision` · `AssumptionRow` · `GateStatus` · `WireframeEmbed` · `OpenQuestions`

## Motion

Subtle attention motion (Emil Kowalski principles) draws the eye to what the
agent just wrote or changed mid-dash:

| Signal | Behavior |
|---|---|
| New Decision / Assumption / Gate / Wireframe | Enter flash: opacity + slight rise from `scale(0.98)`, amber ring, ~280ms ease-out |
| Phase status flip | Same flash + status chip / border color morph |
| Active phase | Soft pulse on status-chip dot; auto-scroll into view |
| Placeholder (unfilled) | Ambient breathing border — not attention-demanding |
| First page load | No cascade of flashes (hydration gate) |
| `prefers-reduced-motion` | All motion disabled |

Easing tokens: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. No `transition: all`, never from `scale(0)`.

## What this does NOT do

- Replace the `/design-dash` orchestrator
- Edit markdown artifacts directly
- Host on any network address (localhost only)
- Share across machines (`.living-plan-url` is a local token)
