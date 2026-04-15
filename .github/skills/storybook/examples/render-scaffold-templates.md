# Story + mock scaffold templates

Use these as starting points; replace `<block>` with your block name. Paths assume the same layout as this repo (`blocks/<block>/`, `scripts/mockBuilder.js`).

---

## Template 1 — `mockBuilder` + helper in stories (accordion-style)

**`<block>.mocks.js`**

```javascript
/**
 * Mock content for <Block> stories.
 * Shape objects to match what panelsToRows / your helper expects.
 */
export const defaultScenario = [
  { title: 'First item', description: 'Body text or use features: [], steps: [], link: {}' },
  { title: 'Second item', description: '...' },
];
```

**`<block>.stories.js`**

```javascript
import decorate from './<block>.js';
import './<block>.css';
import { createMockBlock, panelsToRows } from '../../scripts/mockBuilder.js';
import * as mocks from './<block>.mocks.js';

function renderBlock(scenario, options = {}) {
  const rows = [/* row 0 if block has title */, ...panelsToRows(scenario)];
  const block = createMockBlock('<block>', rows);
  // if (options.dark) block.classList.add('dark');
  decorate(block);
  return block;
}

export default {
  title: 'Blocks/<Block Title>',
  tags: ['autodocs'],
};

export const Default = {
  render: () => renderBlock(mocks.defaultScenario),
};
```

---

## Template 2 — Factory in mocks (action-card / tap-tiles–style)

**`<block>.mocks.js`**

```javascript
import { createMockBlock } from '../../scripts/mockBuilder.js';
import decorate from './<block>.js';

function dataToRows(data) {
  // Map your scenario object to the row[][] shape extractData() expects.
  return [];
}

export function create<Block>(data) {
  const block = createMockBlock('<block>', dataToRows(data));
  decorate(block);
  return block;
}

export const scenarioDefault = { /* fields */ };
```

**`<block>.stories.js`**

```javascript
import './<block>.css';
import * as mocks from './<block>.mocks.js';

export default {
  title: 'Blocks/<Block Title>',
  parameters: { layout: 'fullscreen' },
};

export const Default = () => mocks.create<Block>(mocks.scenarioDefault);
```

---

## Template 3 — Story-only `play` assertion

```javascript
import { expect } from '@storybook/test';

export const WithAssertions = {
  render: () => renderBlock(mocks.defaultScenario),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.<block>');
    await expect(root).toBeTruthy();
  },
};
```

---

## Real implementations to copy from

| Template | Copy from |
| --- | --- |
| 1 | `blocks/accordion/` |
| 2 | `blocks/action-card/`, `blocks/tap-tiles/` |
| Complex rows | `blocks/big-numbers/big-numbers.mocks.js` (`createBigNumbers`) |
| Custom row layout | `blocks/information-panel/information-panel.stories.js` |
