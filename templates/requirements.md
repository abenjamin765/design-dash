# {Product/Feature Name} — Product Requirements

**Dash slug:** {slug}
**Date:** {YYYY-MM-DD}
**Tier:** {Express | Standard | High-stakes}
**Status:** Draft

---

## 1. Context & background

{Brief description of the product, product area, or feature context. What already exists? What user workflow does this fit into? Provide enough background that a new team member could understand why this work is happening.}

<!-- Hints:
  - Name the product area or surface (e.g., "the notifications system", "the project creation flow")
  - Reference any predecessor features, prior launches, or related work
  - Note any platform/technical constraints that are already known
-->

---

## 2. Problem statement

{One paragraph. Structure: Current state · affected users · evidence of pain · magnitude of impact · cost of inaction · desired outcome. Keep it to 3-5 sentences.}

**Confidence:** {High | Medium | Low}
**Evidence sources:** {Links or descriptions of research, analytics, support tickets, usability studies, or assumptions — be specific}

<!-- Hints:
  - "High" confidence = validated by research or quantitative data
  - "Medium" = informed by proxy data or stakeholder interviews
  - "Low" = largely assumed; flag for validation
-->

---

## 3. Goals

### 3.1 Primary goals

{Numbered list of concrete, measurable goals this design must achieve. Each goal should be testable.}

1. {Goal — e.g., "Reduce time-to-first-project for new accounts from 8 minutes to under 3 minutes"}
2. {Goal}
3. {Goal}

### 3.2 Non-goals (explicitly out of scope)

{What this design deliberately does NOT address. Be specific. Prevents scope creep and misaligned expectations.}

- {Non-goal — e.g., "This does not redesign the billing page; that work is tracked separately in [link]"}
- {Non-goal}
- {Non-goal}

---

## 4. Users

### 4.1 Primary users

{Who is the main user of this feature? Include: role/persona name, usage context, key goals, and the specific pain points this design addresses for them.}

**Role:** {e.g., "Account Admin" or "Project Manager"}
**Context:** {When and where they encounter this}
**Goals:** {What they are trying to accomplish}
**Pain points:** {What frustrates them today}

### 4.2 Secondary users & stakeholders

{Others who interact with or are affected by this design, even if they are not the primary actor. Include: role, how they are affected, any conflicting needs.}

| Role | How affected | Notes |
|---|---|---|
| {Role} | {How this design touches them} | {Conflicts or constraints} |

---

## 5. Object model summary

{Table of all key objects modeled during this dash. Every object in the design should appear here. Pull from the object guides in library/objects/.}

| Object | Definition | Key attributes | Key actions (CTAs) |
|---|---|---|---|
| {name} | {one-sentence definition} | {comma-separated list} | {comma-separated list} |

