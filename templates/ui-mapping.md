<!-- TEMPLATE: UI Mapping (ORCA → UI)
     Saved to: dashes/{slug}/ui-mapping.md
     Produced by: skills/_cross-cutting/orca-ui-mapping at P6, before wireframing.
     One section per in-scope object. Consume the shapeshifter matrix and
     attribute/CTA prioritization — never re-derive them here.
-->

**Project:** [{Project Name}](link-to-project-hub)

---

## {Object Name}

### Object Brief

| Field | Value |
| --- | --- |
| **Definition** | {One sentence — link to object guide} |
| **Identity attributes** | {Rank #1–2 attributes} |
| **Status model** | {States + which are actionable} |
| **Key relationships** | {Object → cardinality → typical count} |

### Visual-Role Classification

| Attribute | Visual role | Rationale |
| --- | --- | --- |
| {Attribute} | Identity / Distinguisher / Status / Primary data / Context / Metadata / Omitted | {Why} |

> Rules: exactly one role per attribute per context. If >2 attributes compete for Identity, flag back to ORCA. Metadata never outranks Primary data.

### Context Matrix

| Context | Dominant intents | Density | {Attr 1} | {Attr 2} | {Attr 3} | {Attr 4} |
| --- | --- | --- | --- | --- | --- | --- |
| {List page} | compare + monitor | high | {role → representation} | | | |
| {Card on parent} | recognize + monitor | low | | | | |
| {Detail page} | decide + manipulate | medium | | | | |
| {Dashboard tile} | monitor + decide | minimal | | | | |
| {Selection mode} | recognize + manipulate | reduced | | | | |

<!-- Cell format: role → representation class (e.g. "Status → badge", "Omitted").
     Rows are the standard five contexts; add or remove rows to match the shapeshifter matrix. -->

### Action Map

| Context | P | S | T | Q | Overrides applied |
| --- | --- | --- | --- | --- | --- |
| {Context} | {CTA} | {CTA} | {CTA} | {CTA} | {e.g. dashboard demotion, bulk collapse} |

### Novelty Log

| Interaction | Standard/Novel | Justification | Evidence label |
| --- | --- | --- | --- |
| {Interaction} | standard | — | — |
| {Interaction} | novel | {why established patterns fail; what users gain} | observed/reported/inferred/assumed |

### Open Questions

| Question | Assumption ID | Owner |
| --- | --- | --- |
| {Question} | A-### | {owner} |

### Template Deviations

<!-- Required if this artifact diverges structurally from templates/ui-mapping.md.
     One row per deviation: template section → what replaced it → why.
     Omit this section only when the structure matches the template exactly. -->

| Template section | Replaced by | Why |
| --- | --- | --- |
| <!-- e.g. Context Matrix --> | <!-- e.g. per-object context tables --> | <!-- reason --> |

---

## See Also

* [Shapeshifter Matrix: {Project}](link) — context inventory consumed above
* [Attribute Prioritization: {Project}](link) — rank source
* [CTA Placement: {Project}](link) — tier source
* [Wireframe](wireframe.html) — consumes this mapping
