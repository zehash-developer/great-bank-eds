/**
 * Accordion Block — Storybook Stories
 *
 * Pattern A: helper in stories, data in mocks.
 * Uses `createMockBlock` + `panelsToRows` to build document-shaped DOM,
 * then runs the real `decorate()` so Storybook matches production exactly.
 *
 * Figma references:
 *  - Light mode: docs/requirements/accordion/figma/node-5-5043-accordion-light.png
 *  - Dark mode:  docs/requirements/accordion/figma/node-5-5119-accordion-dark.png
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from '@storybook/test';
import decorate from './accordion.js';
import './accordion.css';
import { createMockBlock, panelsToRows } from '../../scripts/mockBuilder.js';
import * as mocks from './accordion.mocks.js';

// =============================================================================
// Helper
// =============================================================================

/**
 * Build an accordion block and run decorate().
 *
 * Row layout expected by extractData():
 *   Row 0 → [ title ] (optional heading above accordion)
 *   Rows 1+ → [ question, answer ] (one per item)
 *
 * @param {Array} panels  - Panel data from mocks
 * @param {Object} options
 * @param {string}  [options.title='']      - Optional heading above item list
 * @param {boolean} [options.darkMode=false] - Apply dark variant
 * @returns {HTMLElement}
 */
function createAccordion(panels, { title = '', darkMode = false } = {}) {
  const rows = [[title], ...panelsToRows(panels)];
  const block = createMockBlock('accordion', rows);
  if (darkMode) block.classList.add('dark');
  decorate(block);
  return block;
}

// =============================================================================
// Meta
// =============================================================================

export default {
  title: 'Blocks/Accordion',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Accordion

Collapsible FAQ-style block. Each item has a trigger row (question + chevron) that
expands / collapses the answer panel.

**Key behaviours:**
- Multi-expand: multiple panels may be open simultaneously
- Chevron rotates 180° when expanded
- Keyboard: \`Tab\` between triggers, \`Enter\`/\`Space\` to toggle, \`Arrow\` keys to navigate
- ARIA disclosure button pattern (\`aria-expanded\`, \`aria-controls\`)

**Figma:** [Light node 5:5043](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5043)
· [Dark node 5:5119](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5119)
        `,
      },
    },
  },
};

// =============================================================================
// Stories
// =============================================================================

/**
 * Default light mode — 3 items (Variation 1, Figma node 5:5043).
 */
export const Default = {
  render: () => createAccordion(mocks.defaultPanels, { title: 'Accordion Component' }),
  play: async ({ canvasElement }) => {
    const triggers = canvasElement.querySelectorAll('.accordion-trigger');
    await expect(triggers.length).toBe(3);

    // All panels collapsed by default
    triggers.forEach((trigger) => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    // Clicking first trigger expands its panel
    triggers[0].click();
    await expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    const panelId = triggers[0].getAttribute('aria-controls');
    const panel = canvasElement.querySelector(`#${panelId}`);
    await expect(panel.hasAttribute('hidden')).toBe(false);
  },
};
Default.parameters = {
  docs: {
    description: {
      story:
        'Light mode with 3 items (Variation 1). Matches Figma node 5:5043. All panels collapsed by default.',
    },
  },
};

/**
 * Full FAQ — 5 items (Variation 2, Figma node 5:5043).
 */
export const FullFAQ = {
  render: () => createAccordion(mocks.faqPanels, { title: 'Frequently Asked Questions' }),
};
FullFAQ.parameters = {
  docs: {
    description: {
      story:
        'Light mode with 5 items (Variation 2). Tests vertical stacking at full FAQ length.',
    },
  },
};

/**
 * Simple FAQ — 2 items (Variation 3, Figma node 5:5043).
 */
export const SimpleFAQ = {
  render: () => createAccordion(mocks.simplePanels),
};
SimpleFAQ.parameters = {
  docs: {
    description: {
      story:
        'Light mode with 2 items (Variation 3). Minimal configuration — no heading.',
    },
  },
};

/**
 * Dark mode — 3 items (Figma node 5:5119).
 */
export const DarkMode = {
  render: () => createAccordion(mocks.defaultPanels, { title: 'Accordion Component', darkMode: true }),
};
DarkMode.parameters = {
  docs: {
    description: {
      story:
        'Dark mode (`accordion dark` block option). Matches Figma node 5:5119. Dark navy background with light text.',
    },
  },
  backgrounds: { default: 'dark' },
};

/**
 * Dark mode full FAQ — 5 items.
 */
export const DarkModeFullFAQ = {
  render: () => createAccordion(mocks.faqPanels, { title: 'Frequently Asked Questions', darkMode: true }),
};
DarkModeFullFAQ.parameters = {
  docs: {
    description: { story: 'Dark mode with 5 items.' },
  },
  backgrounds: { default: 'dark' },
};

/**
 * Rich content panels — tests nested lists, ordered steps, and note text.
 */
export const RichContent = {
  render: () => createAccordion(mocks.richContentPanels, { title: 'Help Centre' }),
};
RichContent.parameters = {
  docs: {
    description: {
      story:
        'Tests rich answer content: unordered lists, ordered steps, and italicised notes inside panels.',
    },
  },
};

/**
 * No heading — block without optional title.
 */
export const NoHeading = {
  render: () => createAccordion(mocks.defaultPanels),
};
NoHeading.parameters = {
  docs: {
    description: { story: 'Accordion without the optional block heading.' },
  },
};
