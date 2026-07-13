# Law-hub — Product Requirements

**Dash slug:** law-hub-2026-07
**Date:** 2026-07-13
**Tier:** High-stakes
**Status:** Draft

---

## 1. Context & background

### 1.1 What law-hub is

Law-hub is Green Loom's shared regulatory intelligence layer: the system of record for authoritative source documents, versioned rules, jurisdiction relationships, applicability logic, evidence requirements, and provenance. Every other Green Loom module that touches compliance, permitting, purchase limits, or operational rules will consume law-hub's evaluated outcomes through a stable evaluation contract instead of duplicating legal logic.

The first end-to-end application of law-hub is launch eligibility for cannabis founders: can a proposed adult-use dispensary open at a specific address, under a specific business model and product mix, and if so, what evidence does it need before opening?

### 1.2 Why it exists

U.S. cannabis compliance for a dispensary is governed simultaneously by federal law, state licensing and product rules, county rules for unincorporated areas, city permitting and zoning, and site-specific facts such as parcel location, certificate of occupancy, security layout, and health and fire clearances. California's Department of Cannabis Control documents that only 47% of cities and counties allow at least one type of cannabis business, and 56% do not allow any retail cannabis business. Los Angeles County prohibits all commercial cannabis activity in unincorporated areas even though California state licensure exists. Denver applies parcel-level proximity and zoning restrictions on top of state and local licensing requirements.

Founders attempting to navigate this typically expect "a spreadsheet of what's legal in each state." The system reality is a layered, conditional, evidence-gated graph. A state-legal activity can be prohibited at the county layer, permitted at the city layer but only at certain parcels, or allowed in principle but blocked until documentary proof is present.

No existing tool models this for cannabis. The research basis for law-hub's domain model, jurisdiction stack, and rule schema is `law-hub/docs/research/legal-research.md`. The validated object model is published in `docs/object-library/artifacts/object-discovery.mdx`.

### 1.3 Position within Green Loom

Law-hub is a distinct pre-launch founder product within Green Loom — not a workflow inside Green Loom Rules. It solves a different problem (can I launch?) for a different user (the founder who does not yet have a license) at a different time horizon (pre-opening, not daily retail operations). Downstream modules, including Green Loom Rules for operational purchase limits and delivery constraints, will subscribe to law-hub's evaluation contract once the shared platform is stable.

### 1.4 MVP question

> Can I open an adult-use storefront or delivery-enabled dispensary at this address, for these products, and what evidence do I need before launch?

---

## 2. Problem statement

Cannabis founders cannot reliably determine whether a proposed dispensary is legally launchable without engaging specialized legal counsel or manually reading dozens of conflicting federal, state, county, and city sources. The five-layer governance stack — federal overlays, state licensing, county rules, city permitting, and site-specific evidence requirements — means that state-level legality tells founders almost nothing about site-level launchability. Unresolved local prohibitions, missing parcel facts, or absent documentary proof all produce the same surface symptom — founders waste months and thousands of dollars pursuing non-viable locations or miss prerequisites that block final inspection. Without a system that reasons across the full stack and surfaces source-cited, explainable, human-reviewable determinations, founders either over-rely on informal advice or incur prohibitive counsel fees for questions a well-structured rules system could answer.

**Confidence:** High
**Evidence sources:** Legal Research Report (`law-hub/docs/research/legal-research.md`) — primary-source analysis of CA DCC, LA County prohibition, Denver parcel rules, Michigan admin rules; Object Discovery SIP validation (`docs/object-library/artifacts/object-discovery.mdx`) — mental model gap documented; Green Loom landing page discovery (`design-dash/dashes/green-loom-landing-2026-07/scope.md`) — founder-operator as primary target user.

---

## 3. Goals

### 3.1 Primary goals

1. Enable a founder to enter a proposed location, business model, and product mix and receive an accurate, source-cited Launch check (`allowed`, `prohibited`, `conditional`, or `incomplete`) with an explainable layered reason chain, within a single session.
2. Enable a founder with a non-`allowed` result to generate a Launch plan: an ordered, source-cited evidence checklist that tells them exactly what to obtain and prove before opening.
3. Enable legal analysts to capture, extract, review, approve, publish, and version Rules from authoritative sources, producing an auditable knowledge corpus that drives all decisions without manual duplication.
4. Deliver a shared evaluation contract that any Green Loom module can consume to get a typed outcome, reason chain, provenance, and staleness status, without embedding legal logic in the consuming module.
5. Demonstrate that the platform's quality is trustworthy: every production result is reproducible, every reason is traceable to an approved rule and pinpoint source citation, and zero `allowed` outcomes appear on blocking golden scenarios.

### 3.2 Non-goals (explicitly out of scope for MVP)

- Full 50-state rule corpus. MVP coverage is federal + California, Colorado, Michigan, and the localities listed in §3.3.
- Tribal jurisdiction rules.
- Private lease and covenant review, which requires interpretation of non-public documents.
- Manufacturing-only and wholesale distribution workflows; law-hub models retail dispensary launch.
- Ongoing retail operational compliance (daily reporting, sales-limit enforcement at point-of-sale, inventory reconciliation) — that is Green Loom Rules' scope.
- Replacing legal counsel for ambiguous local code interpretation; law-hub flags ambiguity and hands off.
- National manufacturing, hemp cultivation, and multi-state operator licensing workflows.
- Consumer-facing public API with external SLA in MVP.

### 3.3 MVP jurisdiction coverage

