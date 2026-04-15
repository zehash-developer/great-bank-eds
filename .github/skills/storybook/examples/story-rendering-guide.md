# How to render EDS block stories (Westpac)

This guide describes how **stories** and **mocks** work together so Storybook runs the **same `decorate()`** as production. Examples point at real blocks under `blocks/<name>/`.

---

## 1. What “good” looks like

| Principle | Why |
| --- | --- |
| Import **`decorate`** from `./<block>.js` | Story output matches real EDS behavior. |
| Build **document-shaped DOM** (rows/cells) that **`extractData()`** understands | `decorate` expects the same structure as Word/Docs tables in AEM. |
| Put reusable content in **`<block>.mocks.js`** | Keeps `*.stories.js` readable; one scenario = one named export. |
| Import **compiled block CSS** (`import './<block>.css'`) | Styles match Storybook preview. |
| Use **`../../scripts/mockBuilder.js`** when rows are simple | Shared `createMockBlock` + `panelsToRows`. |

---

## 2. Shared helpers: `scripts/mockBuilder.js`

Use these for accordion-like “title + content” rows and generic blocks.

```javascript
import { createMockBlock, panelsToRows, buildContentHTML } from '../../scripts/mockBuilder.js';
```

- **`createMockBlock(blockName, rows, { variants: [] })`** — Builds `div.<name>.block` with child `div` rows, each row has `div` cells. `blockName` becomes class `accordion block`, etc.
- **`panelsToRows(panels)`** — Turns `[{ title, description, features, ... }]` into `[[title, contentObject], ...]` for cells (content objects become HTML via `buildContentHTML`).
- **`buildContentHTML`** — Used internally when a cell is an object; supports `description`, `steps`, `features`, `paragraphs`, `note`, `link`.

**Example (accordion row model):** Row 0 = optional block title; rows 1+ = one panel per row. See [`blocks/accordion/accordion.stories.js`](../../../../blocks/accordion/accordion.stories.js) `createAccordion`.

---

## 3. Pattern A — Helper in `*.stories.js`, data in `*.mocks.js`

**Best when:** Story file documents UX and runs **`play`** tests; mocks stay plain data (arrays/objects).

### Accordion

- **Mocks:** [`blocks/accordion/accordion.mocks.js`](../../../../blocks/accordion/accordion.mocks.js) — exports `defaultPanels`, `faqPanels`, etc. (panel objects with `title`, `description`, `features`, `steps`, `link`…).
- **Stories:** [`blocks/accordion/accordion.stories.js`](../../../../blocks/accordion/accordion.stories.js) — `createMockBlock` + `panelsToRows` + `decorate`:

```javascript
import decorate from './accordion.js';
import './accordion.css';
import { createMockBlock, panelsToRows } from '../../scripts/mockBuilder.js';
import * as mocks from './accordion.mocks.js';

function createAccordion(items, options = {}) {
  const { title = '', darkMode = false } = options;
  const rows = [[title], ...panelsToRows(items)];
  const block = createMockBlock('accordion', rows);
  if (darkMode) block.classList.add('dark');
  decorate(block);
  return block;
}

export const Default = {
  render: () => createAccordion(mocks.defaultPanels),
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('.accordion-item');
    // assertions with @storybook/test ...
  },
};
```

- **Default export:** `title: 'Blocks/Accordion'`, `tags: ['autodocs']`, rich `parameters.docs.description.component` for MDX-style docs.

### Information panel (custom row mapping)

When **`extractData`** expects one row per field, mocks may build **one cell per row** — see **`panelDataToRows`** in [`blocks/information-panel/information-panel.stories.js`](../../../../blocks/information-panel/information-panel.stories.js). That block documents why row shape matters (alignment with `getFirstCell` / row walking in JS).

---

## 4. Pattern B — Factory in `*.mocks.js`, thin `*.stories.js`

**Best when:** Many visual variants share the same DOM construction; factories get long (row builders, `dataToRows`).

### Action Card

- **Mocks:** [`blocks/action-card/action-card.mocks.js`](../../../../blocks/action-card/action-card.mocks.js) — exports scenario objects like `actionCardWhite` (block fields + `cards[]`), plus **`createActionCard(data)`** which calls `dataToRows` → `createMockBlock('action-card', rows)` → applies `dark` class → **`decorate(block)`**.
- **Stories:** [`blocks/action-card/action-card.stories.js`](../../../../blocks/action-card/action-card.stories.js) — one line per story:

