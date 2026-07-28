/**
 * MDX component scope — injected by MDXProvider at root.
 * Agents write tag-only MDX; no imports needed in phase files.
 *
 * ONLY export components in the MVP allowlist.
 * Adding a component here without updating check.mjs + COMPONENT_CATALOG.md is a bug.
 */

export { DashShell } from './DashShell'
export { PlanPhases } from './PlanPhases'
export { PhaseSection } from './PhaseSection'
export { Placeholder } from './Placeholder'
export { Decision } from './Decision'
export { AssumptionRow } from './AssumptionRow'
export { GateStatus } from './GateStatus'
export { GateTrack } from './GateTrack'
export { WireframeEmbed } from './WireframeEmbed'
export { OpenQuestions } from './OpenQuestions'
export { Takeaway } from './Takeaway'
export { ScenarioFlow } from './ScenarioFlow'
export { ConceptCompare } from './ConceptCompare'
export { ConceptCard } from './ConceptCard'
export { ScopeBoundary } from './ScopeBoundary'
export { StatRow } from './StatRow'
export { Detail } from './Detail'

import { DashShell } from './DashShell'
import { PlanPhases } from './PlanPhases'
import { PhaseSection } from './PhaseSection'
import { Placeholder } from './Placeholder'
import { Decision } from './Decision'
import { AssumptionRow } from './AssumptionRow'
import { GateStatus } from './GateStatus'
import { GateTrack } from './GateTrack'
import { WireframeEmbed } from './WireframeEmbed'
import { OpenQuestions } from './OpenQuestions'
import { Takeaway } from './Takeaway'
import { ScenarioFlow } from './ScenarioFlow'
import { ConceptCompare } from './ConceptCompare'
import { ConceptCard } from './ConceptCard'
import { ScopeBoundary } from './ScopeBoundary'
import { StatRow } from './StatRow'
import { Detail } from './Detail'
import { PreBlock } from './MermaidBlock'

// MDXProvider components map — key must match JSX tag name exactly.
// Lowercase keys override intrinsic Markdown elements: `pre` swaps ```mermaid
// fences for rendered diagrams and leaves every other fence alone.
export const components = {
  DashShell,
  PlanPhases,
  PhaseSection,
  Placeholder,
  Decision,
  AssumptionRow,
  GateStatus,
  GateTrack,
  WireframeEmbed,
  OpenQuestions,
  Takeaway,
  ScenarioFlow,
  ConceptCompare,
  ConceptCard,
  ScopeBoundary,
  StatRow,
  Detail,
  pre: PreBlock,
}
