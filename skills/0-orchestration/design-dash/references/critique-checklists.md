# Critique Checklists

> Loaded by the Design Dash orchestrator at the P7 Critique portion.
> Each item is a yes/no self-audit question. A "No" is an open action item, not a failure — log it and resolve before the gate passes.

---

## P7 — Wireframe + Edge States + Ethics/Equity

### P7.A Wireframe Critique

- [ ] Does every success criterion from `dashes/{slug}/scope.md` map to a visible UI element?
- [ ] If `dashes/{slug}/flow.md` exists, does the wireframe reflect every step in the goal-page map?
- [ ] Is the P/S/T/Q action ranking honored? (No two actions sharing a rank unless intentional; exactly one Primary per layer.)
- [ ] Is attribute priority honored? (Most important attributes appear highest/first.)
- [ ] Are the page / collection / instance layers clearly separated and annotated (`layer:` comment)?
- [ ] Is the hub object clearly identifiable on the page? (Object name/title is prominent.)
- [ ] Is every collection labeled by object type, with sort/filter options listed?
- [ ] Are relationships between objects expressed as navigation or inline display — not hidden behind ambiguous labels?
- [ ] Does no color serve as the sole signal for status? (Status requires label + shape or icon.)
- [ ] Is heading hierarchy logical? (One `<h1>` per page, descending levels with no skips.)
- [ ] Does every interactive element have an accessible label (button text or `aria-label`)?
- [ ] Are all major sections annotated with component type hints (e.g., `component-hint: data-table`)?
- [ ] Does every interactive section cite at least one design rationale or is it marked `TBD`?

### P7.B Edge States

For each page in the wireframe:

- [ ] **Empty state** — is there a visible empty-state design (not a blank page)?
- [ ] **Loading state** — is there a skeleton or spinner placeholder?
- [ ] **Error state** — is there a user-facing error message with a recovery action?
- [ ] **Permission-denied state** — does the page gracefully handle unauthorized access?
- [ ] **Content-at-scale state** — does the collection design hold up with 100+ items? (Pagination, virtual scroll, or explicit "load more" shown.)
- [ ] Are all five states visible in the wireframe artifact, not described in a comment only?

### P7.C Ethics / Equity Gate *(mandatory all tiers)*

**Dark patterns & persuasion (all tiers)**
- [ ] Does the design avoid false urgency (countdown timers on non-timed content)?
- [ ] Does the design avoid confirmshaming (e.g., "No thanks, I don't want to improve")?
- [ ] Does the design avoid hidden costs or irreversible actions without clear confirmation?
- [ ] Does the design avoid manipulative defaults that benefit the business at the user's expense?
- [ ] Does the design protect vulnerable users (minors, users in distress, users with limited technical literacy)?

**Standard + High-stakes additions**
- [ ] Is the layout and copy accessible to users with lower literacy or non-native language proficiency? (Plain language, avoid idioms.)
- [ ] Does the design degrade gracefully on low-bandwidth or low-powered devices? (No autoplay video, heavy animations, or mandatory JS-only interactions.)
- [ ] Is the content appropriate for the target audience context?
- [ ] If AI-generated or AI-assisted content is surfaced: is provenance disclosed and bias risk assessed?
- [ ] If the design touches personal data: is there a clear consent path?
- [ ] If the design touches personal data: is data minimization applied? (Only data needed for the task is surfaced.)
- [ ] If the design touches personal data: are data retention and deletion policies reflected in the UI?
- [ ] If the design touches personal data: is role-based access enforced in the wireframe?

---

## P8 — Research Plan + Learning Gate

### P8.A Usability Test Readiness

- [ ] Is a usability study type committed? (Moderated, unmoderated, guerrilla, etc.)
- [ ] Are participant criteria defined? (Role, relevant experience, n ≥ 3 for moderated.)
- [ ] Is a task list written? (Each task maps to a success criterion from `dashes/{slug}/scope.md`.)
- [ ] Is a success threshold defined per task? (Completion rate, error rate, satisfaction score target.)
- [ ] Is a named owner assigned to run the study?
- [ ] Is a due date set? (≤ 15 business days for Standard, ≤ 30 for High-stakes.)
- [ ] Is the study recorded in `dashes/{slug}/research-plan.md`?

### P8.B Learning Gate *(Standard + High-stakes)*

- [ ] Is every open assumption in `dashes/{slug}/assumptions.md` mapped to a validation method?
- [ ] Is the sign-off ledger in `dashes/{slug}/scope.md` complete? (Each Responsible discipline row marked `✅ real` or `⚪ simulated` with a resolution plan.)
- [ ] For High-stakes: are all Responsible rows `✅ real` before marking the dash complete?
- [ ] Is `dashes/{slug}/summary.html` compiled and linked from `dashes/index.html`?
- [ ] Is the re-entry trigger defined? ("If assumption X is falsified in testing, re-enter at phase P__.")

### P8.C Express Deferred Items *(Express tier only)*

- [ ] Are all deferred gates logged as dated entries in `dashes/{slug}/assumptions.md` with a validation method?
- [ ] Is the named validation owner recorded?

---

*Sources: Design Dash SKILL.md §P7–P8 · wireframing SKILL.md · ethics-equity-review SKILL.md · a11y-audit SKILL.md*
