---
name: block-development
description: Build and update EDS blocks using the repository's architecture, including extraction, rendering, and decorate lifecycle with Universal Editor compatibility.
argument-hint: '[block name] [task]'
---

# Block Development

Use this skill when creating or refactoring a block in `blocks/<name>/`.

## Workflow

1. Follow required function separation: `extractData()` -> `renderHTML()` -> `decorate()`.
2. Keep DOM mutation inside `decorate()` only.
3. Preserve Universal Editor instrumentation when moving/replacing nodes.
4. Scope logic and listeners to the block root.
5. Validate styles, Storybook behavior, and lint/test expectations.

## Pattern Selection

1. Use the nested-children pattern when each block item must host additional authored content/components.
2. Use the single-level pattern when items are fully defined by fixed fields and do not host nested components.

## Reference Implementations

Full script snapshots (self-contained in this skill):

- Nested children per item: [examples/reference/accordion.js](examples/reference/accordion.js)
- Single-level items: [examples/reference/action-card.js](examples/reference/action-card.js)

See [examples/reference/README.md](examples/reference/README.md).

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)

## Resources

- Block catalog (all blocks, patterns, repo + skill snapshots): [../block-catalog.md](../block-catalog.md)
- Reference JS library: [examples/reference/README.md](examples/reference/README.md)
- Requirements template (portable): [examples/requirements-template.md](examples/requirements-template.md)
- Checklist: [examples/checklist.md](examples/checklist.md)
- Generic scaffold: [examples/decorate-scaffold.js](examples/decorate-scaffold.js)
- Nested-children example: [examples/pattern-block-with-item-children.md](examples/pattern-block-with-item-children.md)
- Single-level example: [examples/pattern-single-level-block.md](examples/pattern-single-level-block.md)
