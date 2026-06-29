# Rules

Cursor `.mdc` rules for the Design Dash workflow. Copy or symlink the rules you need into `.cursor/rules/` in your working project.

| Rule | `alwaysApply` | When to use |
|---|---|---|
| `ooux-overview.mdc` | `true` | All OOUX/ORCA sessions — provides skill routing, object library access guidance, and the Four Ancient Truths |
| `ooux-collaboration.mdc` | `true` | All OOUX/ORCA sessions — enforces "never assume" discipline, checkpoint rules, and output path conventions |
| `ooux-ux-research.mdc` | `false` | Research planning and synthesis sessions — method selection, ORCA-aligned coding, sample sizes |

## How to apply

```bash
# Copy rules into your project's Cursor rules folder
cp path/to/design-dash/rules/*.mdc .cursor/rules/

# Or symlink them (stays in sync with upstream)
ln -s path/to/design-dash/rules/ooux-overview.mdc .cursor/rules/ooux-overview.mdc
```

The two `alwaysApply: true` rules fire on every agent session in a project where they are installed. The `ooux-ux-research.mdc` rule is opt-in — activate it when your session involves research planning or synthesis work.
