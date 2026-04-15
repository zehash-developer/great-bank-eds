---
applyTo: '**'
---

# AI Agent Guide — Great Bank AEM Edge Delivery Services (EDS)

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
- [SCSS Styling](.github/skills/scss-styling/SKILL.md) — spacing(), breakpoints, and SCSS variables derived from Figma
- [Icon Usage](.github/skills/icon-usage/SKILL.md) — Using GEL icons, logos, and pictograms
- [Storybook](.github/skills/storybook/SKILL.md) — Stories, mocks, and interaction tests
- [Figma Comparison](.github/skills/figma-comparison/SKILL.md) — `get_screenshot` for look-and-feel, `get_design_context` for values, `figma:compare` for layout diff
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

All blocks must be validated against their Figma design before delivery. Use **screenshots for look-and-feel**, **design context for numbers**, and **compare for automated diff**.

### Visual reference — `get_screenshot` (encouraged)

Call **`get_screenshot`** on the Figma node(s) you are implementing. Use it as the **primary check** that the component matches the design’s look, hierarchy, and density. Save outputs where the team can compare them to Storybook (see prompts: `docs/requirements/<block>/figma/`, `images/`, or the compare tool’s cached reference). Refresh screenshots when the design or your implementation changes.

### Measurable values — `get_design_context`

Call `get_design_context` on the Figma node to read **exact** values for implementation:

- Colors, typography, spacing, padding, gap, border-radius (do not sample these from screenshot pixels — use the API output)
- Map each value into **SCSS** (and JS when needed): CSS custom properties on the block or shared partials under `styles/`. **If Figma specifies a value and no variable exists yet, add one.**

Align SCSS with `get_design_context` **and** re-verify visually with **`get_screenshot`** or `figma:compare`.

### Layout comparison — `npm run figma:compare`

Run `npm run figma:compare` (Playwright + pixelmatch) for structural layout diffing. A mismatch of ≤ 2% is often acceptable — remaining diff can be font anti-aliasing from Figma MCP exporting at ~0.65× scale vs Storybook at 1×.

### SCSS Pipeline Rule

**Never edit generated `.css` files.** The `storybook` script runs `scss:build` on every restart, regenerating all CSS from SCSS. All styling changes must go in `blocks/<name>/<name>.scss`.

### Images for Storybook Stories

Figma image assets used in stories must be saved to `images/<block-name>-<descriptor>.png` (gitignored) and served via Storybook's `staticDirs`. Never reference ephemeral `http://localhost:3845/assets/` URLs in committed mock files.

See [Figma Comparison skill](.github/skills/figma-comparison/SKILL.md) for the full workflow.
