# Four Ancient Truths — Designer Cheat-Sheet

> Loaded by `/explain four-ancient-truths` or at P7 Critique on demand.

---

## What they are

The Four Ancient Truths are the philosophical bedrock of OOUX — inalienable facts about human perception rooted in the laws of physics. When a design violates any of them, users feel confused or frustrated, even if they can't articulate why. Each truth has a corresponding anti-pattern that names the violation.

---

## The Four Truths

### 1. The Ancient Truth of Objects
> **Things that are different should look different.**

The brain is constantly asking "What are the things here?" through pattern recognition — shape, color, size, texture. When different objects look identical, the brain can't build accurate categories and trust erodes.

**Anti-pattern — Masked Objects**: Different objects housed in the same generic component or UI pattern. A "card" that can hold a PRODUCT, a REVIEW, and a SALE — all looking identical — is masking three semantically different things.

**Fix**: Design visually distinct representations for each object. The Object Card Designer step is dedicated to this.

---

### 2. The Ancient Truth of Relationships
> **Humans navigate most naturally through relationships between objects.**

Memory, thought, and understanding are all networks of associations. Users navigate from one object to a related object — not through menus and features. Digital products that mirror these associations feel intuitive.

**Anti-pattern — Isolated Objects**: Objects that exist in the system but have no visible connections to related objects. Users hit dead ends.

**Fix**: Map relationships in the NOM; ensure every object is reachable from at least one other object. The Nav Flow Designer step closes dead ends.

---

### 3. The Ancient Truth of CTAs
> **Humans act on objects through direct manipulation.**

In the physical world, you reach out and grab the thing you want to act on. You don't walk to another room to press a button that affects something back here. Direct manipulation is the expectation.

**Anti-pattern — Broken Objects**: Objects whose CTAs are disconnected or hidden elsewhere in the UI. The "Remove Participant" button is buried in a settings panel instead of being on the participant object.

**Fix**: Attach CTAs directly to the objects they affect. Use P/S/T/Q ranking to determine placement. The CTA Placement Designer step maps this explicitly.

---

### 4. The Ancient Truth of Attributes
> **Objects that are the same should look the same.**

The flip side of Truth #1. When an object changes shape arbitrarily from one context to another — attributes appear and disappear, visual treatment shifts without reason — users lose the ability to recognize and predict it.

**Anti-pattern — Shapeshifters**: The same object displaying different attributes or visual treatment in different contexts with no clear reason.

**Fix**: Establish a canonical card design per object. Shapeshifting is allowed when intentional and meaningful — document the rationale. The Shapeshifter Matrix Builder step maps intentional variance.

---

## Quick audit prompt

For any screen you're reviewing, ask:
1. Can I tell what type of thing each card or component represents? (Truth 1)
2. Can I navigate from here to the objects that are related to what I'm looking at? (Truth 2)
3. Can I act directly on the objects I see, without going somewhere else? (Truth 3)
4. Does this object look the same as it does in other places in the product? (Truth 4)

---

*See also: `pstq-ranking.md` · `page-collection-instance.md` · `nom.md` · `ooux-primer` skill*
