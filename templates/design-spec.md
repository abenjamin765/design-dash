<!-- TEMPLATE: Design Spec
     Page title: "Design Spec: {Project Name}"
     Parent: Project folder page

     P3 framing lock (sections 1–3). Section 4 is filled after P4.
     Section 5 is filled after P5; score tables live in concept-choice.md.
     Do NOT include an H1 header, date, author, or skill metadata.
-->

**Project:** [{Project Name}](link-to-project-hub)
**Dash:** {slug}
**Tier:** {express | standard | high-stakes}

---

## 1. Context

{1–3 sentences: the product, the situation, and why this dash exists.}

**Problem statement (locked):**

{Falsifiable problem statement from P1 / P3.}

**Linked assumptions:**

| ID | Statement | Status |
| --- | --- | --- |
| A-### | {Assumption} | open / validated / debt |

---

## 2. Goals / Non-Goals

### Goals

| # | Goal | Success criterion link |
| --- | --- | --- |
| 1 | {What must be true when this dash is done} | {§1.6 criterion or metrics row} |

### Non-goals

| # | Out of scope | Why |
| --- | --- | --- |
| 1 | {What this dash will not change} | {Reason} |

---

## 3. Primary User

| Field | Value |
| --- | --- |
| **Role** | {Primary role} |
| **Job** | {What they are trying to accomplish} |
| **Context** | {When and where they encounter this} |
| **Secondary roles** | {If any} |

**In-scope objects (locked):**

| Object | Slug | Notes |
| --- | --- | --- |
| {Object Name} | {slug} | {Why in scope} |

**Sign-off:** see [sign-off-ledger.md](sign-off-ledger.md).

**Open questions:**

| # | Question | Owner | Blocks |
| --- | --- | --- | --- |
| 1 | {Question} | {name} | P4 / P5 / P6 / none |

---

## 4. Scenarios & flow

Filled after P4. Summary only; the full record is [flow.md](flow.md).

| Scenario | Maps to criterion | Pages touched |
| --- | --- | --- |
| {Name} | {Success criterion} | {Page list} |

**Reconciliation (Standard + High-stakes):**

| Divergence (user model ↔ system) | Resolution |
| --- | --- |
| {Divergence} | adapt UI language / library update / assumption + P8 test |

---

## 5. Concept selection

Filled after P5. Score tables live in [concept-choice.md](concept-choice.md).

| Field | Value |
| --- | --- |
| **Selected** | {Concept label} |
| **Rationale** | {1–2 sentences} |
| **Runner-up(s)** | {Label + why not} |
| **Selection Gate** | passed / deferred (Express debt) |
| **Scorecard** | [concept-choice.md](concept-choice.md) |

---

## See Also

* [scope.md](scope.md) — Success criteria and constraints
* [flow.md](flow.md) — Scenarios, pages, goal-page map
* [concept-choice.md](concept-choice.md) — P5 scorecard
* [assumptions.md](assumptions.md) — Assumption register
