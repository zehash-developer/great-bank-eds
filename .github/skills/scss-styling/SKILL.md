---
name: scss-styling
description: Apply SCSS conventions for EDS blocks using spacing utilities, design tokens, responsive mixins, and block-scoped styles.
argument-hint: '[block scss path] [styling task]'
---

# SCSS Styling

Use this skill when implementing or reviewing block styles.

## Workflow

1. Use `spacing()` for spacing and layout.
2. Use design tokens via `var(--token-name)` for colors and related values.
3. Keep styles block-scoped; avoid global leakage.
4. Follow repo breakpoint and nesting conventions.
5. Ensure accessibility and contrast requirements are met.

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)

## Resources

- Checklist: [examples/checklist.md](./examples/checklist.md)
- Example pattern: [examples/block-style-pattern.scss](./examples/block-style-pattern.scss)
