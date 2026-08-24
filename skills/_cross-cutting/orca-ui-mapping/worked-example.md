# Worked Example — One Object, Five Contexts

Companion to `SKILL.md`. Shows the full three-pass translation for a single object (**Invoice**) across list, card, detail, dashboard, and selection contexts. Use it as a calibration reference: if your mapping output looks structurally different from this, justify why.

---

## The ORCA inputs (abbreviated)

> **Definition:** An **Invoice** is a request for payment issued to a customer for delivered work, tracking an amount due through a lifecycle from draft to settlement.

**Attributes (force-ranked, from step 8):**

| Rank | Attribute | Type | Notes |
|---|---|---|---|
| 1 | Number | String (`INV-2041`) | Primary identifier |
| 2 | Customer | Reference → Customer | Who owes |
| 3 | Amount due | Currency | What is owed |
| 4 | Status | Enum | Draft → Sent → Paid; Overdue derived; Void terminal |
| 5 | Due date | Date | When payment is expected |
| — | Issue date | Date | Context |
| — | Line items | Collection → Line Item | 1:many, typically 2–30 |
| — | Notes | Text | Long-form |
| — | PDF | File | Generated artifact |
| — | Created at / by | DateTime + ref | Metadata |

**CTAs (P/S/T/Q):** Send invoice **P** · Record payment **P** (detail only) · Download PDF **S** · Edit **T** (Draft only) · Duplicate **T** · Void **Q** · Delete draft **Q**

**Relationships:** Customer (many:1) · Line Items (1:many) · Payments (1:many)

---

## Context 1 — Invoice list page

**Intent mix:** compare + monitor. Density: high.

| Attribute | Visual role | Representation |
|---|---|---|
| Number | Identity | First column, monospace |
| Customer | Distinguisher/context | Link column |
| Amount due | Primary data | Right-aligned tabular numerals |
| Status | Status | Badge: label + shape + color |
| Due date | Primary data (monitor) | Relative when overdue-near ("due in 3d"), absolute otherwise |
| Issue date, notes, PDF, created-at | Omitted / metadata | Detail page only |

**Representation choice:** table, not cards — comparison of amounts and statuses across many instances is the dominant intent.

**Actions:** row-level: Open (implicit via row link), overflow menu with Download PDF (S→T demotion in dense context). Row actions stay quiet — no filled buttons per row, however legal each instance's tier is. Page-level: New invoice (P) is the screen's only filled control. Void/Delete never appear here.

```html
<!-- layer: collection | object: invoice | component-hint: data-table
     ui-rule: DISPLAY_COMPARABLE_RECORDS,COLLECTION_SORT
     intents: compare+monitor | interaction: standard -->
```

## Context 2 — Invoice card nested on Customer detail

**Intent mix:** recognize + monitor. Density: low.

| Attribute | Visual role | Representation |
|---|---|---|
| Number | Identity | Card title |
| Amount due | Primary data | Prominent value |
| Status | Status | Badge |
| Due date | Context | Muted metadata line |
| Customer | Dropped | Redundant — parent context already establishes it |

**Representation choice:** compact card in a 1:few section ("Recent invoices"). Dropping Customer here is the shapeshifter principle: the parent page *is* the customer.

**Actions:** Open (P), Record payment (S — frequent from this surface), overflow: Download PDF.

## Context 3 — Invoice detail page

**Intent mix:** decide + manipulate. Density: medium, sections over rows.

| Zone | Content |
|---|---|
| Header | Number (h1), status badge, amount due as the visual anchor |
| Context row | Customer link · issue date · due date · PDF download |
| Body | Line items as an editable sub-table (1:many, bounded) |
| Disclosure | Notes (`ORG_DISCLOSE_SUPPLEMENTAL`), audit metadata (created at/by) |

**Actions:** header action bar — Send or Record payment (P, state-dependent), Download PDF (S), Edit/Duplicate (T), overflow: Void, Delete draft (Q with confirmation).

**Note:** the two P-tier actions split by state — Draft invoices show Send as P; Sent invoices show Record payment as P. PSTQ is state-aware.

## Context 4 — Finance dashboard tile

**Intent mix:** monitor + decide. Density: minimal.

| Attribute | Visual role | Representation |
|---|---|---|
| Aggregate: outstanding total | Primary data | Large numeral |
| Count overdue + count due-this-week | Status/monitor | Two labeled indicators with distinct shapes |
| Trend of issued vs paid | Candidate visualization | **Gate:** is there a trend question users actually ask? If yes → sparkline/line via `dataviz-selection`; if no → omit |

**Actions:** none beyond navigation. "View all invoices" link. Manipulation is deliberately absent — dashboards orient, they don't operate.

## Context 5 — Bulk selection mode

**Intent mix:** recognize + manipulate (batch). Density: reduced columns.

| Change vs. list | Decision |
|---|---|
| Checkbox column appears | Selection affordance, first column |
| Columns reduce to Number, Customer, Amount, Status | Comparison needs only; everything else hides |
| Row actions disappear entirely | Replaced by one bulk bar: Download PDFs (S), Send selected (P), Void (Q, confirmation) |

**Rule applied:** instance CTAs collapse into checkbox + bulk bar; destructive stays Q even in bulk.

---

## Schema-rendering contrast

What a schema-mirroring agent produces vs. the mapped result:

| Aspect | Schema render | Mapped result |
|---|---|---|
| List | All 10 attributes as columns, DB order | 5 columns ranked by scan value |
| Every context | Same fields everywhere | Roles shift per context (Customer dropped on its own page) |
| Status | Plain text field | Badge with shape + label |
| Dashboard | Table of recent invoices | Aggregate tile + indicators |
| Actions | Every CTA on every row | Tiered per layer and context |
| Created-at | Visible column | Disclosure only |