```javascript
import './action-card.css';
import * as mocks from './action-card.mocks.js';

export default { title: 'Blocks/Action Card', parameters: { layout: 'fullscreen' } };

export const ActionCardWhite = () => mocks.createActionCard(mocks.actionCardWhite);

ActionCardWhite.parameters = {
  docs: { description: { story: 'White background with light mode...' } },
};
```

### Big Numbers

- **Mocks:** [`blocks/big-numbers/big-numbers.mocks.js`](../../../../blocks/big-numbers/big-numbers.mocks.js) — **`createBigNumbers(data)`** manually builds **11 cells per item row** to match `_big-numbers.json` / `extractData` (tab label, badges, richtext cells, etc.).
- **Stories:** [`blocks/big-numbers/big-numbers.stories.js`](../../../../blocks/big-numbers/big-numbers.stories.js) — `() => mocks.createBigNumbers(mocks.bigNumbersTabsFullContent)` plus `parameters.docs` per scenario.

### Tap Tiles

- **Mocks:** `createTabTiles` + tile set exports (minimal, carousel variants, etc.).
- **Stories:** [`blocks/tap-tiles/tap-tiles.stories.js`](../../../../blocks/tap-tiles/tap-tiles.stories.js) — same thin pattern as action-card.

---

## 5. Default export (meta)

Common fields:

```javascript
export default {
  title: 'Blocks/<Block Title>',  // sidebar path
  tags: ['autodocs'],              // optional: autodocs
  parameters: {
    layout: 'fullscreen',          // optional: full viewport
    docs: {
      description: {
        component: `## Markdown supported...`,
      },
    },
  },
};
```

Per-story descriptions use **`story`** (not only `component`):

```javascript
SomeStory.parameters = {
  docs: { description: { story: 'What this specific story shows.' } },
};
```

---

## 6. Interaction tests: `play` + `@storybook/test`

Accordion example (see full file for imports):

```javascript
import { expect } from '@storybook/test';

export const Default = {
  render: () => createAccordion(mocks.defaultPanels),
  play: async ({ canvasElement }) => {
    const triggers = canvasElement.querySelectorAll('.accordion-trigger');
    await expect(triggers.length).toBeGreaterThan(0);
    await expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  },
};
```

Information panel uses **`userEvent`** for dismiss / CTA — see [`information-panel.stories.js`](../../../../blocks/information-panel/information-panel.stories.js).

---

## 7. UE fields that are not “rows”

Some Universal Editor fields (e.g. **`classes`** for light/dark) are applied to **`block.classList`** in real EDS, not as table rows. In Storybook, **add the same classes in the helper** after `createMockBlock`:

```javascript
if (darkMode) block.classList.add('dark');
```

Action card applies **`dark`** inside **`createActionCard`** when `data.classes === 'dark'`. Same idea across blocks.

---

## 8. Checklist before opening a PR

- [ ] Story calls **real** `decorate` from the block’s JS.
- [ ] DOM matches **row/cell** expectations of **`extractData`** (compare with `_<block>.json` and block JS).
- [ ] **CSS** imported for that block (and global tokens already in `.storybook/preview.js`).
- [ ] Mocks cover **default**, **edge** (min/max items), and **mode/variant** requirements.
- [ ] Optional: **`play`** asserts critical a11y or state.

See also [checklist.md](./checklist.md) and [story-coverage-template.md](./story-coverage-template.md).

---

## 9. Quick reference — blocks to read in the repo

| Pattern | Block | Files to read |
| --- | --- | --- |
| mockBuilder + `play` tests | Accordion | `accordion.stories.js`, `accordion.mocks.js` |
| Factory in mocks, fullscreen | Action Card | `action-card.stories.js`, `action-card.mocks.js` |
| Manual multi-cell rows | Big Numbers | `big-numbers.stories.js`, `big-numbers.mocks.js` |
| Thin stories, carousel cases | Tap Tiles | `tap-tiles.stories.js`, `tap-tiles.mocks.js` |
| Custom row shape + `userEvent` | Information Panel | `information-panel.stories.js`, `information-panel.mocks.js` |

Paths above are under `blocks/<name>/` at the repository root.
