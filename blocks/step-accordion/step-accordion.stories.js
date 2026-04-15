/**
 * Step Accordion Block — Storybook Stories
 *
 * Pattern A: helper in stories, data in mocks.
 * Uses createMockBlock to build document-shaped DOM (rows with cells),
 * then runs the real decorate() so Storybook matches production exactly.
 *
 * Row layout expected by extractData():
 *   Row 0:  [heading]                       (1 cell)
 *   Rows 1–N (optional): [ctaField]         (1 cell each, before item rows)
 *   Item rows: [label][subtitle][desc][img] (4 cells) or [label][desc][img] (3 cells)
 *
 * Figma references:
 *   Light (4 steps):  docs/requirements/step-accordion/figma/node-28-1000-step-accordion-light.png
 *   Dots (5 steps):   docs/requirements/step-accordion/figma/node-28-1093-step-accordion-variant-b.png
 *   Dark (4 steps):   docs/requirements/step-accordion/figma/node-28-2860-step-accordion-dark.png
 *   Short (3 steps):  docs/requirements/step-accordion/figma/node-28-1172-step-accordion-variant-c.png
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, userEvent, within } from '@storybook/test';
import decorate from './step-accordion.js';
import './step-accordion.css';
import { createMockBlock } from '../../scripts/mockBuilder.js';
import * as mocks from './step-accordion.mocks.js';

// =============================================================================
// Helper — build step item rows
// =============================================================================

/**
 * Convert step item objects to row arrays for createMockBlock.
 *
 * Produces 4-cell rows [label, subtitle, description, ''] for items with subtitle,
 * and 3-cell rows [label, description, ''] for items without subtitle.
 *
 * @param {Array<{label, subtitle?, description, image?}>} steps
 * @returns {Array<Array<string>>}
 */
function stepsToRows(steps) {
  return steps.map((step) => {
    const descHTML = step.description || '';
    const imgHTML = step.image ? `<img src="${step.image.src}" alt="${step.image.alt || ''}">` : '';
    if (step.subtitle) {
      return [step.label, step.subtitle, descHTML, imgHTML];
    }
    return [step.label, descHTML, imgHTML];
  });
}

/**
 * Build CTA field rows for a single-link CTA.
 * Returns rows in the order expected by extractCTA():
 *   [ctaType] [singleLabel] [singleUrl]
 * @param {Object} cta
 * @returns {Array<Array<string>>}
 */
function buildSingleCTARows(cta) {
  return [
    [cta.ctaType],
    [cta.singleLabel],
    [cta.singleUrl],
  ];
}

/**
 * Build CTA field rows for a dual-card CTA.
 * Returns rows in the order expected by extractCTA():
 *   [ctaType] [iconOne] [labelOne] [descOne] [urlOne] [iconTwo] [labelTwo] [descTwo] [urlTwo]
 * @param {Object} cta
 * @returns {Array<Array<string>>}
 */
function buildDualCTARows(cta) {
  return [
    [cta.ctaType],
    [cta.dualIconOne],
    [cta.dualLabelOne],
    [cta.dualDescriptionOne],
    [cta.dualUrlOne],
    [cta.dualIconTwo],
    [cta.dualLabelTwo],
    [cta.dualDescriptionTwo],
    [cta.dualUrlTwo],
  ];
}

/**
 * Build and decorate a step-accordion block.
 *
 * @param {Array}  steps   - Step item data from mocks
 * @param {Object} options
 * @param {string}  [options.heading='How It Works']
 * @param {boolean} [options.darkMode=false]
 * @param {Object}  [options.cta=null]              - CTA data object from mocks
 * @returns {HTMLElement}
 */
function createStepAccordion(steps, {
  heading = 'How It Works',
  darkMode = false,
  cta = null,
} = {}) {
  const ctaRows = (() => {
    if (!cta || cta.ctaType === 'none') return [];
    if (cta.ctaType === 'single') return buildSingleCTARows(cta);
    if (cta.ctaType === 'dual') return buildDualCTARows(cta);
    return [];
  })();

  const rows = [
    [heading],
    ...ctaRows,
    ...stepsToRows(steps),
  ];

  const block = createMockBlock('step-accordion', rows);
  if (darkMode) block.classList.add('dark');
  decorate(block);
  return block;
}

// =============================================================================
// Default export (meta)
// =============================================================================

