# Design Plan generator (`apps/design-plan/`)

Generates the **Design Plan** — a self-contained HTML view of a dash's Dash Model (= HEAD), per [ADR-0005](../../docs/adr/0005-view-lifecycles-design-plan-head-story-tagged.md) and roadmap item 4 in [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

The plan is a **generated view, never a hand-edited document**: edit model files (or answer workshop activities), regenerate, and the page always tells the truth about the model it was built from. Every render embeds a generation stamp so staleness is mechanically detectable.

## Usage

```sh
node apps/design-plan/generate.mjs <slug>
```

Writes `dashes/{slug}/plan/index.html` (for the demo fixture: `apps/workshop/sample-dash/plan/index.html`). Zero dependencies — Node builtins plus one relative import of the shared phase/gate tables.

Slug resolution mirrors the workshop server: a real `dashes/{slug}/` directory wins; the literal slug `sample-dash` falls back to the bundled fixture at `apps/workshop/sample-dash/`.

Open the emitted `index.html` directly from `file://` — it is fully self-contained (inline CSS/JS, system fonts, no CDN, works offline).

## What it renders

1. **Header** — dash slug, tier (read from `dash-config.yaml` when present), generation stamp (short hash shown; full hash in the tooltip and `<title>`), exported-at timestamp, scanned-file count.
2. **Phase / gate strip** — rendered *from* `apps/dash-living-plan/contract/dash-contract.mjs` (PHASES, GATE_PHASES, GATE_LABELS, TIER_GATES, artifactsForPhase). Per-phase artifact presence is checked against the dash dir; required-but-missing artifacts are flagged; gates required at the dash's tier are highlighted.
3. **Three sections** following the schema groups in `method/dash-model-schema.md`:
   - **Why** — evidence, assumption, insight, opportunity
   - **What** — requirement, constraint, object
   - **How** — scenario, flow, screen, decision, outcome, annotation

   Each node becomes a card: type badge, name, status chip, provenance line (confidence / source dash / activity / actor / date), typed-link chips (dangling targets marked), and its markdown body (headings, lists, quotes, bold/code, fenced blocks preserved).
4. **Mandatory-anchor coverage footer** — counts the three anchors present vs expected from `links` arrays: screen→decision `JUSTIFIED_BY`, decision→requirement-or-object `IMPLEMENTS`, requirement→opportunity `ADDRESSES`.

A dash with an empty `model/` gets an honest empty state explaining how nodes come into existence.

## Generation stamp algorithm

Identical to `object-graph-export` Mode B:

```
entries   = for every file under dashes/{slug}/model/*.md:
            "{path-relative-to-dash-dir}:{sha256(file-contents)}"
stamp     = sha256( sort(entries).join("\n") )
```

Same model state ⇒ same stamp. The stamp lands in `<meta name="generation-stamp">`, the page header, and the `<title>`.

## Annotation write-back

Every card has an **Annotate** control. Two paths, stated explicitly in the UI whichever happens:

1. **Workshop server path** — POSTs `{slug, activity_id: "plan-annotation-"+nodeId, normalizes_to: "annotation", target_node_id: nodeId, payload: {comment}}` to `http://localhost:4173/api/response`. The workshop server normalizes it into a real `annotation-*` node with `ANNOTATES` provenance. Regenerate afterwards to see it on the page.
2. **Markdown fallback** — if the server isn't running (or rejects), the control reveals a pre-filled node file matching the workshop's response format; paste it into `dashes/{slug}/model/` and regenerate. Terminal-only sessions lose nothing.

This honors ADR-0005: annotations write back into the model, never as HTML surgery on this page.

## Regeneration discipline

**Never hand-edit `plan/index.html`.** It is a projection. Fix the model, run the generator again. Hand edits will be silently discarded by the next regeneration and break the generation-stamp guarantee for everyone reading the page.
