# Edge State Matrix

**Dash:** <!-- dash-name -->  
**Dash ID:** <!-- scope.md dash_id -->  
**Last updated:** YYYY-MM-DD  
**Owner:** <!-- designer -->

> **Governance (req §12.6):** Edge states must be **rendered/visible in the prototype** — not one-liners. Each cell must cite a specific design decision or wireframe reference. An empty cell is a design debt item, not a passing state.

---

## Matrix

| page | empty-state | loading-state | error-state | permission-denied-state | at-scale-state |
|---|---|---|---|---|---|
| <!-- Page or view name --> | <!-- What is shown when there is no content yet. Must include: what's missing + why + primary action. Wireframe ref: --> | <!-- Skeleton / spinner / progressive reveal strategy. Wireframe ref: --> | <!-- Named failure + recoverable? + next step. Not "Something went wrong." Wireframe ref: --> | <!-- What the user sees when they lack access. Does not reveal protected data. Wireframe ref: --> | <!-- Behavior at realistic scale (1,000 users, 500 records, multi-tenant dataset). Does the UI degrade? Pagination, truncation, virtualization strategy. Wireframe ref: --> |

<!-- Add rows for each page/view. One row per page. -->

---

## Design debt

Edge states not yet rendered in the prototype (must be resolved before P8):

| page | unrendered-state | due-by | owner |
|---|---|---|---|
| <!-- page --> | <!-- empty / loading / error / permission-denied / at-scale --> | <!-- YYYY-MM-DD --> | <!-- name --> |

---

## Performance note (req §12.9)

The `at-scale-state` column must account for **realistic usage scale**. If the at-scale view triggers a network request that exceeds acceptable latency on a constrained connection, it is a performance debt item — log it here and in `assumptions.md`.
