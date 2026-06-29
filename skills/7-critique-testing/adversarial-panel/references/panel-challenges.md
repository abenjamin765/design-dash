---
purpose: Shared bank of source-grounded challenges for any panelist to draw on in Phase 3 (Adversarial Debate). Organized by the four unintuitive object patterns, CTA placement, and naming/language. Loaded before Phase 3 begins.
---

# Panel Challenge Catalog

This catalog provides concrete challenges any panelist can raise during Phase 3 (Adversarial Debate) of the adversarial panel. Challenges are organized by the four unintuitive object anti-patterns, CTA placement, and naming/language — the areas most commonly disputed in a Design Dash critique.

Each challenge includes:
- **What to say** — a paraphrased challenge prompt the panelist can speak in their own voice
- **What to look for** — the signal that makes this challenge warranted
- **Resolution direction** — what a good answer looks like

---

## Group A — Masked Object challenges

These challenges apply when two or more object types appear visually identical on a wireframe or prototype, or when a design reuses a generic card template for semantically different objects.

### A1 — The same-card test

**What to say**: "Can a user tell, at a glance without reading the title, whether this item is a [Type A] or a [Type B]? If the answer is no, we have a Masked Object — and the cognitive burden falls on the user, not the design."

**What to look for**: Two different object types (e.g., Task and Event) using the same card layout, same badge color, and same CTA labels.

**Resolution direction**: Each object type should have at least one visually distinct attribute — a specific badge variant, a unique icon, or a different attribute order that signals its type. Not just a text label that can be missed.

### A2 — The generic-card audit

**What to say**: "This card template appears to hold [N] different object types. What does that do to a user who has learned the pattern from one object type and encounters a different one in the same layout?"

**What to look for**: A flexible "feature card" or "activity card" that is reused for structurally different objects.

**Resolution direction**: Either constrain the card to a single object type, or introduce sufficient visual differentiation between the variants that users can recognize the type before engaging.

### A3 — The naming-masking check

**What to say**: "The label 'Activity' is used in this product and at least one other place in the platform. Is it the same object? Or is the same name covering two different things — one of which masks the other?"

**What to look for**: A generic label ("Item," "Activity," "Resource") applied to semantically different objects.

**Resolution direction**: Each distinct object type needs a distinct name that matches the user's mental model. Object-level naming is a design decision, not just a content decision.

---

## Group B — Isolated Object challenges

These challenges apply when an object exists in the design but has no visible navigation path to the related objects a user would naturally want to reach next.

### B1 — The dead-end test

**What to say**: "I'm on the [object] detail page. Where can I go from here? Walk me through every related object I might want to reach, and show me how I get there. If any of those paths are missing, we have Isolated Objects."

**What to look for**: A detail page with no outbound links to related objects that were confirmed as relationships in the NOM.

**Resolution direction**: Every "has 1" and prioritized "has 0-many" relationship should have at least one navigable link from either the card or the detail page.

### B2 — The NOM coverage check

**What to say**: "We agreed in the NOM that [Object A] has a direct relationship to [Object B]. I'm not seeing a navigation path from A to B in the wireframe. Was this relationship deprioritized, or did it fall through the cracks?"

**What to look for**: A confirmed relationship in scope.md or the NOM that has no corresponding navigation element in the wireframe.

**Resolution direction**: Either confirm the relationship was intentionally deprioritized (and note why), or add the navigation link. Both are valid — what is not valid is an unintentional gap.

### B3 — The back-navigation trap

**What to say**: "Once a user drills into [nested object], can they navigate back to [host object] without using the browser's back button? If not, the nested object is stranded."

**What to look for**: A drill-down path where breadcrumbs or back-links are missing.

**Resolution direction**: Breadcrumbs or contextual back-links on nested object detail pages, consistent with the nav flow.

---

## Group C — Broken Object challenges

These challenges apply when an object's primary actions (CTAs) are not available on the surface where users first encounter the object.

### C1 — The trickle-down test

**What to say**: "[CTA] appears on the [object] card. Does it also appear on the detail page? A CTA that disappears when you click through creates a Broken Object — the user who reads before acting gets stranded."

**What to look for**: A CTA present on a card that is absent from the corresponding detail page.

**Resolution direction**: Every CTA present on a card must also appear on the detail page. This is the trickle-down rule — no exceptions without a documented rationale.

### C2 — The batch-action gap

**What to say**: "[CTA] is something users will do many times in a session — not just once. Is there a way to apply this to multiple instances at once from the list view? If not, we're making a frequent task a repetitive chore."

**What to look for**: A high-frequency CTA that only appears at the card or detail level, with no batch/multi-select mechanism at the list level.

**Resolution direction**: High-priority CTAs that benefit from batch application should appear at the list level with a multi-select + apply mechanism.

### C3 — The settings-page exile

