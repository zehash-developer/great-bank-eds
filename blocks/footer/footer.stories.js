/**
 * Footer Block — Storybook Stories
 *
 * Pattern A: helper in stories, data in mocks.
 * Uses `createMockBlock` to build the document-shaped DOM, then runs the
 * real `decorate()` so Storybook matches production exactly.
 *
 * Figma references:
 *   Light: docs/requirements/footer/figma/node-4-2395-footer-light.png
 *   Dark:  docs/requirements/footer/figma/node-5-4263-footer-dark.png
 */

import decorate from './footer.js';
import './footer.css';
import { createMockBlock } from '../../scripts/mockBuilder.js';
import { defaultRows } from './footer.mocks.js';

// =============================================================================
// Helper
// =============================================================================

/**
 * Build a footer block and run decorate().
 *
 * @param {Array}   rows                - Row data (from mocks)
 * @param {Object}  options
 * @param {boolean} [options.dark=false] - Apply dark variant
 * @returns {HTMLElement}
 */
function createFooter(rows, { dark = false } = {}) {
  const block = createMockBlock('footer', rows);
  if (dark) block.classList.add('dark');
  decorate(block);
  return block;
}

// =============================================================================
// Meta
// =============================================================================

export default {
  title: 'Blocks/Footer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Footer

Site-wide footer block with logo, tagline, social icons, navigation columns,
and a legal bar.

### Authoring shape

| Row | Cells | Content |
|-----|-------|---------|
| 0 | 1 | Logo image |
| 1 | 1 | Tagline paragraph |
| 2 | 1 | Social links (text drives icon mapping) |
| 3 | 3 | Nav columns — one per cell, heading + links |
| 4 | 1 | Legal links |
| 5 | 1 | Copyright text |

### Variants
| Class | Description |
|-------|-------------|
| _(none)_ | Light theme |
| \`dark\` | Dark navy theme |
        `,
      },
    },
  },
};

// =============================================================================
// Stories
// =============================================================================

/** Variation 1 — Light theme footer */
export const Default = {
  name: 'Light (Default)',
  render: () => createFooter(defaultRows),
};

/** Dark theme footer */
export const Dark = {
  name: 'Dark',
  render: () => createFooter(defaultRows, { dark: true }),
};