| Layer | Coverage |
|---|---|
| Federal | DEA scheduling, IRS §280E, FinCEN banking guidance, USPS hemp mailing, USDA hemp program, FDA delta-8 and cannabinoid product position |
| State | California, Colorado, Michigan |
| Local | City of Los Angeles, unincorporated Los Angeles County, Denver, Detroit, plus two additional localities selected for source accessibility during corpus build |

---

## 4. Users

### 4.1 Primary users — Founders

**Role:** Cannabis founder evaluating launch eligibility before licensure
**Context:** Pre-license planning phase; may be at idea stage, site-scouting, or actively applying for state licensure; does not yet have operational staff or compliance infrastructure
**Goals:**
- Know whether their proposed location and business model are legally viable before spending on lease or licensure fees
- Understand what evidence and permits they need to collect, in order
- Share the analysis with an attorney without losing source citations
- Re-evaluate quickly if they change the address, model, or product mix

**Pain points today:**
- No single system reasons across the full five-layer jurisdiction stack
- State licensing websites do not explain local prohibitions
- Generic cannabis compliance guides are not tied to a specific address
- Legal counsel is expensive; founders defer questions until too late
- Answers go stale when rules change, with no automated notification

### 4.2 Legal analysts

**Role:** Compliance reviewer or legal analyst responsible for maintaining the rule corpus
**Context:** Internal or contracted; works in law-hub's analyst interface to ingest source documents, extract rules, review extractions, approve publication, monitor source changes, and manage impact
**Goals:**
- Maintain an auditable, source-accurate rule corpus
- Review and approve rules before they drive founder-facing outcomes
- Identify when source documents change and which decisions are affected
- Roll back a ruleset release if a published rule was incorrect

**Pain points today:**
- No structured workflow for converting legal texts into machine-evaluable rule records
- No audit trail connecting a decision outcome to the exact source version used
- No tooling to detect source changes and assess downstream decision impact

### 4.3 Secondary users and stakeholders

| Role | How affected | Notes |
|---|---|---|
| **Approvers** | Must independently sign off on high-impact rule publications | Separated from rule authors to prevent single-person errors on blocking rules |
| **Platform admins** | Manage roles, retention policies, jurisdiction registry, and ruleset publishing | Internal Green Loom team role |
| **Downstream module owners** (Green Loom Rules, etc.) | Consume law-hub evaluation outcomes via the evaluation contract | Will integrate after the launch-eligibility vertical slice is stable |
| **Attorneys and advisors** | Receive shared Launch plans with counsel-handoff flags | Consume exports; do not log in to law-hub directly in MVP |

---

## 5. Object model summary

Full object guides are in `docs/object-library/objects/`. All ten objects are SIP-validated from `docs/object-library/artifacts/object-discovery.mdx`.

| Object | Definition | Key attributes | Key actions |
|---|---|---|---|
| **Jurisdiction** | A governing authority at federal, state, county, city, or site level that issues rules and permits | `jurisdiction_id`, `level` (federal/state/county/city/site), `parent_id`, `authority_type` | View rule corpus, compare local opt-in status, resolve address to stack |
| **Rule** | A versioned, machine-evaluable legal statement tied to a source and policy domain | `rule_id`, `policy_domain`, `rule_type`, `machine_effect`, `applicability`, `severity`, `effective_start`, `review_status` | View source, add exception, approve extraction, deprecate version |
| **Source Document** | An authoritative published source that anchors rule provenance and citations | `source_document_id`, `publisher`, `source_kind`, `publication_date`, `uri`, `checksum`, `officialness_rank` | Pin citation, diff source, view linked rules, rank officialness |
| **Evidence Requirement** | A documentary proof item a rule requires before launch or continued operation | `evidence_id`, `evidence_type`, `issuer`, `validity_rule` | Upload artifact, mark satisfied, flag missing, verify evidence |
| **Business Model** | A first-class venture type (storefront, delivery, marketplace, etc.) | `business_model_id`, `license_family` | Select business type, compare rule surface, view applicable rules |
| **Product Category** | A normalized internal product type with jurisdiction-specific label mappings | `product_category_id`, `normalized_definition`, `jurisdiction_specific_label` | Select product types, map to jurisdiction term, view applicable rules |
| **Site** | A physical location with address, parcel facts, and jurisdiction membership | `address`, `jurisdiction_stack`, `parcel_facts`, `zoning_district` | Verify jurisdiction, measure proximity, edit location, view parcel facts |
| **Facility** | A proposed cannabis venture being evaluated for launch eligibility (UI: "Venture") | `facility_id`, `name`, `site_id`, `business_model_id`, `product_category_ids`, `latest_decision_id` | Run evaluation, save draft, share plan, edit product mix, change address |
| **Decision** | A point-in-time compliance evaluation with status and explainable reason chain (UI: "Launch check") | `decision_id`, `status` (allowed/prohibited/conditional/incomplete), `why`, `missing_evidence`, `as_of` | Explain launch check, export launch check, re-run evaluation, generate compliance plan |
| **Compliance Plan** | A source-cited launch checklist aggregating decisions, evidence gaps, and rule citations (UI: "Launch plan") | `plan_id`, `checklist_items`, `evidence_tracker`, `cited_rules`, `open_questions`, `generated_at` | Download PDF, share with counsel, track progress, upload evidence, refresh plan |

### Deferred objects (no standalone guide in MVP)

Policy Archetype (glossary term), License (nested under Evidence Requirement), Rule Version (nested under Rule), RuleOverride/RuleException/RuleDependency/Applicability (MCSFD relationship specs on Rule), CitationPin (attribute on Source Document), Decision Reason (nested on Decision), ParcelFact (nested on Site).

