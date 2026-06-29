---
name: privacy-gate
description: >
  Data privacy and compliance gate. Triggered automatically when a Design Dash touches personal
  data, regulated information (health, financial, education records, data from minors), or any
  new data collection, sharing, or retention change. Runs a structured privacy checklist,
  identifies the applicable regulation for your users and geography, and routes novel data flows
  to real legal/privacy sign-off. Use at P0 Preconditions and whenever a new data surface is
  identified mid-dash.
stage: 7-critique-testing
version: "0.1.0"
---

# Privacy Gate — Data Privacy & Compliance

Screen every Design Dash for personal data exposure and enforce the appropriate compliance path.

## When to Use

- **Automatic trigger at P0 Preconditions** — always run the trigger screen before a dash begins
- **Mid-dash trigger** — any time a new data surface is identified (new PII field, new sharing, new retention)
- `dashes/{slug}/scope.md` signals: `pii: true` · `regulated_data: true` · `user_population: minors`
- The panel raises a compliance concern during a review
- "Privacy review" · "data compliance" · "privacy impact" · "PII audit"

---

## Step 1 — Trigger screen

Ask these binary questions. Any "yes" triggers the gate.

```
□ Does this dash collect, store, or display personal data (name, email, ID, location, health info,
  financial info, behavioral data, or any data that can identify an individual)?
□ Does it involve users who may be under 18 (minors)?
□ Does it involve users in a regulated context (healthcare, finance, education, government)?
□ Does it introduce a new data collection, a new data-sharing relationship, a new retention
  period, or a new identifiable field not previously in the system?
□ Does it involve sensitive data categories (health, race/ethnicity, religion, sexual orientation,
  biometric data, precise location, financial account data)?
□ Does it involve profiling, behavioral inference, or automated decision-making that affects users?
```

If **any trigger is yes**: proceed to Step 2.
If **all triggers are no**: record `privacy_gate: not_triggered` in `dashes/{slug}/scope.md` and stop.

---

## Step 2 — Identify applicable regulation

Regulation varies by user geography and data type. Work through this quickly:

| User geography / context | Regulation to check |
|---|---|
| EU / EEA users | GDPR |
| California users | CCPA / CPRA |
| US healthcare (HIPAA-covered entities) | HIPAA |
| US users under 13 | COPPA |
| US education records (school context) | FERPA / SOPIPA |
| Canadian users | PIPEDA / provincial laws |
| UK users | UK GDPR |
| Global SaaS (multiple geographies) | GDPR as baseline + local supplements |

**Action:** Record the applicable regulation(s) in `dashes/{slug}/scope.md`:
```yaml
privacy_gate:
  triggered: true
  applicable_regulations: [GDPR, CCPA, HIPAA, ...]
  user_population_notes: "[e.g., includes minors under 13; EU-based users]"
```

If you are uncertain which regulation applies, **treat GDPR as the baseline** (it is the
strictest broadly applicable framework) and flag for legal confirmation.

---

## Step 3 — Tier escalation

> **Rule:** Any surface that involves regulated personal data, data from minors, or sensitive
> data categories forces a minimum **High-stakes** tier.

Set in `dashes/{slug}/scope.md`:
```yaml
dash_tier: high-stakes
tier_trigger: regulated_personal_data
```

If the dash was previously Express or Standard, apply the full High-stakes gate set:
P1 Evidence · P4 Reconciliation · P5 Selection · P6 Edge/Ethics/Equity · P8 Learning — all mandatory.

---

## Step 4 — Privacy checklist (self-check path)

For changes that do not introduce novel data flows (e.g., copy change, layout change, UI
rearrangement with no new data exposure), complete this self-check:

### Consent & transparency
- [ ] Users are clearly informed about what data is collected and why (purpose limitation)
- [ ] Consent is obtained in the appropriate form for the regulation (opt-in for GDPR; opt-out for CCPA)
- [ ] Consent for minors meets the applicable standard (parental consent for COPPA; age-appropriate design for UK GDPR)
- [ ] Privacy notice / policy is visible and accessible from the relevant surface

### Data minimization
- [ ] The change does not collect more data than is necessary for the stated purpose
- [ ] No new identifiable field is created without a documented purpose
- [ ] Sensitive data categories are not collected unless strictly required and lawfully justified

