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

### No Node? No problem

Every workshop activity has a mandatory plain-markdown equivalent (per `method.yaml` capability fallbacks), so terminal-only sessions satisfy gates honestly without this server. The UI is optional infrastructure on top of plain files.