---

## 6. Flows & scenarios

### Scenario F-1: Founder discovers a location is prohibited

**Trigger:** Founder enters an address in unincorporated Los Angeles County
**Actor:** Founder

**Steps:**
1. Founder creates a new Venture, names it, and enters the proposed address.
2. System geocodes the address and resolves it to the federal → California → Los Angeles County (unincorporated) jurisdiction stack.
3. Founder selects "Storefront" business model and "Flower, Edibles" product categories.
4. Founder runs the Launch check.
5. Engine evaluates federal overlays, California state rules, and then the Los Angeles County prohibition rule (`la.unincorporated.prohibition.current`). County prohibition triggers `prohibited` at the local layer.
6. Decision returns `prohibited` with the county prohibition as the top reason, citing the LA County Office of Cannabis Management source document.
7. Founder views the reason chain, sees "All commercial cannabis activity is prohibited in unincorporated Los Angeles County," and clicks "View source" to read the authority.
8. Founder changes the address to an incorporated City of Los Angeles address and re-runs the evaluation.

**Outcome:** Founder receives a `conditional` result for the LA city address, with city operating permit and evidence items listed.
**Edge cases:**
- Geocoding cannot confirm whether an address is incorporated or unincorporated → decision returns `incomplete` with a flag asking the founder to confirm jurisdiction manually.
- Address resolves to a city that has not opted in to cannabis retail → `prohibited` with city non-allowance as the reason.

---

### Scenario F-2: Founder works through a conditional Denver storefront

**Trigger:** Founder with an existing address in Denver wants a full Launch check
**Actor:** Founder

**Steps:**
1. Founder creates Venture for "Denver adult-use storefront" at a specific Denver address.
2. System resolves the address to federal → Colorado → Denver jurisdiction stack.
3. Founder selects "Storefront" business model and "Flower, Concentrate" product categories.
4. Engine runs: federal overlays pass with warnings on banking and tax; Colorado state licensing is available; Denver parcel proximity check identifies that the location is within the 1,000-foot buffer of a school.
5. Decision returns `conditional`. Reason chain shows: federal banking advisory (FinCEN), Colorado state license available, Denver zoning restriction (buffer proximity).
6. Founder generates a Launch plan. The plan shows: (1) verify alternative address or variance process, (2) obtain Colorado state license, (3) obtain Denver local license and pass parcel verification, (4) prepare premises and security diagrams for application, (5) obtain certificate of occupancy.
7. Each plan item cites the applicable rule and source document pin.
8. Founder downloads the PDF and shares it with their attorney using the "Share with counsel" link.

**Outcome:** Attorney receives the plan with all citations intact and a disclaimer. Attorney can flag the buffer issue for independent analysis.
**Edge cases:**
- Rule version for Denver buffer distance changes during an active plan → plan is marked stale with a prompt to refresh.
- Founder selects a second address outside the buffer → re-evaluation returns `conditional` without the buffer reason, showing only the remaining evidence items.

---

### Scenario F-3: Founder uploads evidence and re-runs

**Trigger:** Founder has a `conditional` or `incomplete` Launch check and has obtained their certificate of occupancy
**Actor:** Founder

**Steps:**
1. Founder opens the active Launch plan for their Detroit dispensary.
2. Plan shows "Certificate of occupancy" as a missing required evidence item.
3. Founder uploads the certificate of occupancy (CO) through the evidence tracker.
4. System marks the Evidence Requirement as satisfied.
5. Founder clicks "Re-run evaluation."
6. Engine re-evaluates with updated evidence status. CO requirement is now satisfied; remaining unsatisfied items are the state track-and-trace readiness and local health permit.
7. Decision updates from `incomplete` to `conditional`; the compliance plan checklist updates accordingly.

**Outcome:** Founder can see their remaining steps clearly and continue uploading evidence one item at a time.
**Edge cases:**
- Uploaded evidence has an expired validity date → system flags the item as expiring, not satisfied.
- Evidence upload fails (file too large, unsupported format) → system shows error with accepted formats and file size limit; previous evidence state is unchanged.

---

### Scenario A-1: Analyst ingests a new source document and extracts rules

**Trigger:** California DCC publishes revised regulations; analyst is notified by monitoring feed
**Actor:** Legal Analyst

**Steps:**
1. Analyst opens the change inbox. An item appears flagged "California DCC Regulations — section-level diff detected" with affected policy domains: track-and-trace, packaging, advertising.
2. Analyst registers the revised document: enters publisher (CA DCC), source kind (regulation), effective date, checksum, and URI. System generates a new Source Document record.
3. Analyst opens the extraction view for the track-and-trace section. The prior Rule record (`ca.tracktrace.reconcile.15051`) appears alongside the source diff.
4. Analyst edits the rule: updates `effective_start`, adjusts the `value` field (reconciliation frequency changed from 30 days to 21 days), confirms citation text and pin.
5. Analyst saves the extraction as a new Rule Version with status `reviewed`.
6. Analyst submits the rule version for approval. A separate Approver reviews the diff, the source pin, and the impact report (decisions affected: 4 Detroit ventures evaluated before the effective date).
7. Approver signs off. Rule Version status moves to `approved`. Ruleset is queued for publication.
8. After publication, system identifies the 4 dependent decisions and marks them `superseded`, sending staleness alerts to affected Founders.

