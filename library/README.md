# Object Library

This folder contains object guides generated during Design Dash workshops. Each `.md` file documents one object in your product domain — its identity, attributes, actions, relationships, and design specifications.

See [`library/objects/_index.md`](objects/_index.md) for the full index of all guides.

## How it works

Object guides accumulate across dashes. An object modeled in one dash is available to all future dashes in the same repo. The library grows with your product understanding.

## Getting started

Use the `/design-dash` command to start a dash. Objects discovered during modeling are automatically written here as `library/objects/{slug}.md` files, and the index is updated at P4 (Reconcile phase).

## File structure

```
library/
├── README.md              # This file
└── objects/
    ├── _index.md          # Auto-generated index of all object guides
    ├── account.md         # Example: the Account object
    ├── project.md         # Example: the Project object
    └── ...
```

## Guide format

Each object guide is a markdown file with YAML frontmatter:

```yaml
---
name: Account
slug: account
status: stable       # draft | stable | needs-review | archived
dash: my-saas-dash   # which dash first modeled this object
summary: A registered user account with credentials and a profile.
relationships:
  - owns: [project, subscription]
  - belongs-to: [organization]
---
```

Followed by the full guide content: definition, SIP validation, attributes, CTAs, relationships, object card spec, and shapeshifter matrix.

## Editing guides

- Use `templates/object-guide.md` as the starting template for new guides.
- Update `_index.md` whenever you add or change a guide.
- Mark deprecated objects `archived` in the index rather than deleting them.
