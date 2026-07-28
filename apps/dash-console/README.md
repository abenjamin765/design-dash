# Design Dash Console

A local workshop console for the [Design Dash](../../AGENTS.md) workflow. Reads the
file contract written by the `/design-dash` orchestrator and surfaces phase/gate/artifact
status, HTML previews, and clipboard-ready agent prompts.

**The agent still runs the dash.** This console does not replace
`/design-dash` or any skill — it is a visibility and control plane over the files.

---

## Quick start

```bash
cd apps/dash-console
npm install
npm run dev
```

Open **http://127.0.0.1:5173** in your browser.

On first run, go to **Settings** and add a workspace root
(e.g. `~/Sites/design-dash`) — any dash workspace with a `dashes/` directory.

---

## What it does

| Feature | Details |
|---|---|
| **Workshop list** | Scans `dashes/*` in all configured workspace roots; shows tier, session mode, and % artifact completion |
| **Where am I** | Phase strip (P0–P8) with done / in-progress / pending; gate chips; full artifact table |
| **Preview** | In-app iframe for `wireframe.html`, `pitch/index.html`, and any other HTML artifacts |
| **Copy prompts** | One-click copy of `/design-dash` start or `--phase Pn` resume prompt for your agent |
| **Open in Finder** | Reveal the workshop folder in macOS Finder |
| **New workshop** | Creates the folder stub with `dash-config.yaml` + `assumptions.md` seeded from templates |
| **Settings** | Manage workspace roots; stored in `~/.config/design-dash/console.json` |

---

## Architecture

```
server/           Node + Hono API on 127.0.0.1:8787
  index.ts        API routes (workshops, config, preview, prompts)
  scanWorkshops   Reads dash-config.yaml + artifact presence
  artifactContract  Phase→file map + tier gate rules
  prompts.ts      Clipboard prompt strings
  config.ts       ~/.config/design-dash/console.json

src/              Vite + React + TypeScript UI on :5173
  pages/          WorkshopList, WorkshopDetail, Settings, NewWorkshop
  components/     PhaseStrip, ArtifactTable, PreviewFrame
```

Vite proxies `/api` and `/preview` to the Hono server so the browser only
talks to `127.0.0.1:5173`.

---

## Configuration

Workspace roots are stored in **`~/.config/design-dash/console.json`** — not committed
to the repo. The server only reads paths inside configured roots.

Default detected roots on first run: `~/Sites/design-dash`, `~/Sites/design-dash`.

---

## What this does NOT do

- Call Cursor Cloud Agents or the Claude API (that's phase B)
- Replace the `/design-dash` orchestrator or any SKILL.md
- Edit markdown artifacts or run gate checks in the browser
- Host on GitHub Pages or any network address (localhost only)
- Modify or commit files to the dash workspace (read-only except for stub creation)

---

## Updating the artifact contract

When the design-dash orchestrator produces new file names for a phase, update:

```
server/artifactContract.ts  →  PHASES[] array
```

No other files need to change for artifact tracking.