**Outcome:** Rule corpus reflects the updated regulation before its effective date; founders with affected decisions are notified.
**Edge cases:**
- Source document is not yet machine-readable (scanned PDF) → analyst marks the document as "requires manual extraction" and enters the rule manually with a note in the citation text.
- Approver rejects the extraction due to ambiguous statutory language → rule version returns to `reviewed` status with rejection notes; analyst escalates to counsel handoff.

---

### Scenario A-2: Analyst rolls back a ruleset release

**Trigger:** A published rule contained a mistake in the applicability filter (wrong license family)
**Actor:** Approver + Analyst

**Steps:**
1. Approver identifies that rule `mi.sales.limit.adultuse.420.506` was inadvertently marked as applying to medical license families as well as adult-use.
2. Approver initiates rollback. System records the rollback event with actor, timestamp, and reason.
3. Prior approved ruleset is restored as active. The erroneous release is archived (not deleted) with its audit record.
4. System identifies decisions computed during the erroneous release window. Those decisions are flagged `stale` and their founders receive change-impact alerts.
5. Analyst corrects the applicability filter, submits a new version for review, and the corrected release is published.

**Outcome:** No decisions from the erroneous window are shown as `allowed` without re-evaluation. Audit trail is complete.
**Edge cases:**
- Rollback is triggered during an active evaluation request → in-flight request either completes against the prior ruleset or returns an error; partial results are not persisted.

---

### Scenario A-3: Source change affects a blocking rule

**Trigger:** System detects a diff in the Denver marijuana facility location guide
**Actor:** System → Analyst

**Steps:**
1. Source monitor detects a checksum change on the Denver location guide source document.
2. System extracts the section-level diff and classifies impact: the buffer distance for alcohol/drug treatment facilities changed from 1,000 feet to 1,500 feet.
3. Item enters analyst inbox ranked by severity (blocking rule change, 3 active Ventures with `conditional` Denver decisions may be affected).
4. Analyst opens the change review, sees the diff and affected decisions, and confirms or adjusts the extracted rule change.
5. After approval and publication, system re-evaluates the 3 affected decisions. One changes from `conditional` to `prohibited`. Its founder receives a staleness alert with the updated reason.

**Outcome:** Founders are not left relying on stale `conditional` outcomes when a blocking rule tightened.
**Edge cases:**
- Diff is a formatting change, not substantive → analyst marks "no rule change required" and closes the inbox item.

---

## 7. Page / screen requirements

### Surface 1: Founder — Venture dashboard

**Hub object:** Facility
**Entry points:** Green Loom main navigation — "Ventures" (primary) or direct URL

**Attributes shown:**

| Attribute | Why shown | Format | Editable? |
|---|---|---|---|
| Venture name | Identification | Plain text | No (click to edit in detail) |
| Address snippet | Location at a glance | Street + city abbreviation | No |
| Latest Launch check status | Quick assessment | Status badge: Allowed / Prohibited / Conditional / Incomplete | No |
| As-of date | Freshness signal | "As of [date]" in secondary text | No |
| Evidence completion | Progress indicator | Percentage with ring | No |
| Staleness flag | Alerts founder to re-run | "Stale — rules changed" banner if applicable | No |

**Actions available:**

| Action | Priority | Trigger | Outcome |
|---|---|---|---|
| Create new Venture | Primary | Button in empty state or page header | Opens Venture setup wizard |
| Run evaluation | Primary | Card button — shown when Venture is Ready but no current Decision | Submits to engine, shows loading state, delivers Decision |
| View Launch check | Primary | Card button — shown when Decision exists | Opens Decision detail |
| View Launch plan | Primary | Card button — shown when Plan exists | Opens Compliance Plan detail |
| Re-run evaluation | Secondary | Inline action or from stale banner | Re-submits to engine |
| Edit Venture | Secondary | Overflow menu | Opens Venture detail for editing |

**Edge states:**

- **Empty state:** "You have no Ventures yet. Start by entering a proposed location." with a "Create Venture" primary CTA.
- **Loading state:** Skeleton cards while Ventures load. Decision loading: spinner with "Running launch check…" text.
- **Error state:** Engine failure shows "Launch check could not complete — try again or contact support" with retry option. Prior Decision, if any, is preserved.
- **Stale state:** Card shows amber banner "Rules have changed since this check was run. Re-run to update."
- **At-scale state:** Paginate beyond 20 Ventures; sort by last-modified descending by default; allow search by name or address.

---

### Surface 2: Founder — Venture setup wizard

**Hub object:** Facility
**Entry points:** "Create Venture" from dashboard; "Edit Venture" from detail

**Steps:**
1. **Name and address** — Venture working name; address input with geocoding confirmation and jurisdiction stack preview.
2. **Business model** — Single-select from Storefront, Pickup, Delivery, Marketplace. Show applicable license family. Disabled options for business models not supported in the resolved jurisdiction.
3. **Product mix** — Multi-select normalized product categories: Flower, Edible, Concentrate, Vape / Inhalable, Hemp / CBD, Delta-8 THC, Other. Show jurisdiction-specific label and applicable federal overlay warnings where relevant (e.g., Delta-8 THC FDA advisory, Hemp / CBD USDA and USPS constraints).
4. **Known evidence** — Optional. Founder can indicate which Evidence Requirement items they already hold (certificate of occupancy, state license application filed, etc.). Drives `incomplete` vs `conditional` distinction before full evaluation.
5. **Review and run** — Summary of all inputs with edit links. "Run launch check" primary action.

**Edge states:**

