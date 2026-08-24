# Glossary

**Dash:** <!-- dash-name -->  
**Dash ID:** <!-- scope.md dash_id -->  
**Version:** 0.1.0  
**Last updated:** YYYY-MM-DD  
**Owner:** <!-- content designer or design lead -->

> **Governance (req §12.7):** This glossary is a versioned, owned artifact. Default owner: the dash owner, established at P2 intake and recorded above. When a canonical object library term changes, dependent glossaries should be reviewed. Do not diverge a UI label from the canonical object library term without recording the exception here and in the sign-off ledger.
>
> **Mandatory destinations:** every new UI label gets a row at P6 review; every concept→icon pair decided during ORCA→UI mapping (`skills/_cross-cutting/orca-ui-mapping`, § Iconography) gets a row here — that skill's gate checklist points here, and no other artifact owns this mapping.

---

## Terms

| term | canonical-object | code-identifier | ui-label | owner | version | notes |
|---|---|---|---|---|---|---|
| <!-- Human-readable term used in documentation and internal communication --> | <!-- Slug from your local object library (e.g. `account`, `project`) --> | <!-- TypeScript / API identifier (e.g. `AccountEntity`, `project_id`) --> | <!-- Exact label as it appears in the UI --> | <!-- content designer or domain owner --> | <!-- Semver patch bump when the label changes --> | <!-- Record any divergence from canonical-object with rationale --> |

<!-- Add rows below. -->

---

## Stale terms

Terms where the canonical object library term has changed:

| term | stale-since | canonical-now | action-required |
|---|---|---|---|
| <!-- term --> | <!-- date --> | <!-- new canonical term --> | Update ui-label and code-identifier |

---

## Usage

- **P6 review:** content designer reviews all UI labels against this glossary; any new label gets a row.
- **Staleness check:** when the object library changes a canonical term, review this glossary and resolve before P8.
