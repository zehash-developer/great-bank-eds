---
name: new-eds-block
description: Scaffold a new EDS block using agents.md and project requirements
argument-hint: 'block-name'
---

Follow all rules in `/agents.md` and `.github/instructions/copilot-instructions.md`.
If there is any conflict, `/agents.md` wins.

## Pattern and reference sources

Do **not** use ad-hoc review of other directories under `blocks/` to decide patterns. Use [Block catalog](../skills/block-catalog.md) for vetted block inventory and links to reference JSON/JS under `.github/skills/`, plus the skills below.

**Reference these when scaffolding:**
- [Block catalog](../skills/block-catalog.md) — inventory of blocks, patterns, and links to UE/JS reference snippets in the skills bundle
- [Block Development](../skills/block-development/SKILL.md) — EDS block lifecycle, extraction/render/decorate flow, `moveInstrumentation()`, document-based vs UE content
- [Universal Editor](../skills/universal-editor/SKILL.md) — UE JSON: definitions, models, filters, field types, options, conditional visibility, block vs block/item, section registration
- [Semantic HTML](../skills/semantic-html/SKILL.md) — Semantic structure and ARIA guidance
- [Vanilla JavaScript](../skills/vanilla-js/SKILL.md) — Event scoping and DOM safety

## Preflight (must do before any code)
1) Locate and read `docs/requirements/${input}.md`.
2) If the file does not exist: STOP and ask me to provide it or confirm the correct requirements filename.
   - Requirements files should follow the template: `docs/requirements/_template.md` (identical portable copy: [requirements-template.md](../skills/block-development/examples/requirements-template.md))
3) If requirements are unclear (missing authored HTML shape, missing field constraints, missing variations): STOP and ask targeted questions instead of guessing.

## Goal
Using `docs/requirements/${input}.md`, scaffold a new EDS block named `${input}`.

## Output files (create all)
1) `blocks/${input}/${input}.js`
  - Must use extraction → rendering → decorate separation (see [Block Development](../skills/block-development/SKILL.md)).
   - Include: `extract{Block}BlockFromUE`, `extract{Block}BlockFromDOM`, `writeBlockData`, `bakeBlockLevel`. For blocks with row items: `get{Block}RowType`, `extract{Block}ItemFromDOM`, `write{Block}ItemFromUE`, `write{Block}ItemFromDOM`, `bake{Block}ToDataset`.
   - Import `isAuthoringMode`, `getUEText`, `getUERichTextHTML` from `scripts/utility/shared.js`.
   - Preserve AEM Universal Editor instrumentation using `moveInstrumentation()` when moving/replacing DOM.
   - Semantic HTML + WCAG accessibility + full keyboard support (as required by the spec).
   - Vanilla JS only. No global listeners; scope to the block root.
   - If icons are needed, use GEL icon classes (see Icon Usage below).

2) `blocks/${input}/${input}.scss`
  - Derive **colors, radii, and spacing** from Figma (`get_design_context` / requirements). Use `spacing()` where it matches Figma px; expose repeated values as CSS variables in SCSS. **If Figma specifies a value and no variable exists, define one** in this file or `styles/`. See [SCSS Styling](../skills/scss-styling/SKILL.md).
  - Follow SCSS conventions in `/agents.md` and [SCSS Styling](../skills/scss-styling/SKILL.md); use [Block catalog](../skills/block-catalog.md) for comparable block patterns, not informal copying from unrelated `blocks/` folders.
   - If icons are used, import: `@import '../../styles/gel-icons.scss';`

3) `blocks/${input}/${input}.mocks.js`
   - Provide mock data sets representing *all* requirement variations:
     - required-only “happy path”
     - optional fields present
     - boundary cases (min/max lengths, empty optional fields)
     - any variant states described in requirements (icons, layouts, CTA types, etc.)

4) `blocks/${input}/${input}.stories.js`
   - Stories MUST call the real `decorate()` from `${input}.js` (no duplicated rendering logic).
   - Cover every mock variation from `${input}.mocks.js`.
   - Ensure keyboard interactions and accessibility attributes are verifiable in Storybook.

