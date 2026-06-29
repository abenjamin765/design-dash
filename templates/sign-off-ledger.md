# Sign-Off Ledger

**Dash:** <!-- dash-name -->  
**Dash ID:** <!-- scope.md dash_id -->  
**Tier:** Express / Standard / High-stakes  
**Last updated:** YYYY-MM-DD

> **Governance (req §11.8):** Adversarial-panel simulation is the **floor**; real human sign-off is the **target**. Every sign-off is recorded as `real`, `simulated`, or `debt`. A conclusion resting on simulated voices is reported at lower confidence than one with real sign-off. Any `debt` must be named explicitly in the Decision Memo.
>
> **Substance rule (req §12.13.1):** A real sign-off row requires the approver to reference the **specific artifact or decision they reviewed**. A bare thumbs-up does not clear a real sign-off.
>
> **High-stakes rule:** Every *Responsible* discipline must be real before P8 completes. Simulated rows are placeholders that must be cleared.

---

## Ledger

| discipline | raci-role | gate(s)-owned | mechanism | status | evidence-link | date | notes |
|---|---|---|---|---|---|---|---|
| PM / product | R / A / C / I | P1 · P3 | in-session / issue tracker / comment | real · simulated · debt | <!-- URL / persona name --> | YYYY-MM-DD | |
| Engineering-feasibility | R / A / C / I | P5 · P7 | in-session / PR comment on dash branch | real · simulated · debt | <!-- PR link / persona name --> | YYYY-MM-DD | |
| BI / data | R / A / C / I | P1 · P8 | in-session / data page / data ticket | real · simulated · debt | <!-- metrics.md + source / persona name --> | YYYY-MM-DD | |
| UX researcher | R / A / C / I | P1 · P8 | in-session / research repository link / comment | real · simulated · debt | <!-- research session / file path / persona name --> | YYYY-MM-DD | |
| Content designer | R / A / C / I | P6 | in-session / PR comment on glossary.md | real · simulated · debt | <!-- PR link + specific decision reviewed / persona name --> | YYYY-MM-DD | |
| Domain expert | R / A / C / I | P6 · P8 | in-session / usability test readout | real · simulated · debt | <!-- Test readout link / persona name --> | YYYY-MM-DD | |
| End-user advocate | R / A / C / I | P6 · P8 | in-session / usability test (real users) | real · simulated · debt | <!-- n=[N] users, segment, research repository link / persona --> | YYYY-MM-DD | |
| Operations / admin advocate | R / A / C / I | P6 | in-session / comment | real · simulated · debt | <!-- link / persona name --> | YYYY-MM-DD | |
| Privacy / legal (if C-items flagged) | R | Privacy gate | in-session / legal review doc | real | <!-- Legal review doc link — simulation NOT allowed --> | YYYY-MM-DD | Required if any Section C ethics flag |

---

## RACI guide

| Role | Meaning |
|---|---|
| **R** — Responsible | Does the work; must sign off (real or simulated as floor) |
| **A** — Accountable | Owns the outcome; sign-off is the target |
| **C** — Consulted | Input sought; may be simulated |
| **I** — Informed | FYI only; no sign-off required |

> **Required-discipline rule (req §12.3):** RACI roles for *Responsible* disciplines are **derived from tier + artifact type** — they are not designer-assignable. A prototype handoff to engineering is Responsible. A user-facing feature requires an end-user advocate as Responsible.

---

## Debt items (from this ledger)

| discipline | gate | due-by | status | notes |
|---|---|---|---|---|
| <!-- discipline --> | <!-- gate --> | <!-- YYYY-MM-DD --> | debt | <!-- Request sent YYYY-MM-DD; fallback is persona simulation floor. Log in assumptions.md. --> |

---

## Confidence statement (for Decision Memo)

> This dash has <!-- N --> real sign-offs and <!-- M --> simulated sign-offs. <!-- N --> debt items are outstanding. Confidence is **[high / moderate / conditional / low]** based on the proportion of real-vs-simulated discipline coverage.
