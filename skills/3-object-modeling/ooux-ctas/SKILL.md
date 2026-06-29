---
id: ooux-ctas
title: OOUX Calls-to-Action (CTAs)
stage: 3-object-modeling
version: "0.1.0"
orca_round: supporting
orca_pillar: ctas
orca_step: 0
description: >
  Reference knowledge for identifying, categorizing, prioritizing, and mapping user
  actions (CTAs) on objects. Use when discussing user actions, interaction patterns,
  action inventories, calls-to-action, or what users can do with objects. Companion
  to the procedural 03-cta-matrix-builder and 07-cta-prioritization skills.
roles:
  - ux-designer
  - product-manager
  - engineer
tags:
  - ctas
  - actions
  - p-s-t-q
  - cta-matrix
  - ooux
difficulty: beginner
estimated_duration_minutes: 0
system_prompt_file: SKILL.md
---

# OOUX Calls-to-Action (CTAs)

Use this knowledge when helping users identify, categorize, prioritize, or map the actions available on objects.

## The Ancient Truth of CTAs

> Humans act on objects through direct manipulation.

Users expect to act on the thing they're looking at, right where they're looking at it. CTAs should be attached directly to the objects they affect.

## What is a CTA?

A CTA (Call-to-Action) is something a user can **do** to or with an object. In OOUX, every action belongs to a specific object. "Create Project" is a CTA on the PROJECT object. "Assign Task" is a CTA on the TASK object (or the USER object, depending on perspective).

CTAs are the "verbs" that act on "nouns" (objects). The CTA Matrix is where nouns and verbs meet.

## CTA Categories

### By Lifecycle Stage (CRUD+)

1. **Create**: Bring a new instance into existence — Create, Add, Upload, Import, Clone, Generate
2. **Read/View**: Access and consume information — View, Open, Preview, Download, Export, Print
3. **Update**: Modify an existing instance — Edit, Rename, Move, Reassign, Update, Configure
4. **Delete/Archive**: Remove or retire an instance — Delete, Archive, Deactivate, Remove, Trash
5. **Transition**: Change the state of an instance — Submit, Approve, Reject, Publish, Complete, Start

Start with CRUD as a baseline, then look for domain-specific CTAs beyond CRUD.

### By Actor

- **User CTAs**: Actions a human performs intentionally
- **System CTAs**: Actions the system performs automatically
- **Batch CTAs**: Actions performed on multiple instances at once

### By Scope

- **Object-level CTAs**: Actions on the object itself (Edit Project, Delete Task)
- **Relationship CTAs**: Actions that create/modify relationships (Add User to Project)
- **Attribute-level CTAs**: Actions on specific attributes (Change Status)

## The CTA Matrix

A grid mapping CTAs to objects. Each cell answers: "Can a user [CTA] a [Object]?"

| CTA | User | Project | Task | Document |
|---|---|---|---|---|
| **Create** | Yes (Admin) | Yes (Manager) | Yes (Member) | Yes (Member) |
| **View** | Yes (All) | Yes (All) | Yes (All) | Yes (All) |
| **Edit** | Yes (Admin) | Yes (Manager) | Yes (Assignee) | Yes (Author) |
| **Delete** | Yes (Admin) | Yes (Admin) | Yes (Manager) | Yes (Admin) |
| **Assign** | — | — | Yes (Manager) | — |

### CTA Matrix Rules

- Note WHO can perform each CTA (role-based access)
- Distinguish between "not applicable" (—) and "not permitted" (No)
- System-generated CTAs still count — note them as "System only"
- During Discovery (Round 1), brainstorm broadly — don't filter yet
- During Prioritization (Round 2), force-rank each CTA

## P/S/T/Q Force Ranking

In the Prioritization Round, every CTA must be force-ranked into one of four tiers. This ranking directly determines UI placement and visual prominence:

**P — Primary**: The single most important action. Shown as a prominent button, always visible. Only one CTA per object should be Primary.

**S — Secondary**: Important actions performed regularly but not the main one. Visible but less prominent.

**T — Tertiary**: Occasional actions. Hidden in overflow menus or "more actions" dropdowns.

**Q — Quaternary**: Rare or admin-only actions. Buried in settings, admin panels, or batch-operation tools.

### P/S/T/Q Rules

- Force the ranking — every CTA must land in exactly one tier
- Only ONE Primary per object (if you can't choose, you haven't prioritized enough)
- The ranking is role-aware: a Manager's Primary CTA may differ from a Member's
- If two CTAs feel equally important, ask: "If a user could only do ONE thing, which would it be?"

## CTA Anti-Patterns

**Broken Objects** (the key anti-pattern) — Objects that users can see but can't act on directly. They have to navigate somewhere else, go to a parent object, or use an indirect pathway.
- Fix: Attach CTAs to the objects they affect. Use the CTA Placement Designer (step 11) to position CTAs on cards and detail pages.

Other anti-patterns:
1. **Orphaned CTA**: An action that doesn't belong to any object. Fix: identify what object it acts upon.
2. **CTA overload**: Too many actions on one object, cluttering the UI. Fix: force-rank with P/S/T/Q.
3. **Ambiguous CTA**: "Manage" or "Process" — too vague. Fix: be specific about what the action does.
4. **Missing lifecycle**: An object can be created but not deleted or archived. Fix: consider the full lifecycle.
5. **Wrong object**: "Add Member" on the Project page — is this a CTA on User or on Project? Answer: it's a relationship CTA (Add User TO Project).

## Questions to Ask Users

1. "What can a user DO with a [Object]? List every action."
2. "Which action is the MOST important? What do users do first or most often?"
3. "Who is allowed to perform this action? All users, or specific roles?"
4. "Does the system perform any actions automatically on this object?"
5. "Can users perform this action on multiple [Objects] at once?"
6. "If you could only have ONE button on a [Object] card, what would it be?" (forces Primary selection)

## Related Skills

- For building the full CTA Matrix (Discovery): use skill `03-cta-matrix-builder`
- For force-ranking CTAs with P/S/T/Q (Prioritization): use skill `07-cta-prioritization`
- For positioning CTAs on cards and pages (Representation): use skill `11-cta-placement-designer`
- For writing object-oriented user stories: use skill `user-story-writer`
