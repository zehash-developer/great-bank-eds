---
name: universal-editor
description: Configure Universal Editor models, definitions, and filters for EDS blocks, including field types, validation, and authoring behavior.
argument-hint: '[json file path] [configuration task]'
---

# Universal Editor

Use this skill for `_block.json`, model, and filter configuration.
It is designed so you can build both simple and complex block JSON definitions.

## Workflow

1. Reflect requirements exactly: required/optional fields, labels, and validations.
2. Use correct resource types and templates for block composition.
3. Choose field components that match authoring intent (text, richtext, reference, aem-content, select, multiselect, boolean, etc).
4. Use conditional rendering (`condition`) for progressive forms and dependent fields.
5. For icon authoring, prefer picker-backed fields (`multiselect` with generated icon manifests) over free-text icon names.
6. Preserve existing authoring conventions and field structures.
7. After modifying UE JSON, run `npm run build:json`.

## Pattern Selection

1. Use block-item with nested child components when items need freeform authored content inside each item.
2. Use single-level block-item modeling when item content is fully expressed by fixed fields.

## Field Type Coverage

This skill includes examples for:

- `text`
- `textarea`
- `richtext`
- `reference` (asset/image picker)
- `aem-content` (content/link picker)
- `select`
- `multiselect`
- `boolean`
- `number`
- `radio-group`
- `checkbox-group`
- `date-time`
- `tab`
- `container`
- `aem-tag`
- `aem-content-fragment`
- `aem-experience-fragment`

Use the field cookbook resource to copy/paste starting snippets.

## Reference Implementations

Snapshots of the same production models live in this skill package (no dependency on `blocks/` in the repo):

- Nested child components and nested authorable content: [examples/reference/accordion.json](examples/reference/accordion.json)
- Single-level item modeling: [examples/reference/action-card.json](examples/reference/action-card.json)
- Conditional field rendering + mixed field types: [examples/reference/cards.json](examples/reference/cards.json)
- Multiselect with manifest-based options + link picker: [examples/reference/tap-tiles.json](examples/reference/tap-tiles.json)
- Advanced conditional paths and validation across multiple fields: [examples/reference/big-numbers.json](examples/reference/big-numbers.json)
- Icon picker implementations: [examples/reference/feature-list.json](examples/reference/feature-list.json), [examples/reference/information-panel.json](examples/reference/information-panel.json), [examples/reference/tab.json](examples/reference/tab.json)

See [examples/reference/README.md](examples/reference/README.md) for a full table. Icon picker models include a vendored [examples/reference/_filled-icons.json](examples/reference/_filled-icons.json) so spreads resolve inside this folder alone.

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)

## Resources

- Block catalog (all blocks, patterns, repo + skill snapshots): [../block-catalog.md](../block-catalog.md)
- Reference JSON library: [examples/reference/README.md](examples/reference/README.md)
- Checklist: [examples/checklist.md](examples/checklist.md)
- Example schema notes: [examples/ue-json-template.md](examples/ue-json-template.md)
- Nested-children JSON pattern: [examples/pattern-block-with-item-children.json](examples/pattern-block-with-item-children.json)
- Single-level JSON pattern: [examples/pattern-single-level-block.json](examples/pattern-single-level-block.json)
- Field type cookbook: [examples/field_types.md](examples/field_types.md)
- Conditional rendering cookbook: [examples/conditional_rendering.md](examples/conditional_rendering.md)
- Block-derived UE patterns: [examples/block_patterns.md](examples/block_patterns.md)
- Icon picker cookbook: [examples/icon-picker-cookbook.md](examples/icon-picker-cookbook.md)