- **Geocoding failure:** "We could not confirm the jurisdiction for this address. Please verify the city and county manually." Wizard continues with a jurisdiction-confirmation override.
- **Unsupported jurisdiction:** If address resolves to a jurisdiction outside current coverage, a notice appears: "Law-hub currently covers federal, California, Colorado, Michigan, and select localities. Results for this jurisdiction are not yet available." Draft is saved; evaluation is blocked.
- **Session drop:** In-progress wizard state persists to draft; Venture status is `Draft` until all required fields are complete.
- **Required field missing:** Evaluation button disabled with inline validation explaining what is needed.

---

### Surface 3: Founder — Launch check (Decision detail)

**Hub object:** Decision
**Entry points:** "View Launch check" from Venture dashboard card; "Explain launch check" from any Decision reference

**Attributes shown:**

| Attribute | Why shown | Format | Editable? |
|---|---|---|---|
| Decision status | Primary outcome | Large status badge with color and icon | No |
| As-of date and ruleset version | Reproducibility and freshness | "Evaluated [date] using ruleset v[n]" | No |
| Reason chain | Explanation of outcome | Ordered list from federal to site, each reason expanding to show rule title, policy domain, machine effect, and source citation | No |
| Missing evidence list | Tells founder what's needed | Evidence Requirement items with type and issuer | No |
| Confidence indicator | Source quality signal | high / medium / low based on underlying rule review status | No |
| Not-legal-advice disclaimer | Legal boundary | Persistent footer notice | No |

**Actions available:**

| Action | Priority | Trigger | Outcome |
|---|---|---|---|
| Expand reason | Primary | Click reason row | Shows rule detail: title, citation, effective dates, source link |
| View source | Primary | Link in expanded reason | Opens Source Document citation pin |
| Generate Launch plan | Primary | Button — shown when status is conditional or incomplete | Creates Compliance Plan |
| Re-run evaluation | Secondary | Button | Re-submits current Facility inputs |
| Export launch check | Secondary | Button | PDF or JSON download with all reasons and citations |
| Flag for review | Tertiary | Overflow menu | Sends a counsel-review flag with founder note |

**Edge states:**

- **Stale state:** Banner "This launch check is based on rules that have since been updated. Re-run to see the latest result." Previous status is shown with reduced emphasis.
- **Low-confidence state:** Notice "One or more rules in this check have not been independently approved. Results should be considered preliminary." Confidence shown as "Low."
- **Reason chain empty:** If the engine returns no applicable rules (possible for an unsupported jurisdiction combination), show "No applicable rules found for this combination. Check jurisdiction coverage."
- **Export error:** Retry prompt; explain that the export may take a few seconds for large reason chains.

---

### Surface 4: Founder — Launch plan (Compliance Plan detail)

**Hub object:** Compliance Plan
**Entry points:** "Generate Launch plan" from Decision detail; "View Launch plan" from Venture dashboard

**Attributes shown:**

| Attribute | Why shown | Format | Editable? |
|---|---|---|---|
| Plan title | Identification | Derived from Venture name + model | No |
| Completion progress | Motivation and status | Progress ring + "N of M items complete" | No |
| Checklist items | Ordered requirements | Grouped by policy domain; each item shows requirement title, rule citation, issuer, status badge, and upload slot | Status only |
| Open questions | Ambiguities for counsel | Highlighted section with explanation and counsel-handoff recommendation | No |
| Stale banner | Freshness alert | Shown when Decision or underlying rules are outdated | No |
| Disclaimer | Legal boundary | Persistent banner: "This plan is not legal advice." | No |
| Generated at / last updated | Audit trail | DateTime | No |

**Actions available:**

| Action | Priority | Trigger | Outcome |
|---|---|---|---|
| Upload evidence | Primary | Button on each checklist item | Attaches file to Evidence Requirement; marks item as uploaded pending verification |
| Mark satisfied | Primary | Checkbox on checklist item | Marks the item complete; triggers re-evaluation prompt if it clears a blocking requirement |
| Download PDF | Primary | Page header button | Generates branded PDF with full checklist, citations, and disclaimer |
| Share with counsel | Secondary | Page header button | Creates a secure, expiring share link; recipient sees plan with disclaimer prominently displayed |
| Track progress | Secondary | Native to checklist — in-place | Updates completion ring |
| Refresh plan | Secondary | Button in stale banner | Re-generates plan from current Decision |

**Edge states:**

- **Stale:** Banner shown when Decision is superseded or underlying rules changed. "Rules have been updated. Refresh this plan to reflect the latest requirements."
- **All items complete:** Plan shows "Launch requirements met" with a summary and a reminder that a licensed attorney should review before opening.
- **Empty items:** If the Decision was `allowed` with no outstanding evidence, plan shows a confirmation that no additional items are required for the checked jurisdictions, with a disclaimer.
- **Upload failure:** Error message with accepted file types and size limit; item status remains unchanged.

---

### Surface 5: Analyst — Source registry and source detail

**Hub object:** Source Document
**Entry points:** Analyst navigation — "Sources"

**Registry view attributes:**

| Attribute | Why shown | Format | Editable? |
|---|---|---|---|
| Publisher | Identification | Text | No |
| Source kind | Classification | Badge: statute / regulation / bulletin / permit page / ordinance | No |
| Publication date | Recency | Date | No |
| Retrieved at | Freshness | DateTime with age indicator | No |
| Checksum status | Change detection | "Current" / "Changed" / "Diff available" | No |
| Linked rules count | Scope | Integer | No |
| Review status summary | Corpus health | "N approved / M extracted" | No |

**Source detail includes:** immutable snapshot access, full metadata, citation pins, linked rules list, change history log, and a diff viewer comparing current to prior snapshot.

**Edge states:**