export default {
  title: 'Blocks/Step Accordion',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Step Accordion

An ordered, collapsible step guide combining a visual timeline (numbered dot circles
and connector line) with accordion expand/collapse behaviour.

**Key behaviours:**
- Single-expand: only one step open at a time
- First step expanded on load
- Numbered dot circles — active step highlighted in gold
- Right-hand image area: swaps when active step changes (hidden when no images authored)
- ARIA disclosure pattern (\`aria-expanded\`, \`aria-controls\`, \`role="region"\`)
- Keyboard: \`Tab\` to focus triggers, \`Enter\`/\`Space\` to activate

**CTA variants:** none | single link | dual card links

**Figma nodes:**
- [Light — 28:1000](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1000)
- [Dots — 28:1093](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-1093)
- [Dark — 28:2860](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=28-2860)
        `,
      },
    },
  },
};

// =============================================================================
// Stories
// =============================================================================

/**
 * Default — 4 steps, light mode, no CTA.
 * Matches Figma node 28:1000 (Home Loan Application Process).
 * Figma ref: docs/requirements/step-accordion/figma/node-28-1000-step-accordion-light.png
 */
export const Default = {
  render: () => createStepAccordion(mocks.homeLoanSteps, {
    heading: 'Home Loan Application Process',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 4 steps rendered
    const items = canvasElement.querySelectorAll('.step-accordion-item');
    await expect(items.length).toBe(4);

    // Step 1 is expanded by default
    const trigger0 = items[0].querySelector('.step-accordion-trigger');
    await expect(trigger0.getAttribute('aria-expanded')).toBe('true');
    const panel0 = canvasElement.querySelector(`#${trigger0.getAttribute('aria-controls')}`);
    await expect(panel0.hasAttribute('hidden')).toBe(false);

    // Steps 2–4 are collapsed
    const trigger1 = items[1].querySelector('.step-accordion-trigger');
    await expect(trigger1.getAttribute('aria-expanded')).toBe('false');

    // Clicking step 2 activates it and collapses step 1
    await userEvent.click(trigger1);
    await expect(trigger1.getAttribute('aria-expanded')).toBe('true');
    await expect(trigger0.getAttribute('aria-expanded')).toBe('false');

    // Re-clicking active step does nothing (re-click guard)
    await userEvent.click(trigger1);
    await expect(trigger1.getAttribute('aria-expanded')).toBe('true');

    // Dot 2 gets the is-active class
    const dot1 = items[1].querySelector('.step-accordion-dot');
    await expect(dot1.classList.contains('is-active')).toBe(true);

    // Labels are populated
    await expect(canvas.getByText('Get Pre-Approved')).toBeTruthy();
  },
};

/**
 * Five steps — matches Figma node 28:1093 (Investment Advice Process).
 * Canonical dot reference in the Figma spec.
 * Figma ref: docs/requirements/step-accordion/figma/node-28-1093-step-accordion-variant-b.png
 */
export const FiveSteps = {
  render: () => createStepAccordion(mocks.investmentSteps, {
    heading: 'Investment Advice Process',
  }),
};

/**
 * Three steps — matches Figma node 28:1051 (Account Opening Journey).
 * Figma ref: docs/requirements/step-accordion/figma/node-28-1051-step-accordion-variant-a.png
 */
export const ThreeSteps = {
  render: () => createStepAccordion(mocks.accountSteps, {
    heading: 'Account Opening Journey',
  }),
};

/**
 * Short content — 3 steps, no subtitle lines.
 * Matches Figma node 28:1172 (Credit Card Application).
 * Figma ref: docs/requirements/step-accordion/figma/node-28-1172-step-accordion-variant-c.png
 */
export const ShortContent = {
  render: () => createStepAccordion(mocks.creditCardSteps, {
    heading: 'Credit Card Application',
  }),
};

/**
 * Dark mode — 4 steps.
 * Matches Figma node 28:2860 (Home Loan dark variant).
 * Figma ref: docs/requirements/step-accordion/figma/node-28-2860-step-accordion-dark.png
 */
export const Dark = {
  render: () => createStepAccordion(mocks.homeLoanSteps, {
    heading: 'Home Loan Application Process',
    darkMode: true,
  }),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark mode — 5 steps.
 */
export const DarkFiveSteps = {
  render: () => createStepAccordion(mocks.investmentSteps, {
    heading: 'Investment Advice Process',
    darkMode: true,
  }),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Single link CTA.
 */
export const WithSingleCTA = {
  render: () => createStepAccordion(mocks.homeLoanSteps, {
    heading: 'Home Loan Application Process',
    cta: mocks.singleCTA,
  }),
};

/**
 * Dual card CTA.
 */
export const WithDualCTA = {
  render: () => createStepAccordion(mocks.homeLoanSteps, {
    heading: 'Home Loan Application Process',
    cta: mocks.dualCTA,
  }),
};

/**
 * Dark mode with dual CTA.
 */
export const DarkWithDualCTA = {
  render: () => createStepAccordion(mocks.homeLoanSteps, {
    heading: 'Home Loan Application Process',
    darkMode: true,
    cta: mocks.dualCTA,
  }),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