5) `blocks/${input}/_${input}.json`
  - Follow [Universal Editor](../skills/universal-editor/SKILL.md) for structure: definitions (block vs block/item if container), models (field types), filters (section + block/item). Add this block’s ID to the section filter in `models/_section.json` so the block can be added in UE.
   - Field definitions derived from requirements:
     - required vs optional fields
     - field labels, types, tooltips/help text (use correct `component`: text, richtext, reference, select, multiselect, boolean, etc.)
     - validation constraints (e.g., character limits) where specified
     - conditional visibility via `condition` (JsonLogic) when requirements say “show only when…”
   - **MUST include Mode select field** for light/dark mode:
     ```json
     {
       "component": "select",
       "name": "classes",
       "label": "Mode",
       "options": [
         { "name": "Light", "value": "" },
         { "name": "Dark", "value": "dark" }
       ]
     }
     ```
   - **CRITICAL**: After creating or modifying `_${input}.json`, you MUST immediately run `npm run build:json` to merge the block configuration into the global config files. This is non-negotiable.

6) **Theming / dark mode** — Follow Figma variants and Confluence. Implement with CSS variables and/or `data-theme` as required by the spec; add variables in SCSS for each Figma color role.

## File Creation Order

Create files in this sequence (dependencies matter):

1. `${input}.js` — Decorator logic
2. `${input}.scss` — Styles
3. Run `npm run scss:build` — Compile SCSS to CSS
4. `${input}.mocks.js` — Test data
5. `${input}.stories.js` — Stories (imports CSS and mocks)
6. `_${input}.json` — Universal Editor config
7. Run `npm run build:json` — Merge UE config files

**PowerShell Note**: If npm commands fail with execution policy errors, use `& npm.cmd run <command>` instead of `npm run <command>`.

## Post-Creation Verification

After all files are created:

1. Run `npm run storybook` — Verify stories render correctly
2. Check Accessibility tab — Should show 0 violations
3. Test keyboard navigation — Verify all interactive elements work
4. Test dark mode — Use a Dark Mode story (e.g. `variants: ['dark']`) or the Storybook background toolbar (switch to dark) to verify colors resolve correctly

## Icon Usage

When icons are needed in a block:

**Import in SCSS:**
```scss
@import '../../styles/gel-icons.scss';
```

**Use GEL icon classes in HTML:**
```html
<!-- Decorative icon (with adjacent text) -->
<button>
  <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
  Close
</button>

<!-- Icon-only button (semantic) -->
<button aria-label="Close dialog">
  <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
</button>

<!-- Logo -->
<i class="gel-logo gel-logo-wbc" aria-label="Brand"></i>

<!-- Pictogram -->
<i class="gel-pictogram gel-pictogram-atm" aria-hidden="true"></i>
```

**Size modifiers:** `.gel-icon-xs` (16px), `.gel-icon-sm` (20px), `.gel-icon-md` (24px), `.gel-icon-lg` (32px), `.gel-icon-xl` (48px), `.gel-icon-2xl` (64px)

**Icon picker in UE (multiselect):**

When adding an icon field to `_${input}.json`, use the multiselect component with manifest reference:

```json
{
  "component": "multiselect",
  "name": "icon",
  "value": "",
  "label": "Icon",
  "valueType": "string",
  "description": "Select a GEL filled icon (optional)",
  "options": [
    { "name": "None", "value": "" },
    { "...": "../../models/generated/_filled-icons.json" }
  ]
}
```

**Available manifests:**
- `_filled-icons.json` — Filled/solid icons (~265)
- `_outlined-icons.json` — Outlined/line icons (~265)
- `_pictograms-duo.json` — Two-color pictograms (~95)
- `_logos.json` — Brand logos (~118)

**See full guide:** [Icon Usage](../skills/icon-usage/SKILL.md)

## Formatting
- Output must satisfy ESLint + Prettier with 2-space indentation.