- **Unavailable source:** Document could not be fetched at last attempt. Shows "Unavailable — last retrieved [date]." Links still preserved; extraction workflow continues against stored snapshot.
- **Checksum changed:** Shows diff-available badge; routes to analyst inbox automatically.

---

### Surface 6: Analyst — Ingestion and change inbox

**Hub object:** Source Document (for new sources); Rule (for change reviews)
**Entry points:** Analyst navigation — "Inbox"

**Attributes shown per inbox item:**

| Attribute | Why shown | Format |
|---|---|---|
| Source name | Identification | Text |
| Impact classification | Priority routing | Critical / Blocking / Advisory / Informational |
| Affected jurisdictions | Scope | Comma-separated jurisdiction names |
| Affected decisions | Downstream risk | "N decisions may be affected" |
| Source kind | Context | Badge |
| Age in inbox | SLA tracking | "X days ago" |

**Actions available:**

| Action | Priority | Trigger |
|---|---|---|
| Open change review | Primary | Row click |
| Assign to analyst | Secondary | Overflow |
| Mark no rule change | Secondary | Inline button for formatting-only diffs |
| Escalate to counsel | Tertiary | Overflow — for ambiguous interpretation |

---

### Surface 7: Analyst — Rule editor

**Hub object:** Rule
**Entry points:** Extraction workflow from inbox; "Add exception" from rule detail; direct navigation from rule registry

The rule editor enables structured entry of all Rule attributes, including: title, policy domain, rule type, machine effect, operator, value, unit, applicability (jurisdiction + business models + product categories + license families), exceptions, dependencies, overrides, evidence hooks, effective dates, severity, and citation text/pin. The source document citation and exact source text are displayed alongside the editor.

**Key requirements:**
- Every required field must be validated before the rule version can be saved as `reviewed`.
- The applicability field must resolve to at least one known jurisdiction, business model, or product category from the registry; free-text entries are rejected.
- Effective start date is required; effective end may be null for open-ended rules.
- The machine effect enum (`allow`, `deny`, `require`, `warn`, `compute`) controls downstream conflict resolution behavior and is treated as a high-impact field requiring explicit confirmation on change.

---

### Surface 8: Analyst — Review comparison and approval

**Hub object:** Rule (pending version)
**Entry points:** Inbox item → Change review

**Layout:** Side-by-side view of prior approved version and proposed version, with a structured diff highlighting changed fields.

**Attributes shown:**
- All rule fields, with changed fields highlighted
- Section-level source document diff (what changed in the underlying text)
- Impact analysis: decisions that would change outcome status under the new version (simulated, not published)
- Test scenario results against the new version

**Actions available:**

| Action | Permission | Outcome |
|---|---|---|
| Approve | Approver (must differ from extraction author) | Moves version to `approved`; queues for next ruleset publication |
| Reject with notes | Approver | Returns version to `reviewed`; notes recorded for analyst |
| Request clarification | Approver | Adds a discussion thread to the rule record |

**Edge states:**
- **Approval attempted by author:** System rejects with "The analyst who authored this extraction cannot approve it. Assign a different approver."
- **Impact simulation unavailable:** "Impact analysis could not complete. Proceed only if you have manually reviewed affected decisions."

---

### Surface 9: Analyst — Ruleset release view

**Hub object:** Ruleset release
**Entry points:** Analyst navigation — "Releases"

Shows all approved rule versions queued for the next release, prior release history, and the ability to publish or rollback. Each release record shows the set of rules included, who published it, when, validation results, and the rollback link.

**Key requirements:**
- At least one approved rule must be present to publish.
- Validation must pass before publication: schema correctness, referential integrity (all referenced rule IDs and source document IDs exist), no orphaned applicability entries.
- Rollback restores the prior release atomically; erroneous release is archived with a rollback reason and actor record.
- Rollback triggers automatic staleness flagging for all decisions computed during the erroneous release window.

---

### Surface 10: Analyst — Decision inspector

**Hub object:** Decision
**Entry points:** Analyst navigation — "Decisions"; from impact analysis in review comparison

Enables analysts to replay a specific decision request (facility inputs + `as_of` time) against any ruleset version, trace each reason, and compare outcomes between the current corpus and a candidate release.

**Key requirements:**
- All decision replays produce the same outcome for the same inputs, ruleset, and `as_of` time (determinism requirement).
- Replay history is not shown to founders; it is an analyst audit tool.

---

## 8. Acceptance criteria

### Founder experience

- [ ] Given a founder enters a valid address that geocodes to unincorporated Los Angeles County, when they run a Launch check, then the Decision status is `prohibited` and the top reason cites the LA County prohibition rule with a link to the source document.
- [ ] Given a founder enters a valid Denver address within 1,000 feet of a school, when they run a Launch check, then the Decision status is `conditional` and the reason chain includes the Denver proximity restriction with its source citation.
- [ ] Given a founder runs a Launch check on a fully verified, evidence-complete Michigan adult-use storefront address with no active prohibitions, when the engine evaluates, then the Decision status is `allowed` and all applicable rules in the reason chain are in `approved` review status.
- [ ] Given a founder's Venture inputs are incomplete (missing product categories), when they attempt to run a Launch check, then the run button is disabled with an inline message explaining what is required.
- [ ] Given a founder has a `conditional` or `incomplete` Decision, when they generate a Launch plan, then the plan contains one checklist item per unsatisfied Evidence Requirement, each citing at least one approved Rule and its source document pin.
- [ ] Given a founder uploads an evidence document for a checklist item and marks it satisfied, when they re-run the Launch check, then the re-run no longer lists that Evidence Requirement in `missing_evidence`.
- [ ] Given a founder's Launch plan is stale because the underlying ruleset changed, when they view the plan, then a visible banner warns them and provides a one-click "Refresh plan" action.
- [ ] Given a founder exports a Launch check to PDF, then the PDF includes the decision status, as-of date, ruleset version, the complete reason chain with rule titles and citation text, and the "not legal advice" disclaimer.
- [ ] Given a founder shares a Launch plan with a counsel link, then the recipient can view the plan, all checklist items, citations, and open questions, with the disclaimer shown on every page, without logging in.
- [ ] Given a founder enters an address in a jurisdiction outside law-hub's current coverage, then the system displays a coverage notice explaining which jurisdictions are supported, and the Launch check run is blocked without producing a result.
- [ ] Given an address cannot be geocoded, then the system shows an error, allows the founder to confirm the jurisdiction stack manually, and documents the unconfirmed geocode status in the resulting Decision.

