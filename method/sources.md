# Design Dash — Sources Registry

Grounding for method recommendations. Each entry maps a source to the phase(s) it strengthens and what the Dash borrows from it. Maintained alongside the companion NotebookLM notebook ("Design Dash", id `b34188d3-5afd-4da0-a7b4-05975499200f`) which holds the full indexed corpus.

Add new sources here **and** to the notebook so both stay in sync. When a skill cites an external practice, cite the registry entry.

---

## P0 — Preconditions & tiering

| Source | Contribution |
|---|---|
| [SVPG — Product Discovery, Strategy & Empowered Teams](https://www.svpg.com/articles/) (Marty Cagan) | Risk-based discovery discipline; decisions pushed to those closest to the problem — rationale for rule-derived tiers over self-selection |
| [Privacy Gate skill](../skills/7-critique-testing/privacy-gate/SKILL.md) (internal) | Regulated-data triggers forcing High-stakes classification |

## P1 — Opportunity & evidence

| Source | Contribution |
|---|---|
| [Opportunity Solution Trees](https://producttalk.org/2024/06/opportunity-solution-tree/) (Teresa Torres) | Framing problems as outcome-linked opportunity maps; evidence-first discovery |
| [Assumption Mapping](https://www.designbetter.co/practices/assumption-mapping) (Design Better) | Classifying assumptions by importance vs evidence — basis of the assumptions register |
| [RICE Prioritization](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/) (Intercom) | Reach × Impact × Confidence ÷ Effort scoring used in P1 sizing and P4 RICE mapping |

## P2–P3 — Intake & framing lock

| Source | Contribution |
|---|---|
| [GOV.UK content design guidance](https://www.gov.uk/guidance/content-design) | Start from verified user needs; plain English; content lifecycle management — feeds intake questions and voice-and-style |
| [Design Sprint Kit](https://designsprintkit.withgoogle.com/resources/overview) (Google Ventures) | Facilitation structures for intake workshops (group mode) |

## P4 — Object modeling

| Source | Contribution |
|---|---|
| [OOUX Resources](https://ooux.com/resources) (Sophia Prater / OOUX.org) | Canonical ORCA round-trip, object guides, Four Ancient Truths, CTA matrix |
| [20 Product Prioritization Techniques](https://foldingburritos.com/blog/product-prioritization-techniques/) (Folding Burritos) | Map of prioritization methods; positioning of Kano/RICE/QFD within them |
| [Kano Model guides](https://foldingburritos.com/blog/kano-model/) (Folding Burritos) + [Kano survey categories tool](https://www.kanosurveys.com/kano-model-categories-tool) | Paired functional/dysfunctional questioning, evaluation table, Better/Worse coefficients — basis of `kano-prioritization` |
| [Graph databases & knowledge graph modeling](https://neo4j.com/blog/knowledge-graph/how-to-build-knowledge-graph/) (Neo4j) | Node-vs-property decision test; reification of n-ary facts — basis of `object-graph-export` |
| [Event Storming](https://www.eventstorming.com/) (Alberto Brandolini) | Group noun-discovery warm-up alternative for P4.1 (workshop mode) |
| [Domain Storytelling](https://domainstorytelling.org/) | Sentence-pattern elicitation of objects/actions — complement to noun foraging |

## P5 — Flow & IA synthesis

| Source | Contribution |
|---|---|
| [User Story Mapping](https://www.jpattonassociates.com/the-new-backlog/) (Jeff Patton) | Journey-spine derivation of page lists; narrative flow ordering |
| [NN/g 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) (Nielsen Norman Group) | Heuristic lens for flow critique checkpoints |

## P6 — Divergence & selection

| Source | Contribution |
|---|---|
| [Design Sprint — Decide exercises](https://www.gv.com/sprint/) (GV / Jake Knapp) | Note-and-vote, art museum, straw poll — structured selection mechanics |
| [QFD House of Quality / Pugh matrix coverage](https://foldingburritos.com/blog/product-prioritization-techniques/) (via Folding Burritos) | Importance × relationship scoring for weighted concept comparison |

## P7 — Wireframe & critique

| Source | Contribution |
|---|---|
| [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) (W3C WAI) | Normative checklist behind `a11y-audit` |
| [Deceptive Patterns](https://www.deceptive.design/) (Harry Brignull) | Dark-pattern registry behind the ethics floor |
| [Microsoft Inclusive Design toolkit](https://inclusive.microsoft.design/) | Permanent-to-temporary persona spectrum behind equity review |
| [UI-Patterns.com](https://ui-patterns.com/patterns) | Pattern vocabulary aligned with `ui-interaction` decision tree |

## P8 — Plan assembly & handoff

| Source | Contribution |
|---|---|
| [Working Backwards / PRFAQ](https://www.productplan.com/glossary/working-backwards/) (Product Plan) | Write-the-press-release discipline informing requirements.md narrative sections |
| [Gherkin reference](https://cucumber.io/docs/gherkin/reference/) (Cucumber) | Given/When/Then acceptance-criteria format used by `user-story-writer` |
| [SOLID principles explained](https://www.splunk.com/en_us/blog/learn/solid-design-principle.html) (Splunk) | SRP/OCP boundary guidance in `engineering-handoff` |
| [clig.dev — Command Line Interface Guidelines](https://clig.dev/) | Severity-scoped confirmations, flags-over-prompts, stream separation — tooling conventions |

## Cross-cutting — orchestration & tooling

| Source | Contribution |
|---|---|
| [Agent orchestration patterns](https://learn.microsoft.com/en-us/agent-framework/overview/) (Microsoft Agent Framework) | Sequential vs graph-based orchestration; concurrent critique; HITL interrupt checkpoints |
| [Semantic Kernel agent architecture](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/) (Microsoft) | Skill/tool separation; progressive disclosure of skill metadata |
| [Heroku CLI style guide](https://devcenter.heroku.com/articles/cli-style-guide) + [CLI design principles](https://www.atlassian.com/blog/it-teams/10-design-principles-for-delightful-clis) (Atlassian) | Noun/verb command namespaces; skim-friendly output chunks for tool UX |

---

## Registry maintenance rules

1. New entries require: URL, phase mapping, one-line contribution.
2. Prefer stable canonical URLs over aggregators or social posts.
3. When a recommendation in a skill cites an external framework, name the registry entry — evidence labels apply to methods too (`observed` = field-proven in a dash, `reported` = documented elsewhere, `assumed` = untested here).
