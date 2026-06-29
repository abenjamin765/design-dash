# Voice & Style — Reference

Use this file during copy edits. Route by context — see [SKILL.md](SKILL.md).

**Canonical sources:**
- Product glossary: `dashes/{slug}/glossary.md`

---

## Audience targets (UI content floor)

| Audience | Target |
|----------|--------|
| End users of any product | Clear, plain language; define jargon on first use |
| UX practitioners / designers | Professional prose; intellectually serious without academic density |
| Agents reading skill docs | Direct professional prose; ≤ 120 chars for SKILL.md `description` |

---

## Recurring example domains

Use these consistently across artifacts and examples rather than inventing one-off products:

1. Project management platform
2. Healthcare appointment portal
3. Marketplace / e-commerce onboarding
4. Internal enterprise analytics dashboard
5. AI writing or recommendation assistant

Prefer extending an existing scenario over inventing a one-off product within a single dash.

---

## Typographic content patterns

| Pattern | Purpose |
|---------|---------|
| **The Situation** | Realistic product or team moment |
| **The Hidden Problem** | What is really going on beneath the surface request |
| **The Shift** | Typographic reframe — short, memorable contrast |
| **The Principle** | One memorable core claim |
| **Try It** | Small self-led exercise |
| **Check Yourself** | Inline knowledge check |
| **Design Judgment Moment** | More than one defensible answer |
| **What Good Looks Like** | Model answer or rubric |
| **Common Trap** | Common misuse of the concept |
| **Carry Forward** | Connect to the next phase or principle |

---

## Term guidance (artifact copy)

### Screen vs. system

**Better:** A redesign request often surfaces unclear objects, conflicting goals, missing trust, or a model the team has not aligned on yet.

### Object vs. page / feature / component

**Object:** Assignment, Appointment, Listing — meaningful domain things that store, interact with, or produce unique value.

**Not usually an object:** Page names, button labels, task names, UI components.

### User / persona / metric

**Better:** Name who is affected, under what constraints, with what goals, and who bears the cost of a design decision.

### AI / automation

**Better:** AI can support synthesis, ideation, drafting, and critique. The designer remains responsible for evaluating output and deciding what should ship.

### Accessibility / inclusion

**Better:** Accessibility is one way thoughtful design becomes real for more people — including permanent, temporary, and situational variation.

### Best practice / intuitive / seamless

**Better:** Name the principle or tradeoff (reduce cognitive load, preserve user control, make the next step obvious).

---

## Positive framing examples

### Screen-level vs. system-level

**Less aligned:** Don't just design screens.

**More aligned:** Start by understanding the system the screen belongs to.

### AI and designers

**Less aligned:** AI will not replace designers.

**More aligned:** AI increases the value of designers who can ask better questions and make better judgments.

### Accessibility

**Less aligned:** Accessibility is not optional.

**More aligned:** Accessibility is one way thoughtful design becomes real for more people.

### Designer mistakes

**Less aligned:** Designers who skip object modeling are doing it wrong.

**More aligned:** Many teams design pages before agreeing on objects. The confusion in the UI often comes from confusion in the model.

---

## Clear / specific swaps

| Instead of | Use |
|------------|-----|
| Make the dashboard easier to use. | Clarify what the dashboard is for, which objects matter, and what decisions it should support. |
| Let's add AI to the product. | What judgment must stay human, and how will users trust or verify the output? |
| This is intuitive. | Users can recognize the next step because [specific design choice]. |
| Stakeholders aren't aligned. | The team has not yet named the decision, tradeoffs, or evidence each option serves. |
| This improves the user experience. | [Name the specific change and its effect on a specific user action.] |

---

## Sentence style

- Short, direct sentences in instructional and artifact prose.
- Intentional repetition for Shift moments and anchor lines.
- Contrast: state what we build toward, not only what we reject.
- Start from recognizable situations, not dense academic openings.
- Em dashes for structure only (headings, `**Term** — definition`). Commas or periods in running prose.

## Grice's maxims

- **Quantity:** Every paragraph clarifies, reframes, or moves toward action.
- **Quality:** Strong ethical/judgment claims; careful empirical claims.
- **Relation:** What should the designer do differently?
- **Manner:** Domain terms when needed; translate into decisions and user impact.

---

## Storytelling example (analytics dashboard)

> A product manager opens the analytics dashboard every Monday. The team receives a familiar request: "Make the dashboard easier to use."
>
> On the surface, the problem looks visual — too many charts, confusing labels, cluttered filters.
>
> The hidden problem is systemic. Different roles want different decisions from the same screen. No one has agreed which objects matter or which decisions the dashboard should support.
>
> The Shift:
>
> The team asked for a better screen.
> Leaders needed a clearer model of what "performance" means for each role.

---

## UI copy examples (content floor)

### Empty state (generic product)

> **No projects yet**
> Projects appear here once you create them.
> [Create project]

### Error message (generic product)

> **We could not save your changes**
> The connection dropped before the update finished.
> Check your network and try again.

### Empty state (dashboard)

> **No data for this period**
> Metrics appear here after activity is recorded in this date range.
> [Adjust date range]

### CTA swaps

| Instead of | Use |
|------------|-----|
| Submit | Save changes / Add project / Send message |
| Click here | [Verb + object on the button itself] |
| Learn more | Read overview / See instructions |
| OK | Got it / Continue / Try again |

### Dark pattern flags

- "No thanks, I don't want to improve" (guilt-trip opt-out)
- Countdown timers for non-time-limited offers
- Pre-checked marketing consent
- Hidden costs revealed late in a flow

---

## Context examples

**Object guide definition:** A Project is a named container for a team's planned work, owned by one team member, and progressed through status stages.

**CTA label:** Add Project — not "Create" (too abstract), not "Submit" (no object).

**Skill description:** Guides the agent through object discovery using the SIP test. Use when identifying product nouns at the start of a dash.

**Assessment feedback (correct):** Correct. Before choosing a visual treatment, ask whether the issue is object clarity, data trust, or decision context.

**Assessment feedback (incorrect):** Not quite. Redesigning the layout assumes the problem is visual. Start with object and decision clarity.
