---
name: create-block
description: Create a new EDS block from Confluence requirements and Figma design context
argument-hint: 'block-name confluence-link'
---

Follow all rules in `/agents.md` and `.github/instructions/copilot-instructions.md`.
If there is any conflict, `/agents.md` wins.

## Pattern and reference sources

Do **not** treat unrelated folders under `blocks/` as the primary source of EDS conventions. For architecture, UE models, decorator flow, and vetted reference implementations, use [Block Development](../skills/block-development/SKILL.md), [Universal Editor](../skills/universal-editor/SKILL.md), and [Block catalog](../skills/block-catalog.md) (links to reference snippets under `.github/skills/`). Only read `blocks/<block-name>/` for the block you are creating in this workflow.

Use this prompt as:

`create-block <block-name> <confluence-link>`

> **Note:** This prompt runs the full end-to-end workflow in one go.
> You can also run each phase independently using the focused prompts:
> 1. `get-requirements <block-name> <confluence-link>` — extract & normalise requirements
> 2. `build-block <block-name>` — scaffold & implement the block
> 3. `review-block <block-name>` — validate against Figma

## Objective

Create a new block by:

1. Extracting requirements from Confluence.
2. Creating and populating `docs/requirements/<block-name>/requirements.md` with Confluence information before any Figma extraction.
3. Extracting **design context and screenshots** from all linked Figma files (same rules as [get-requirements](get-requirements.prompt.md) Phase 2 — visual reference matrix and `docs/requirements/<block-name>/figma/`).
4. Building block files in the defined order.

**Shortcut:** Prefer running `get-requirements <block-name> <confluence-link>` then `build-block <block-name>` so Figma capture stays canonical; this prompt duplicates the full pipeline when used alone.

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
- [Figma Comparison](../skills/figma-comparison/SKILL.md)

## Phase 1: Confluence Requirements Extraction

1. Use the Confluence connector to load the provided `<confluence-link>`.
2. Immediately create `docs/requirements/<block-name>/requirements.md`.
3. Extract and write all Confluence requirements into the file before any Figma connector calls are made.
4. Use the following structure in `docs/requirements/<block-name>/requirements.md` (structure mirrors [requirements-template.md](../skills/block-development/examples/requirements-template.md)).
5. Treat these sections as expected defaults (if present):
   - Requirements
   - Block Dialogue
   - Block UI
   - Annotations and States
   - Accessibility
6. Also capture any additional sections if present, including:
   - Design tokens and theming (as stated in Confluence / Figma)
   - Browsers and devices (if specified)
   - User interaction and design specs
   - Technical specs/SOPs
   - Questions/Decisions
   - Signoffs and approvals
   - Related documents
7. Do not drop content. If a section is missing, add a heading and mark it as `Not provided`.

## Phase 2: Figma Design Context And Screenshot Extraction

Follow **Phase 2** of [get-requirements.prompt.md](get-requirements.prompt.md) in full (`get_design_context` + `get_screenshot` per node, save PNGs under `docs/requirements/<block-name>/figma/`, Figma visual reference matrix in `requirements.md`). Do not skip screenshots — `build-block` / `review-block` depend on them.

## Phase 3: Normalize And Validate Requirements

1. Review `docs/requirements/<block-name>/requirements.md` for structure, duplicates, and contradictions.
2. Normalize into clear subsections:
   - Authoring requirements
   - Rendering/markup requirements
   - Accessibility requirements
   - Variant/state matrix
   - Validation rules
   - Open questions
3. If critical requirements are ambiguous or contradictory, stop and ask targeted questions before code creation.

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
3. Confirm accessibility expectations from requirements are represented in stories and markup.

## Phase 6: Figma Comparison

Use the [Figma Comparison skill](../skills/figma-comparison/SKILL.md) to validate the implementation against Figma and iterate toward pixel-perfect output.

### Figma MCP tools (mandatory)

- **`get_screenshot`** — **Use for look and feel.** Capture the component frame (and key variants) to compare visually with Storybook; align with saved PNGs under `docs/requirements/<block-name>/figma/` when present.
- **`figma-get_design_context`** — Validates **measurable** values: colors, font sizes, weights, spacing, border-radius (use MCP output for SCSS literals, not eyedropper on screenshots).
- **`npm run figma:compare`** — Structural layout diff (positions, widths, heights, alignment).

### Steps

1. **Visual pass** — call **`get_screenshot`** on the main Figma node; keep it visible while implementing. Refresh after major SCSS changes.

2. **Measurable audit** — call `figma-get_design_context` on the main Figma node. Cross-check every color, font-size, font-weight, line-height, spacing, and gap value against `blocks/<block-name>/<block-name>.scss` and fix mismatches.

3. **Add a `FigmaMatch` story** — following `examples/figmamatch-story-pattern.md` in the Figma Comparison skill:
   - `layout: 'fullscreen'`
   - `requestAnimationFrame` decorator to remove container `max-width` / `padding`
   - Mock data matching Figma content exactly

4. **Download Figma images** — for any image asset in the Figma design:
   - Call `figma-get_screenshot` on the image node to warm the MCP asset cache
   - Download to `images/<block-name>-<descriptor>.png`
   - Confirm `'../images'` is in `.storybook/main.js` `staticDirs` (add if missing — requires Storybook restart)
   - Confirm `/images/*` is in `.gitignore` (add if missing)
   - Reference in mocks as `/<block-name>-<descriptor>.png`

5. **Baseline comparison** — with Storybook running:
   ```bash
   npm run figma:compare -- --story-id=blocks-<block-name>--figma-match --figma-node-id=<node-id>
   ```
   Open `tools/compare-output/composite.png` (Figma | Storybook | Diff). Identify all red areas.

6. **Iterate** — for each red area in `diff.png`:
   - Fix in `blocks/<block-name>/<block-name>.scss` (never the generated `.css`)
   - Run `npm run scss:build`
   - Re-run `npm run figma:compare -- --story-id=blocks-<block-name>--figma-match`
   - Repeat until mismatch ≤ 2%

7. **Accept the ~2% floor** — remaining diff after reaching ~2% is font anti-aliasing caused by Figma MCP exporting at ~0.65× scale vs Storybook rendering at 1×. This is not a real layout error.

### SCSS pipeline rule

Never edit `.css` files — they are regenerated from `.scss` on every `npm run storybook`. All fixes must be in the `.scss` source.

## Output Summary Requirements

Provide a concise delivery summary containing:

1. Confluence sections extracted.
2. Figma links processed.
3. Requirements file created path.
4. Block files created.
5. Commands executed and outcomes.
6. Figma comparison result: final mismatch %, key fixes applied.
7. Any open questions still requiring user decision.
