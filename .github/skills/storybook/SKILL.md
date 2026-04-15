---
name: storybook
description: Build Storybook stories and mocks for EDS blocks using real decorate functions, mockBuilder helpers, factories, and interaction tests—with concrete patterns from this repo.
argument-hint: '[block name] [story requirement]'
---

# Storybook (EDS blocks)

Use this skill when creating or updating **`*.stories.js`** and **`*.mocks.js`** for decorator blocks.

## Core rules

1. **Always use the real `decorate()`** from `./<block>.js` so Storybook matches production.
2. **Match `extractData()` row/cell shape** — stories must build the same DOM the block expects from authored tables (see `_<block>.json` and block JS). Wrong row layout = silent bugs.
3. **Import block CSS** — `import './<block>.css'` (compiled CSS exists after `scss:build` / pipeline in this repo).
4. **Split mocks from stories** — reusable scenarios live in **`<block>.mocks.js`**; stories wire scenarios to helpers or factories.
5. **Optional:** use **`@storybook/test`** (`expect`, `userEvent`) in **`play`** for smoke/a11y checks.

## Two rendering patterns (use one or both)

| Pattern | Where logic lives | Typical blocks | When to use |
| --- | --- | --- | --- |
| **A — Helper in stories** | `createX()` in `*.stories.js`; mocks = data only | Accordion, Information Panel | Many `play` tests, docs on `create*`; data is simple arrays/objects |
| **B — Factory in mocks** | `createX(data)` in `*.mocks.js`; stories = one-liners | Action Card, Big Numbers, Tap Tiles | Many variants; heavy row building or `dataToRows` |

Shared utilities: **`scripts/mockBuilder.js`** — `createMockBlock`, `panelsToRows`, `buildContentHTML`.

## UE-only fields (e.g. `classes`, mode)

If a field is applied to **`block.classList`** in real EDS and is **not** a table row, **set it in the helper** after `createMockBlock` (e.g. `block.classList.add('dark')`). See [examples/story-rendering-guide.md](examples/story-rendering-guide.md).

## Reference (this repository)

Concrete walkthroughs and many pointers to real files:

- **[examples/story-rendering-guide.md](examples/story-rendering-guide.md)** — Full narrative: `mockBuilder`, Pattern A vs B, `default` export, `play`, row-shape pitfalls, table of blocks to read.
- **[examples/render-scaffold-templates.md](examples/render-scaffold-templates.md)** — Copy-paste scaffolds for Patterns 1–3.
- **[examples/checklist.md](examples/checklist.md)** — Short PR checklist.
- **[examples/story-coverage-template.md](examples/story-coverage-template.md)** — Coverage dimensions (defaults, boundaries, a11y).

### Blocks to study (examples)

| Block | Highlights |
| --- | --- |
| `accordion` | `createMockBlock` + `panelsToRows`, `play` with `expect`, autodocs |
| `action-card` | `createActionCard` in mocks, thin stories, fullscreen |
| `big-numbers` | Custom 11-cell rows in `createBigNumbers` |
| `tap-tiles` | `createTabTiles`, carousel scenarios |
| `information-panel` | Custom `panelDataToRows`, `userEvent` in `play` |

Paths: `blocks/<name>/<name>.stories.js` and `blocks/<name>/<name>.mocks.js`.

## Wiring in Storybook (repo-level)

Story discovery, Vite, AEM mocks, and global CSS are configured under **`.storybook/`** (`main.js`, `preview.js`, `mocks/`). For “how Storybook is started here,” see project **`package.json`** scripts (`storybook`, `storybook:build`) and `AGENTS.md`.

## Reference

- Skill package: [SKILL.md](./SKILL.md)
- Repo source of truth: [agents.md](../../../agents.md)