### Access & role-based controls
- [ ] Personal data is not accessible to users or roles that don't need it
- [ ] Permission-denied state is explicitly designed for unauthorized access attempts
- [ ] Audit trail / access logging is preserved (no new read/write path that bypasses logging)

### Retention & deletion
- [ ] Retention period is defined and documented
- [ ] A deletion path exists (user can request deletion; data is removed when no longer needed)
- [ ] No new data store is created that extends retention beyond the existing policy

### Third-party sharing
- [ ] No new third-party SDK, pixel, or analytics integration is added without a Data Processing Agreement (DPA)
- [ ] No personal data is transmitted to a new third party not already covered by a DPA
- [ ] Behavioral tracking or profiling for advertising purposes is not introduced

**Self-check result:**
- All items pass → record `privacy_path: self_check_passed` in `dashes/{slug}/scope.md` and continue
- Any item fails → **escalate to legal sign-off** (Step 5); do not proceed on the self-check path

---

## Step 5 — Legal / privacy sign-off (novel data flows)

> **Rule:** Real legal/privacy sign-off is required for novel data flows.
> **No simulation floor for compliance.** The adversarial panel personas can identify gaps;
> they cannot substitute for legal sign-off on novel data flows.

### What to prepare for legal review

Produce a **privacy impact brief** at `dashes/{slug}/privacy-review.md`:

```markdown
# Privacy Impact Brief: [Feature / Change Name]

**Dash**: [slug]
**Date**: [YYYY-MM-DD]
**Prepared by**: [designer name]

## What is changing
[1–3 sentences describing the new data flow, collection, or sharing.]

## Applicable regulation(s)
[GDPR / HIPAA / CCPA / COPPA / etc. — and why each applies.]

## Data involved
| Data element | Source | Who has access | Retention | Used for |
|---|---|---|---|---|
| [e.g., email address] | [user registration] | [account owners, admins] | [account lifetime] | [login, notifications] |

## New exposure vs. existing baseline
[What does this change add relative to what was already collected/shared?]

## Third-party involvement
[Any new vendor, API, SDK, pixel, or analytics integration — yes/no and details.]

## DPA status
[Is the involved vendor/service already covered by a signed DPA? If no, who is responsible?]

## Proposed mitigations
[Data minimization, access controls, audit logging, consent path changes proposed by the designer.]
```

### Sign-off record

Record the legal/privacy sign-off in `dashes/{slug}/scope.md`:

| Discipline | Gate | Mechanism | Status | Evidence link | Date |
|---|---|---|---|---|---|
| Privacy / Legal | P0 / Privacy Gate | Async — privacy impact brief review | ✅ real | [link to approval] | YYYY-MM-DD |

`✅ real` requires: a named privacy/legal reviewer, a reference to the specific privacy impact
brief they reviewed, and a dated approval. A bare "approved" without artifact reference does not
clear the gate.

**If legal sign-off does not return before the gate deadline:**
- The dash cannot proceed past the stage that introduced the new data flow
- Record as `⏳ debt` in `dashes/{slug}/scope.md` with a due-by date

---

## Step 6 — Record gate outcome

Update `dashes/{slug}/scope.md`:

```yaml
privacy_gate:
  triggered: true
  applicable_regulations: [GDPR, CCPA, ...]
  path: [self_check | legal_escalation]
  self_check_status: [passed | escalated | n/a]
  legal_sign_off:
    status: [pending | complete | not_required]
    reviewer: "[name]"
    evidence_link: "[URL or path]"
    date: "[YYYY-MM-DD]"
  tier_forced: high-stakes
  notes: "[any unresolved items or conditions]"
```

---

## Hard rules (non-negotiable)

1. **No simulation floor for compliance.** The panel can identify privacy gaps; it cannot
   substitute for legal sign-off on novel data flows.
2. **Tier floor is High-stakes** when regulated personal data or data from minors is present.
3. **Self-check path is for pre-cleared low-risk changes only.** If any doubt exists, escalate.
4. **Real legal sign-off requires a named human approver and an artifact reference.**
5. **Novel data flows block the dash** until legal sign-off is received.
