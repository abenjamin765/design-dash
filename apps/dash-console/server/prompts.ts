/**
 * prompts.ts
 *
 * Generates clipboard-ready agent prompts for starting or resuming a Design Dash.
 * The designer copies these into Cursor/Claude opened in the product workspace.
 */

export interface PromptContext {
  slug: string
  workspace: string   // absolute path to the product repo
  tier?: string
  sessionMode?: string
  resumePhase?: string
}

export function startPrompt(ctx: PromptContext): string {
  const modeFlag = ctx.sessionMode === 'solo' ? ' --solo' : ''
  const workspaceNote = ctx.workspace
    ? `\n\nOpen your agent (Cursor/Claude Code) in: ${ctx.workspace}`
    : '\n\nOpen your agent in the design-dash repo (or any workspace with a dashes/ directory).'

  return `/design-dash${modeFlag}${workspaceNote}

Workshop slug (when the agent asks): ${ctx.slug}`
}

export function resumePrompt(ctx: PromptContext): string {
  const phase = ctx.resumePhase ?? 'P0'
  const modeFlag = ctx.sessionMode === 'solo' ? ' --solo' : ''
  const workspaceNote = ctx.workspace
    ? `\n\nOpen your agent in: ${ctx.workspace}`
    : '\n\nOpen your agent in the dash workspace.'

  return `/design-dash --phase ${phase}${modeFlag}${workspaceNote}

Workshop slug: ${ctx.slug}
Resuming from: ${phase}`
}