### Decision quality

- [ ] Given the same Facility inputs, the same `as_of` time, and the same approved ruleset version, when the Launch check is re-run, then the Decision status and complete reason chain are identical to the prior run (determinism).
- [ ] Given a blocking rule (e.g., a local prohibition, a missing required evidence item) applies to a Facility, when the engine evaluates, then the Decision is never `allowed` regardless of higher-layer permissions.
- [ ] Given two valid rules conflict on the same permission and one is more jurisdiction-specific, then the more specific rule takes precedence and the override relationship is recorded in the reason chain.
- [ ] Given a Rule version has `review_status: extracted` (not yet approved), when a Launch check is run in production, then the `extracted` rule version is excluded from the evaluation.
- [ ] Given a Facility has a Decision whose underlying rules changed after the `as_of` time, when the founder or system re-runs the evaluation, then a new Decision record is created; the prior Decision is retained as a historical record with status `superseded`.

### Analyst experience — source and rule lifecycle

- [ ] Given an analyst registers a new Source Document with all required fields (publisher, source kind, URI, checksum, effective date), when they save it, then an immutable record is created that cannot be overwritten, and a new-snapshot event is recorded in the source history.
- [ ] Given a source document's checksum changes on re-fetch, then the system creates a section-level diff and adds an inbox item classified by the impact severity of the linked rules.
- [ ] Given an analyst saves a rule extraction as `reviewed`, when an Approver views the review comparison, then they see: the proposed rule version, the prior approved version (if any), the source section diff, and the simulated impact on active Decisions.
- [ ] Given an Approver attempts to approve a rule they authored (same user), then the system rejects the approval with a message requiring a different approver.
- [ ] Given an Approver approves a rule version, when the ruleset is published, then the rule's `review_status` is `approved` and it is included in the evaluation corpus for decisions with `as_of` dates after the publication timestamp.
- [ ] Given an analyst deprecates a rule version with an effective end date, when a Decision is evaluated for any `as_of` time after the end date, then the deprecated version is excluded.

### Ruleset publication and rollback

- [ ] Given a ruleset release is published, when the system runs validation, then it must pass: schema correctness, referential integrity (all source_document_id references resolve), no unapproved rule versions, and at least one rule included.
- [ ] Given a ruleset release fails validation, then publication is blocked, the validation errors are shown to the analyst, and no change to the active corpus is made.
- [ ] Given an Approver initiates rollback, then the prior approved ruleset is restored atomically, the erroneous release is archived with the rollback actor, timestamp, and reason, and all Decisions computed during the erroneous window are flagged `stale`.
- [ ] Given rollback completes, then Founders whose Decisions changed status during the erroneous window receive a staleness notification.

### Safety, quality, and compliance

- [ ] Given any Decision is shown to a Founder, then the display must include the "as of" date, the ruleset version used, and a visible "not legal advice" disclaimer.
- [ ] Given a Decision reason chain includes a Rule with `confidence: low` (derived from unreviewed underlying rules), then the Decision displays a "Preliminary result — not all rules have been independently reviewed" notice.
- [ ] Given a Launch plan is generated, then every checklist item must link to at least one approved Rule, which in turn links to a Source Document with a valid citation pin.
- [ ] Given ambiguous local code interpretation is detected (flagged by an analyst during review), then the rule is published with a `counsel_flag: true` attribute, and any Decision citing that rule includes a "This item requires counsel review" flag in the reason chain.
- [ ] Given a Founder uploads evidence to a checklist item, then the evidence file is not stored in decision logs or audit events; only metadata (filename, upload timestamp, evidence_id, satisfaction status) appears in logs.
- [ ] Given a Facility is archived by a Founder, then its Decisions and Compliance Plans become read-only and their evidence attachments are subject to the configured retention policy.
- [ ] Given any user attempts an action outside their permission level (e.g., a Founder attempts to approve a rule), then the system returns an appropriate error and the action is not performed.

---

## 9. Open questions & assumptions

