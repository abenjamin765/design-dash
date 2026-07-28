import React from 'react'

interface ScenarioFlowProps {
  user?: string
  trigger?: string
  goal?: string
  children?: React.ReactNode
}

/**
 * ScenarioFlow — a scenario header (who / when / what they want) above its steps.
 *
 * Children hold an ordered Markdown list; CSS turns the list into numbered step
 * cards with connectors, so authors keep writing plain `1.` lists and the flow
 * still exports as a list.
 */
export function ScenarioFlow({ user, trigger, goal, children }: ScenarioFlowProps) {
  return (
    <div className="scenario-flow wide-block">
      {(user || trigger || goal) && (
        <dl className="scenario-flow__header">
          {user && (
            <div className="scenario-flow__field">
              <dt>User</dt>
              <dd>{user}</dd>
            </div>
          )}
          {trigger && (
            <div className="scenario-flow__field">
              <dt>Trigger</dt>
              <dd>{trigger}</dd>
            </div>
          )}
          {goal && (
            <div className="scenario-flow__field">
              <dt>Goal</dt>
              <dd>{goal}</dd>
            </div>
          )}
        </dl>
      )}
      <div className="scenario-flow__steps">{children}</div>
    </div>
  )
}
