---
id: ooux-object-thinking
title: OOUX Object Thinking
stage: 3-object-modeling
version: "0.1.0"
orca_round: supporting
orca_pillar: objects
orca_step: 0
description: >
  Reference knowledge for identifying, validating, and reasoning about objects in a system.
  Use when discussing nouns, SIP validation, entity identification, object discovery, or
  deciding whether something qualifies as an object. Companion to the procedural
  01-object-discovery skill.
roles:
  - ux-designer
  - product-manager
  - engineer
tags:
  - objects
  - sip
  - noun-foraging
  - object-thinking
  - ooux
difficulty: beginner
estimated_duration_minutes: 0
system_prompt_file: SKILL.md
---

# OOUX Object Thinking

Use this knowledge when helping users identify, validate, or reason about objects in their system.

## The Ancient Truth of Objects

> Things that are different should look different.

Every digital system is made of objects — the concrete "things" users care about. The human brain evolved to perceive, categorize, and act upon objects. When digital objects are clearly distinct and recognizable, users build accurate mental models. When they're not, confusion results.

This truth drives everything in OOUX: start with the objects, then build relationships, CTAs, and attributes around them.

## Object Anti-Patterns

**Masked Objects** — Different objects are disguised as the same thing, or the same object is called by different names. This violates the Ancient Truth of Objects because things that are different don't look different.
- Fix: Give each object its own distinct name, visual treatment, and card design.

**Phantom Objects** — Objects that users expect to exist but that aren't in the system yet. Users have a mental model of these things, but the product doesn't surface them.
- Fix: Validate phantom objects with SIP, then decide whether to build them or clarify why they don't exist.

## The SIP Test

Every candidate noun must pass three tests to qualify as a system object:

**S — Structure**: Does this thing have its own attributes? Could you design a detail page for it?
- Pass: "A PROJECT has a name, description, owner, due date, status"
- Fail: "A title is just a text field on something else"

**I — Instances**: Does this thing have multiple examples?
- Pass: "Website Redesign, Mobile App Launch, Q3 Campaign are all instances of PROJECT"
- Fail: "The Dashboard is one thing, not many"

**P — Purpose**: Do users care about this thing for its own sake?
- Pass: "Users browse, create, and track PROJECTS"
- Fail: "A section divider exists for layout but users don't seek it out"

All three must pass. If any fails, the noun is likely an attribute, a CTA, or too vague.

### SIP Edge Cases

- **Passes S and I but fails P**: Probably a system entity, not a user-facing object. Example: "Log Entry."
- **Passes S and P but fails I**: Might be a singleton page, not an object. Example: "Dashboard."
- **Passes I and P but fails S**: Might be too vague. Push for specificity — is it a Resource, an Article, a Video?

## Noun Foraging

The foundational OOUX technique for finding candidate objects. Extract **every noun** from:
- User interview transcripts
- Personas and journey maps
- Requirements documents and PRDs
- Existing UI screenshots (what nouns appear on screen?)
- Domain glossaries and business docs
- Support tickets and FAQ content

Don't filter during foraging — capture everything. Quantity over quality at this stage. The filtering comes later during SIP validation. Think of it as "casting a wide net."

## Common Traps

1. **Verbs disguised as nouns**: "Registration" might be a CTA (Register), not an object.
2. **Attributes disguised as objects**: "Name", "Date", "Score" are usually properties of something else.
3. **Too abstract**: "Content" is too vague — what kind? Article? Video? Document?
4. **Too granular**: "First Name" is an attribute of PERSON, not its own object.
5. **System internals**: "Database", "API endpoint", "Session" — these aren't user-facing objects.
6. **Feature masquerading as object**: "Search" or "Dashboard" are features or views, not objects.

## Object Naming Conventions

- Use **singular nouns**: PROJECT, not Projects
- Use **user-friendly language**: MANAGER, not ManagerEntity
- Pick the **most common term** users actually say
- When products use different names for the same thing, pick one canonical name and note the aliases (this is a Masked Object)
- Use ALL CAPS when referring to objects in documentation to make them stand out

## Object Types to Watch For

- **Hub objects**: Things that many other objects nest inside. Natural navigation anchors.
- **Shapeshifters**: Objects that appear differently across products or contexts. Differences should be intentional.
- **Masked objects**: Different objects hiding behind the same name, or the same object hiding behind different names. Always bad — unmask them.
- **Phantom objects**: Objects users expect but that don't exist in the system yet. Opportunity or gap — validate with SIP.

## Validation Questions

When unsure if something is an object, ask:
1. "Could you imagine a detail page for this?"
2. "Can you name 2–3 specific examples?"
3. "Would a user ever search for or browse a list of these?"
4. "Does this thing have its own lifecycle (created, modified, archived)?"
5. "Is this a thing in the real world, or just a UI element?"

## Related Skills

- For full Object Discovery facilitation: use skill `01-object-discovery`
- For building comprehensive Object Guides: use skill `05-object-guide-builder`
- For designing distinct Object Cards: use skill `09-object-card-designer`
- For checking object consistency across contexts: use skill `12-shapeshifter-matrix-builder`
