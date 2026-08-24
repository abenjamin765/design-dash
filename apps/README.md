# Apps

Optional tooling for Design Dash. The method in `method/method.yaml` remains fully runnable without anything in this directory (`no_node_runtime` fallback) — every deliverable exists as plain markdown/files first, and the server below is convenience infrastructure, never a requirement.

## Workshop (`workshop/`)

A locally-served **elicitation surface**: AI agents publish declarative activities, humans answer through structured interactions instead of chat, and every response normalizes back into the dash model as a real node file (see `ARCHITECTURE.md` → five roles; ADR-0004).

The server is deliberately thin and holds no truth: specs live at `dashes/{slug}/workshop/*.json`, model nodes at `dashes/{slug}/model/{node-id}.md`. Delete this directory and nothing canonical is lost.

### Run it

```sh
node apps/workshop/server.js        # serves on http://localhost:4173
PORT=5000 node apps/workshop/server.js   # any port
```

No install step, no dependencies — Node built-ins only.

Then open:

- `http://localhost:4173/?slug=sample-dash` — bundled demo (a coffee-subscription dash under `apps/workshop/sample-dash/`; safe to poke, writes stay inside `apps/`)
- `http://localhost:4173/?slug=<your-dash>` — any real dash that has `dashes/<your-dash>/workshop/*.json`

### What's implemented

- The three MVP primitives from ADR-0004: **question** (single / multi / ranked / scale / free text), **artifact panel** (renders a model node inline + annotations), **compare** (forced choice / weighted).
- Responses POST to `/api/response` and are written back as Dash Model nodes (`decision-*`, `evidence-*`, or `annotation-*`) with provenance frontmatter.
- Server-Sent Events at `/api/events`: editing or dropping spec files into a `workshop/` dir hot-reloads the client activity list.
- Endpoints: `GET /api/slugs` · `GET /api/specs?slug=X` · `GET /api/node?slug=X&id=Y` · `POST /api/response`.

### Contract

Activity specs follow **Activity Spec v1** and responses write back per the node schema. The authoritative definitions are authored alongside the method (in progress in parallel):

- `method/dash-model-schema.md` — node files, frontmatter fields, edge vocabulary
- `skills/_cross-cutting/workshop-activities/` — primitive grammar, spec schema, markdown fallbacks

This app is an adapter for that contract, not the contract itself.

## Design Plan generator (`design-plan/`)

Generates the **Design Plan** — the living HTML view of a dash's Dash Model (= HEAD, ADR-0005) — with a generation stamp for staleness detection.

```sh
node apps/design-plan/generate.mjs <slug>   # writes dashes/{slug}/plan/index.html
```

Self-contained output (inline CSS/JS, works offline from `file://`), zero dependencies beyond Node builtins and the shared `dash-living-plan/contract/dash-contract.mjs` tables. Renders phase/gate status, all model nodes grouped Why/What/How, mandatory-anchor coverage, and per-card annotation write-back to the workshop server (markdown fallback when it's not running). Never hand-edit its output — regenerate. See `apps/design-plan/README.md`.

## Story publisher (`story-publisher/`)

Publishes a **Story** — the stakeholder-facing frozen-release view (ADR-0005): a curated narrative traversal of the Dash Model at a moment in time.

```sh
node apps/story-publisher/publish.mjs <slug> <label>   # reads dashes/{slug}/stories/{label}.json
```

Writes `dashes/{slug}/stories/{label}/index.html` + `manifest.snapshot.json` (audit trail). Immutability is mechanical: republishing over an existing story refuses without `--force`; every card cites the exact model state via the publish stamp (`from Dash Model @ <short-hash>`). Zero dependencies — shares its parser/stamp/markdown helpers with `apps/design-plan/generate.mjs`. See `apps/story-publisher/README.md`.

## No Node? No problem

Every workshop activity has a mandatory plain-markdown equivalent (per `method.yaml` capability fallbacks), and the Design Plan is a plain-file view you can regenerate anywhere Node runs — or read the underlying `model/*.md` files directly. Terminal-only sessions satisfy gates honestly without either app; these UIs are optional infrastructure on top of plain files.