*Full object guides: see library/objects/*

<!-- Hints:
  - List all objects that appear in screens, flows, or data model
  - "Key attributes" = the 3-5 most important data points shown in the UI
  - "Key CTAs" = the primary actions users take on this object
-->

---

## 6. Flows & scenarios

{One subsection per key scenario. Focus on the critical paths: the happy path, the most common edge case, and the highest-risk failure state.}

<!-- Hint: Aim for 3-6 scenarios. More than 8 suggests the scope needs splitting. -->

### Scenario: {Name — e.g., "New user creates first project"}

**Trigger:** {What causes the user to start this flow — e.g., "User clicks 'New Project' from the empty dashboard state"}
**Actor:** {Primary user role}

**Steps:**
1. {Step}
2. {Step}
3. {Step}

**Outcome:** {What success looks like from the user's perspective}
**Edge cases:**
- {Failure or exception path — e.g., "User has reached plan limit; show upgrade prompt"}
- {Edge case}

---

## 7. Page / screen requirements

{One subsection per page or screen in the design. If a page has multiple significant states (e.g., empty vs. populated), they can share a subsection with separate edge-state notes.}

<!-- Hint: Anchor each page to a "hub object" — the primary object the page is about. -->

### Page: {Page Name}

**Hub object:** {The primary object this page is about — e.g., "Project"}
**Entry points:** {How users arrive — e.g., "Sidebar nav, notification link, direct URL"}

**Attributes shown:**

| Attribute | Why shown | Format / type | Editable? |
|---|---|---|---|
| {attribute name} | {user need it serves} | {e.g., "plain text", "date MM/DD/YYYY", "badge"} | {Yes / No / Admin only} |

**Actions available:**

| Action | Priority | Trigger | Outcome |
|---|---|---|---|
| {action name} | {Primary / Secondary / Tertiary / Quaternary} | {user gesture — e.g., "button click", "hover menu"} | {system response} |

**Edge states:**

- **Empty state:** {What the page shows when there is no content yet. Include copy guidance or placeholder message.}
- **Loading state:** {Skeleton, spinner, or progressive disclosure — which and why}
- **Error state:** {What went wrong, what the user sees, and the recovery path}
- **Permission-denied state:** {Who sees this and what they see instead of the full page}
- **At-scale state:** {Behavior with large datasets — pagination, virtualization, truncation, search}

---

## 8. Acceptance criteria

{Testable checklist. Each criterion uses the Given/When/Then format. Engineering and QA use this list to verify the implementation.}

<!-- Hint: Write one criterion per significant behavior. Cover: happy path, edge states, permissions, and error handling. -->

- [ ] Given {context — e.g., "a user with Admin role"}, when {action — e.g., "they click 'Archive Project'"}, then {outcome — e.g., "the project status changes to Archived and it moves to the archived list"}
- [ ] Given {context}, when {action}, then {outcome}
- [ ] Given {context}, when {action}, then {outcome}
- [ ] Given a user without write permission, when they view the page, then all destructive actions are hidden or disabled with appropriate messaging
- [ ] Given an empty state, when the user first arrives, then a contextual empty-state message and primary CTA are shown

---

## 9. Open questions & assumptions

*Full register: see dashes/{slug}/assumptions.md*

{Surface the most critical unknowns here. Anything that could derail the design or implementation if wrong should be captured and assigned a validation method.}

| # | Question / Assumption | Type | Confidence | Validation method |
|---|---|---|---|---|
| A-001 | {Statement — e.g., "Users primarily access this feature from desktop"} | {observed / assumed / borrowed} | {High / Med / Low} | {How to validate — e.g., "Analytics: check device breakdown for this flow"} |
| A-002 | {Statement} | {observed / assumed / borrowed} | {High / Med / Low} | {Validation method} |

<!-- Types:
  - observed = confirmed by direct evidence
  - assumed = team belief without direct evidence
  - borrowed = inferred from analogous products or prior research
-->

---

## 10. Success metrics

*Full register: see dashes/{slug}/metrics.md*

{Define how you will know this design succeeded. Include at least one north-star metric and one guardrail metric.}

| Metric | Type | Baseline | Target | Measurement source |
|---|---|---|---|---|
| {metric name — e.g., "Time-to-first-project"} | {north-star / guardrail / proxy} | {current value or "unknown"} | {goal — e.g., "< 3 minutes"} | {analytics / research / support tickets / etc.} |
| {metric name} | {north-star / guardrail / proxy} | {baseline} | {target} | {source} |

<!-- Hint: 
  - North-star = the primary outcome you're optimizing for
  - Guardrail = a metric you must NOT degrade (e.g., error rate, churn, accessibility score)
  - Proxy = a leading indicator you can measure sooner than the north-star
-->

---

## 11. Out-of-scope / future work

{What was explicitly deferred? What follow-on work is anticipated after this ships? Link to any backlog items or future dash plans if they exist.}

- {Deferred item — e.g., "Mobile-optimized version of this flow is deferred to Q3; tracked in [ticket]"}
- {Future work}
- {Future work}

---

*Generated by Design Dash · {date}*
*See also: dashes/{slug}/wireframe.html · dashes/{slug}/flow.md · dashes/{slug}/assumptions.md*
