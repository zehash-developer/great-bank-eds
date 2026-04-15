---
name: scss-styling
description: Apply SCSS conventions for EDS blocks using spacing utilities, Figma-derived CSS variables, responsive mixins, and block-scoped styles.
argument-hint: '[block scss path] [styling task]'
---

# SCSS Styling

Use this skill when implementing or reviewing block styles.

## Workflow

1. Take **colors, type, radii, and spacing** from the Figma node via `get_design_context`; use **`get_screenshot`** and saved requirement PNGs to judge **look and feel** while you style (see Figma Comparison skill).
2. Use `spacing()` where it matches Figma px (see Figma Comparison skill); otherwise use `rem`/`px` from the spec.
3. Expose repeated Figma values as **`var(--...)`** in block SCSS or shared `styles/` partials. **If no variable exists for a Figma value, define one** (block-scoped or shared) instead of hard-coding scattered literals.
4. Keep styles block-scoped; avoid global leakage.
5. Follow repo breakpoint and nesting conventions.
6. Ensure accessibility and contrast requirements are met.

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)

## Resources

- Checklist: [examples/checklist.md](./examples/checklist.md)
- Example pattern: [examples/block-style-pattern.scss](./examples/block-style-pattern.scss)
