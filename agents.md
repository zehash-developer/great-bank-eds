---
applyTo: '**'
---

# AI Agent Guide — Westpac AEM Edge Delivery Services (EDS)

This document defines how AI-assisted development is used in this repository.  
It is the single source of truth for coding standards, architecture, and guardrails.

This project is built using Adobe AEM Edge Delivery Services (EDS) with document-based authoring and JavaScript decorator blocks.

---

## Source of Truth and Conflict Resolution

If any guidance conflicts, follow this priority order strictly:

1. `/agents.md` (this document)
2. `.github/skills/*` (task-specific guidance)
3. `.github/instructions/copilot-instructions.md`
4. Everything else

AI agents must not merge or reinterpret conflicting rules.

---

## Documentation Index

### Skill Files

Task-specific detailed guidance:

- [Block catalog](.github/skills/block-catalog.md) — Inventory of implemented blocks, patterns, and links to repo sources / skill snapshots
- [Block Development](.github/skills/block-development/SKILL.md) — Creating blocks and applying the decorator pattern
- [Universal Editor](.github/skills/universal-editor/SKILL.md) — UE JSON: field types, options, conditional visibility, block vs block item patterns
- [Semantic HTML](.github/skills/semantic-html/SKILL.md) — Choosing HTML elements and defining ARIA structure
- [Vanilla JavaScript](.github/skills/vanilla-js/SKILL.md) — DOM manipulation, event handling, and debugging
- [SCSS Styling](.github/skills/scss-styling/SKILL.md) — spacing(), breakpoints, and style-config design tokens
- [Icon Usage](.github/skills/icon-usage/SKILL.md) — Using GEL icons, logos, and pictograms
- [Storybook](.github/skills/storybook/SKILL.md) — Stories, mocks, and interaction tests
- [Figma Comparison](.github/skills/figma-comparison/SKILL.md) — Validate Storybook stories against Figma using screenshot layout comparison and design token audit
- [Accessibility](.github/skills/accessibility/SKILL.md) — WCAG compliance, keyboard navigation, and screen readers
- [Carousel Usage](.github/skills/carousel-usage/SKILL.md) — Shared carousel utility integration and block patterns

### Prompt Files

- [New EDS Block](.github/prompts/new-eds-block.prompt.md)
- [Create Block](.github/prompts/create-block.prompt.md)
- [Clean EDS Block](.github/prompts/clean-eds-block.prompt.md)
- [Lint Fix](.github/prompts/lint-fix.prompt.md)

---

## Requirements Files

When creating new blocks, requirements should be documented in `docs/requirements/{block-name}.md`.  
See [Requirements Template](docs/requirements/_template.md) for the expected format. The same template is vendored with the Block Development skill at [.github/skills/block-development/examples/requirements-template.md](.github/skills/block-development/examples/requirements-template.md) for standalone skill bundles.

---

## Design Validation

All blocks must be validated against their Figma design before delivery. Use the two-tool approach:

### Tool 1 — Design Token Audit (`figma-get_design_context`)

Call `figma-get_design_context` on the Figma node to read exact values. Use this to validate:

- Colors (as CSS tokens — never trust screenshot colors due to color space differences)
- Font sizes, weights, line-heights
- Spacing, padding, gap, border-radius values

Fix all token mismatches in the `.scss` source **before** running any screenshot comparison.

### Tool 2 — Layout Comparison (`npm run figma:compare`)

After token fixes, run `npm run figma:compare` (Playwright + pixelmatch) to validate structural layout: positions, widths, heights, alignment. A mismatch of ≤ 2% is acceptable — the remaining diff is font anti-aliasing caused by Figma MCP exporting at ~0.65× scale vs Storybook at 1×.

### SCSS Pipeline Rule

**Never edit generated `.css` files.** The `storybook` script runs `scss:build` on every restart, regenerating all CSS from SCSS. All styling changes must go in `blocks/<name>/<name>.scss`.

### Images for Storybook Stories

Figma image assets used in stories must be saved to `images/<block-name>-<descriptor>.png` (gitignored) and served via Storybook's `staticDirs`. Never reference ephemeral `http://localhost:3845/assets/` URLs in committed mock files.

See [Figma Comparison skill](.github/skills/figma-comparison/SKILL.md) for the full workflow.
