---
name: build-block
description: Scaffold and implement an EDS block from an existing requirements file
argument-hint: 'block-name'
---

Follow all rules in `/agents.md` and `.github/instructions/copilot-instructions.md`.
If there is any conflict, `/agents.md` wins.

## Pattern and reference sources

Do **not** browse unrelated `blocks/*` directories for implementation patterns. Use [Block Development](../skills/block-development/SKILL.md), [Universal Editor](../skills/universal-editor/SKILL.md), and [Block catalog](../skills/block-catalog.md). Only implement files under `blocks/<block-name>/` for the target block named in this prompt.

Use this prompt as:

`build-block <block-name>`

## Objective

Scaffold and implement a block from an existing requirements file at `docs/requirements/<block-name>/requirements.md`.

**Preflight:** Read `docs/requirements/<block-name>/requirements.md` before doing anything else. If the file does not exist, stop and tell the user to run `get-requirements <block-name> <confluence-link>` first. For section expectations, compare against [requirements-template.md](../skills/block-development/examples/requirements-template.md).

**Figma visual baseline (mandatory):**

1. Locate the **Figma visual reference matrix** and any paths under `docs/requirements/<block-name>/figma/`. Open each saved screenshot while implementing; treat them as the acceptance target for layout, density, and hierarchy alongside token data in the requirements text. **Call `get_screenshot`** on the live Figma node whenever you need to refresh the exact look-and-feel (new variants, after large refactors, or if saved PNGs are stale).
2. If screenshots or the matrix are missing for a node you must ship, **stop** and run the same capture steps as in `get-requirements` (Figma MCP `get_screenshot` + `get_design_context` per node), save files under `docs/requirements/<block-name>/figma/`, and update `requirements.md` before continuing substantive block work.
3. During **SCSS and markup iteration**, repeatedly compare Storybook (or the closest local preview) to those screenshots — not only to the written spec. Adjust spacing, alignment, and component structure until the live render matches the screenshot intent before calling the build complete.

Once complete, run `review-block <block-name>` to validate the implementation against Figma **and** the saved requirement-phase screenshots.

## Required References

- [Block catalog](../skills/block-catalog.md)
- [Universal Editor](../skills/universal-editor/SKILL.md)
- [Block Development](../skills/block-development/SKILL.md)
- [Semantic HTML](../skills/semantic-html/SKILL.md)
- [Vanilla JavaScript](../skills/vanilla-js/SKILL.md)
- [SCSS Styling](../skills/scss-styling/SKILL.md)
- [Storybook](../skills/storybook/SKILL.md)
- [Accessibility](../skills/accessibility/SKILL.md)
- [Icon Usage](../skills/icon-usage/SKILL.md)

## Phase 4: Block Scaffolding And Implementation

Create files under `blocks/<block-name>/` in this exact order:

1. `_<block-name>.json`
   - Build first using the Universal Editor skill.
   - Model fields directly from the extracted requirements.
   - Use conditional rendering (`condition`) where required.
   - If icon picking is required, use manifest-backed icon picker patterns from the UE/Icon skills.
2. `<block-name>.js`
   - Build with the Block Development skill.
   - Use `extractData()` -> `renderHTML()` -> `decorate()` separation.
   - Bind implementation to authored fields from `_<block-name>.json`.
   - Preserve Universal Editor instrumentation when moving/replacing DOM.
3. `<block-name>.scss`
   - Build with SCSS Styling and token usage.
   - Keep all styles block-scoped.
   - After each meaningful styling pass, **compare Storybook to the Figma screenshots** listed in `requirements.md` (side-by-side). Prefer fixing layout and structure mismatches before fine-tuning tokens.
4. Compile CSS
   - Run `npm run scss:build` after SCSS creation.
5. `<block-name>.mocks.js`
   - Create mocks for required-only, optional, boundary, and variant cases.
6. `<block-name>.stories.js`
   - Use real `decorate()` function from block JS.
   - Cover all mock variants and key interaction states.

After creating/updating `_<block-name>.json`, run:

`npm run build:json`

## Phase 5: Verification

1. Validate no errors in created files.
2. Run Storybook and verify stories render correctly:
   - `npm run storybook`
3. **Screenshot pass:** For every row in the Figma visual reference matrix, confirm there is a Storybook story (or viewport) that can be compared to the saved requirement screenshot. Visually scan Storybook against each `docs/requirements/<block-name>/figma/*.png` reference; note any obvious gaps before handoff to `review-block`.
4. Confirm accessibility expectations from requirements are represented in stories and markup.

## Output Summary

Provide a concise summary containing:

1. Block files created.
2. Commands executed and outcomes.
3. **Figma screenshot references used** (paths under `docs/requirements/<block-name>/figma/`) and confirmation that Storybook was checked against them before handoff.
4. Any open questions still requiring user decision.
