# /dash-new

Scaffolds a new Design Dash workspace so no artifact has to be reconstructed from memory.

## Usage

```
/dash-new {slug} [--tier express|standard|high-stakes]
```

`slug` becomes `dashes/{slug}/`. Tier defaults to `standard` when omitted; tier rules always come from `method/method.yaml` — never from memory.

## What it does

1. **Refuse to overwrite**: if `dashes/{slug}/` exists, stop and offer `--phase` resume via `/design-dash` instead.
2. **Create `dashes/{slug}/dash-config.yaml`** from the method contract:
   - identity block (`dash-name`, `dash-id: {slug}-{YYYY-MM}`, owner, start-date, workspace)
   - `tier` + a placeholder `computed-tier-rationale` citing the rule-derived basis (T1–T5 reach/role/risk answers still owed by P0)
   - `phases-active: [P0…P8]`
   - `gates-required` exactly per `method.yaml` tiers (express → edge_ethics_equity only; standard → + evidence, reconciliation, selection, learning; high-stakes → + privacy_compliance)
   - `artifacts-required` minimums; `cross-functional-sign-off.simulation-allowed: true` with ledger caps noted
3. **Seed linked skeletons** (from `templates/`, headers + cross-references only — never invented content):
   - `assumptions.md` · `metrics.md` · `scope.md` · `design-spec.md` · `auto-confirms.md` · `friction-log.md`
4. **Posture inheritance check**: read `library/objects/_index.md`; if prior dashes exist, list them and carry forward domain posture that still applies (e.g., personal-data flags → ethics floor mandatory regardless of tier) into `runtime-notes`.
5. **Announce next step**: `/design-dash --phase P0` (tier classifier confirms or raises the provisional tier; it can never lower it).

## Notes

- Thin wrapper on purpose: gate definitions live in `method/method.yaml`; if this command and the method disagree, the method wins.
- Dash outputs stay under `dashes/` (gitignored) — the scaffolder never writes outside it.
