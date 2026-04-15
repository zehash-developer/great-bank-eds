---
name: build-block
description: Scaffold and implement an EDS block from an existing requirements file
argument-hint: 'block-name'
---

Follow all rules in `/agents.md` and `.github/instructions/copilot-instructions.md`.
If there is any conflict, `/agents.md` wins.

Use this prompt as:

`build-block <block-name>`

## Objective

Scaffold and implement a block from an existing requirements file at `docs/requirements/<block-name>/requirements.md`.

**Preflight:** Read `docs/requirements/<block-name>/requirements.md` before doing anything else. If the file does not exist, stop and tell the user to run `get-requirements <block-name> <confluence-link>` first. For section expectations, compare against [requirements-template.md](../skills/block-development/examples/requirements-template.md).

Once complete, run `review-block <block-name>` to validate the implementation against Figma.

## Required References

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

## Output Summary

Provide a concise summary containing:

1. Block files created.
2. Commands executed and outcomes.
3. Any open questions still requiring user decision.
