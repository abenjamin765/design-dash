# Apps

Optional Node tooling for Design Dash. The method in `method/method.yaml` remains runnable without these apps (`no_node_runtime` fallback).

| App | Role |
|---|---|
| `dash-living-plan/` | Living-plan MDX seed/check/export/serve CLI + viewer. Machine contract: `dash-living-plan/contract/dash-contract.mjs` |
| `dash-console/` | Workshop console UI (optional) |

Install dependencies per app (`npm install` inside the app directory) only when you want the viewer or console.