**What to say**: "I can only access [CTA] by navigating to a separate settings page or configuration screen. There is no way to take this action directly on the object where I encounter it. What is the design rationale for exiling this action?"

**What to look for**: A CTA that lives only in a "Manage," "Settings," or "Actions" page rather than on the object itself.

**Resolution direction**: Move the CTA to the object's card or detail page. Settings-page placement is only justified for genuinely administrative, low-frequency, or role-gated actions.

### C4 — The cross-platform disappearing act

**What to say**: "Is this CTA available on all platforms — desktop and mobile — at the same tier? If it's on the card in desktop but buried in a menu in mobile (or missing entirely), users who switch between platforms will be confused."

**What to look for**: Inconsistent CTA placement across form factors.

**Resolution direction**: CTA placement tier should be consistent across all platforms. Adaptation of visual form (button vs. fab vs. gesture) is fine; demotion of priority tier is not.

---

## Group D — Shapeshifter challenges

These challenges apply when the same object type looks or behaves differently across different contexts without a principled reason.

### D1 — The side-by-side audit

**What to say**: "Can we look at this object as it appears in these three contexts side by side? [Card on list page / nested in another object's detail / standalone detail page.] What changed between them, and why?"

**What to look for**: Attribute order, visible attributes, badge variants, or CTA labels that shift between contexts.

**Resolution direction**: Document intentional variants with an explicit rationale. Any variant without a rationale is an arbitrary Shapeshifter.

### D2 — The attribute-location memory test

**What to say**: "If a user has learned that [attribute] appears in the [position] of this card, what happens when that attribute moves to a different position in a different context? Users build muscle memory based on attribute location. 'Moving their cheese' costs trust."

**What to look for**: A frequently scanned attribute (like score, due date, or status) that appears in inconsistent positions across card variants.

**Resolution direction**: Pin the most important attributes to consistent positions across all card variants. Only move an attribute if a documented user reason justifies the trade-off.

### D3 — The role-based shapeshifting check

**What to say**: "Does this object look different for different user roles — and if so, is that role-based variation intentional? Role-based Shapeshifting is sometimes worth it; accidental role-based Shapeshifting is a design debt."

**What to look for**: Different attribute sets or CTA sets for the same object across different user roles, without documented role-based prioritization.

**Resolution direction**: Document each role-based variant explicitly. If two roles share 80% of their attributes and CTAs, consider whether a single design with conditional CTA visibility is cleaner than two distinct designs.

---

## Group E — CTA placement + naming challenges

These challenges apply to CTA hierarchy decisions and the language used for actions.

### E1 — The purpose statement demand

**What to say**: "Why does this CTA exist? I want to hear the user's motivation for taking this action — not 'so they can [restate the CTA],' but a genuine why that connects to a user goal. If we can't articulate it, we may be building an assumption."

**What to look for**: CTAs added because a competitor has them, or because "users might want this," without research backing.

**Resolution direction**: A two-sentence purpose statement: "A [role] takes this action so that [genuine user goal], especially when [context]." If the team can't write it, the CTA is a research question, not a design decision.

### E2 — The primary-count rule

**What to say**: "I count [N] primary-ranked actions on this object in this context. The rule is one Primary per object per context — it's a ranking, not a description of importance. Which of these [N] actions is actually the most important right now?"

**What to look for**: Multiple "primary" buttons on the same card or detail page.

**Resolution direction**: Force-rank: one and only one Primary per object per context. All others are Secondary, Tertiary, or Quaternary.

### E3 — The verb clarity challenge

**What to say**: "What does 'Manage' actually do? 'Manage [X]' is not a user-meaningful CTA label — it tells the user where they're going, not what they'll accomplish. Can we name this action after the most common thing a user does when they 'manage' it?"

**What to look for**: CTA labels like "Manage," "Settings," "Configure," "Handle," "Administer" — labels that describe a navigation destination, not a user action.

**Resolution direction**: Name CTAs after the outcome the user gets, not the screen they navigate to. "Review scores," "Set due date," "Add members" — concrete, outcome-oriented verbs.

---

## How to use this catalog in Phase 3

1. **Before Phase 3 begins**, each panelist mentally scans the wireframe or prototype against all five challenge groups and identifies the one or two challenges most warranted by what they see.
2. **During Phase 3**, panelists raise challenges in their own voice — they do not read from this catalog. The catalog provides the source-grounded substance; the persona provides the tone.
3. **Sophia** will typically own Groups A (Masked), C (Broken), and E (CTA placement). Other panelists may raise Isolated Object (Group B) or Shapeshifter (Group D) challenges from their own domain perspective.
4. **A challenge is closed** when the designer (or another panelist defending the design) provides a documented rationale. "We decided this intentionally because [reason]" closes a challenge. "That's a good point, we hadn't thought about it" opens a condition in the Decision Memo.
