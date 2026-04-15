/**
 * Cards Block — Storybook Stories
 *
 * Pattern A: helper in stories, data in mocks.
 * Uses `createMockBlock` to build document-shaped DOM, then runs the real
 * `decorate()` so Storybook matches production exactly.
 *
 * Row shape expected by extractData() / extractCardFromRow():
 *   Each row = one card with 6 cells:
 *     [0] icon (HTML string with <img>)
 *     [1] tags (plain text, comma-separated)
 *     [2] title (plain text)
 *     [3] subtitle (plain text, optional)
 *     [4] description (plain text)
 *     [5] CTAs (HTML string with <a> elements)
 *
 * Figma references:
 *  - Light mode: docs/requirements/cards/figma/light-mode.png  (node 17:6)
 *  - Dark  mode: docs/requirements/cards/figma/dark-mode.png   (node 22:372)
 */

import decorate from './cards.js';
import './cards.css';
import { createMockBlock } from '../../scripts/mockBuilder.js';
import * as mocks from './cards.mocks.js';

// =============================================================================
// Helper
// =============================================================================

/**
 * Build a cards block and run decorate().
 *
 * @param {Array<Array<string>>} cardRows - Array of card row data (6 cells each)
 * @param {Object} [options]
 * @param {boolean} [options.dark=false] - Apply dark variant
 * @returns {HTMLElement}
 */
function createCards(cardRows, { dark = false } = {}) {
  const block = createMockBlock('cards', cardRows);
  if (dark) block.classList.add('dark');
  decorate(block);
  return block;
}

// =============================================================================
// Meta
// =============================================================================

export default {
  title: 'Blocks/Cards',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Cards

Product/service card grid. Each card surfaces an icon, badge tags, title,
highlighted subtitle, description, and 1–2 CTA buttons.

**Layout:**
- Desktop (≥ 768px): CSS Grid — \`repeat(auto-fit, minmax(280px, 1fr))\`
- Mobile (< 768px): horizontal scrolling carousel via \`scripts/utility/carousel.js\`

**Dark mode:** Add the \`dark\` CSS class to the block element.  
In dark mode the primary CTA button inverts to gold-light background with near-black text.

**Figma:**
- [Light node 17:6](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=17-6)
- [Dark node 22:372](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=22-372)
        `,
      },
    },
  },
};

// =============================================================================
// Stories
// =============================================================================

/**
 * Default light mode — 3 cards (Figma node 17:6).
 * Transaction Account (2 CTAs), Home Loans (1 CTA), Credit Cards (1 CTA).
 */
export const Default = {
  name: 'Light Mode (Figma 17:6)',
  render: () => createCards(mocks.lightCards),
  parameters: {
    docs: {
      description: {
        story:
          'Three-card light mode layout matching Figma node 17:6. ' +
          'Transaction Account has both a primary and an outline button. ' +
          'Home Loans and Credit Cards have a single primary CTA.',
      },
    },
  },
};

/**
 * Dark mode — same 3 cards with dark theme applied (Figma node 22:372).
 * Primary buttons invert to gold-light background + near-black text.
 */
export const Dark = {
  name: 'Dark Mode (Figma 22:372)',
  render: () => createCards(mocks.darkCards, { dark: true }),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Dark mode variant matching Figma node 22:372. ' +
          'Cards use a dark navy background. Buttons use gold-light; ' +
          'primary button text is near-black for WCAG contrast.',
      },
    },
  },
};

/**
 * All single-CTA cards — no outline button.
 */
export const SingleCTA = {
  name: 'Single CTA per card',
  render: () => createCards(mocks.singleCtaCards),
  parameters: {
    docs: {
      description: {
        story:
          'Cards with only one CTA button each. Tests that the flex layout in `.card-ctas` behaves correctly.',
      },
    },
  },
};

/**
 * Minimal cards — no tags, no subtitle, just required fields.
 */
export const Minimal = {
  name: 'Minimal (no tags or subtitle)',
  render: () => createCards(mocks.minimalCards),
  parameters: {
    docs: {
      description: {
        story:
          'Cards using only required fields: icon, title, description, and CTA. Tags and subtitle cells are empty.',
      },
    },
  },
};

/**
 * Two cards — verifies grid with fewer than three items.
 */
export const TwoCards = {
  name: 'Two cards',
  render: () => createCards(mocks.twoCards),
  parameters: {
    docs: {
      description: {
        story: 'Two-card layout. Verifies `auto-fit` grid with fewer items and equal card heights.',
      },
    },
  },
};

/**
 * Dark mode — minimal cards (no tags, no subtitle).
 */
export const DarkMinimal = {
  name: 'Dark — Minimal',
  render: () => createCards(mocks.minimalCards, { dark: true }),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Dark mode with minimal card content.',
      },
    },
  },
};