| # | Question / Assumption | Type | Confidence | Validation method |
|---|---|---|---|---|
| A-001 | Founders primarily access law-hub from desktop or tablet during planning; mobile is secondary | assumed | Medium | Analytics on session device after pilot; design for desktop-first, ensure mobile is not broken |
| A-002 | Two additional localities beyond LA, unincorporated LA, Denver, and Detroit will be selected for source accessibility during corpus build | assumed | Medium | Analyst assessment of primary source quality for candidate localities (e.g., Chicago, Portland) during foundation phase |
| A-003 | DEA federal rescheduling hearings (2026) will not produce a final federal rule before MVP beta launch | assumed | Medium | Monitor DEA rulemaking calendar; add a "pending federal change event" model to persist current vs. proposed federal status |
| A-004 | OPA/Rego can serve as the first runtime evaluator without exposing Rego as the authoring model | assumed | Medium | Implement California vertical slice against both OPA/Rego and the canonical rule model; validate performance and explainability |
| A-005 | Expert adjudicators can reach consensus on a golden scenario suite within the pilot window | assumed | Medium | Define adjudication protocol during foundation phase; track disagreement rate as an early signal |
| A-006 | Geocoding coverage is sufficient for the eight MVP localities without requiring parcel-level GIS infrastructure in v1 | assumed | Low | Test geocoding precision on a sample of 50 addresses across all localities; escalate to GIS integration if city/county boundary errors exceed 5% |
| A-007 | Analyst review cycle for a single rule extraction will typically take less than 48 hours, supporting a 3-business-day update SLA | assumed | Low | Measure during pilot; adjust process or staffing if actual cycle exceeds SLA |
| A-008 | Founders will tolerate a Launch check that takes up to 10 seconds before results appear | assumed | Medium | Usability pilot; display "Running check…" with intermediate progress if engine takes > 2 seconds |
| A-009 | Delta-8 THC and hemp/CBD product categories must be modeled separately from cannabis flower/edibles/concentrates in all rule applicability records | observed | High | Documented in legal-research.md (USDA, USPS, FDA, DEA sources); cannot be collapsed |
| A-010 | An Approver role distinct from extraction authors is feasible with MVP team size | assumed | Medium | Confirm team structure before beta; if single-person teams persist, document the risk and require documented acknowledgment per publication |

---

## 10. Success metrics

| Metric | Type | Baseline | Target (beta) | Measurement source |
|---|---|---|---|---|
| Expert agreement rate on golden scenario suite | North-star | No baseline (pre-launch) | ≥ 95% on adjudicated scenario set; 0 false `allowed` on blocking scenarios | Quarterly adjudication review vs. engine output |
| Decision determinism | North-star | No baseline | 100% identical outcome for identical inputs, ruleset version, and `as_of` time | Automated regression test suite run on every ruleset publication |
| Citation traceability | North-star | No baseline | 100% of production reason chain items link to an approved Rule version with a valid source document pin | Automated validation on every Decision persisted |
| Rule provenance completeness | Quality guardrail | No baseline | 100% of production Rule versions have: publisher, source kind, URI, citation pin, effective start, review history, and independent approval | CI validation on ruleset publication |
| Source change triage SLA | Operational | No baseline | Blocking/Critical source changes triaged within 1 business day; corrected release published within 3 business days unless counsel review required | Inbox item timestamps vs. publication timestamps |
| Founder session completion rate (wizard → Launch check) | Proxy | No baseline | ≥ 70% of started wizards reach a completed Launch check | Product analytics |
| Plan generation rate from conditional decisions | Proxy | No baseline | ≥ 60% of `conditional` and `incomplete` decisions lead to a Launch plan being generated | Product analytics |
| False `allowed` rate on blocking scenarios | Quality guardrail | No baseline | 0 | Golden scenario regression suite |
| Time to first Launch check result | User experience | No baseline | ≤ 10 seconds p95 from wizard completion to Decision delivered | Server instrumentation |
| Evidence upload success rate | User experience guardrail | No baseline | ≥ 95% of upload attempts succeed on first try | Product analytics |

---

## 11. Out-of-scope / future work

- **Full 50-state corpus.** After beta validates the archetype model on CA + CO + MI, expansion to New York, Florida, and Texas is the next archetype validation wave, followed by broader rollout. Each new state requires source assessment, extraction, review, and golden scenarios before production use.
- **Tribal jurisdictions.** Require distinct federal-tribal governance modeling; deferred to post-beta.
- **Lease and covenant review.** Site-specific private legal documents require counsel interpretation, not rule extraction.
- **Ongoing retail operational compliance.** Daily reporting, inventory reconciliation, purchase limit enforcement at POS, and delivery fleet compliance are Green Loom Rules' scope. Integration between law-hub's shared rules platform and Green Loom Rules will be specified after the launch-eligibility vertical slice demonstrates platform stability.
- **Manufacturing-only, processing, and wholesale workflows.** Different license structures and rule surfaces; not modeled in MVP.
- **Multi-state operator (MSO) licensing aggregation.** Composite license management across jurisdictions is a future platform extension.
- **Consumer-facing public API with external SLA.** Law-hub's evaluation contract is internal in MVP. External API with rate limits, developer keys, and published uptime SLAs is post-beta scope.
- **Mobile-native experience.** MVP is desktop-first. Mobile-responsive design is required but a native mobile application is out of scope.
- **Automated legal text parsing and ML-assisted extraction.** Extraction is human-directed in MVP. ML-assisted candidate identification may reduce analyst effort in a future phase, subject to quality validation.
- **Entity structure (LLC, corp, partnership) modeling.** Entity type affects some licensing eligibility requirements. Modeled as a future Facility attribute when coverage justifies the added complexity.

---

*Dash slug: law-hub-2026-07 · Tier: High-stakes · Date: 2026-07-13*
*See also: dashes/law-hub-2026-07/assumptions.md · dashes/law-hub-2026-07/metrics.md · dashes/law-hub-2026-07/flow.md*
*Source: law-hub/docs/research/legal-research.md · docs/object-library/artifacts/object-discovery.mdx · docs/object-library/artifacts/cta-matrix.mdx*
