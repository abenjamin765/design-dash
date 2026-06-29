# Unintuitive Objects — Designer Cheat-Sheet

> Loaded by `/explain unintuitive-objects` or at P7 Critique on demand.

---

## What unintuitive objects are

An unintuitive object is any object whose design violates one of the Four Ancient Truths. There are four named types — each maps directly to an anti-pattern and a corresponding ORCA step that prevents or fixes it.

---

## The four types

### 1. Masked Objects *(violates Ancient Truth of Objects)*

> Different objects that look identical, or the same object called by different names.

**How it happens**: A generic "card" component gets reused for PRODUCT, REVIEW, and SALE — all three look the same. Users can't tell what type of thing they're looking at.

**Real-world analogy**: Walking into a store where every product is in identical unmarked white boxes.

**Fix** (Object Card Designer step): Design a visually distinct card for each object. Use shape, color, iconography, or attribute layout to make objects recognizable at a glance.

**Quick audit**: Take screenshots of your most common card components. Can you tell which object each one represents without reading the content inside?

---

### 2. Isolated Objects *(violates Ancient Truth of Relationships)*

> Objects that exist in the system but have no visible path to related objects. Dead ends.

**How it happens**: A DOCUMENT detail page shows a TEAM as text but doesn't link to the Team. The user has no way to navigate to the related object.

**Real-world analogy**: A sign in a building that mentions a department but gives no room number or direction.

**Fix** (Nav Flow Designer step): Map the NOM — every ✓ cell is a navigation link that must exist. No object should be a dead end.

**Quick audit**: Navigate your wireframe. Can you get from every object to every object directly related to it?

---

### 3. Broken Objects *(violates Ancient Truth of CTAs)*

> Objects whose CTAs are disconnected — hidden elsewhere, buried in unrelated panels, or missing entirely.

**How it happens**: To remove a MEMBER from a TEAM, the admin must navigate to a separate Account Settings panel instead of clicking on the member. The CTA is detached from the object it affects.

**Real-world analogy**: A light switch that controls a lamp but is located in a different room.

**Fix** (CTA Placement Designer step): Attach CTAs directly to the objects they affect. Use P/S/T/Q ranking to determine prominence; never bury a Secondary-tier action in a third-level menu.

**Quick audit**: For each object in your design, can the user take the most important action without leaving the object's context?

---

### 4. Shapeshifters *(violates Ancient Truth of Attributes)*

> The same object displaying arbitrarily different attributes or visual treatment across contexts.

**How it happens**: A PRODUCT card on the homepage shows Price in the lower-left corner. The same PRODUCT on the SALE landing page shows Price at the top and hides the Rating attribute. Users who've learned where to look are now "moved cheese."

**Real-world analogy**: A coffee maker that looks like a toaster when you bring it home from the store.

**Fix** (Shapeshifter Matrix Builder step): Establish a canonical card design per object. Any context-specific variant must be intentional, documented, and justified.

**Quick audit**: Take screenshots of the same object in 3+ contexts. Do the attribute order and visual treatment stay consistent?

---

## The cost of unintuitive objects

Each type erodes trust in a different way:

| Type | User feeling | Business cost |
|---|---|---|
| Masked | "I can't tell what anything is" | Slower task completion, support load |
| Isolated | "I keep hitting dead ends" | Navigation abandonment |
| Broken | "I can never find the button" | Failed task completion, frustration |
| Shapeshifter | "This product feels inconsistent" | Reduced trust, longer learning curve |

---

*See also: `four-ancient-truths.md` · `pstq-ranking.md` · `page-collection-instance.md`*
