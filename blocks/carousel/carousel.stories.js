/**
 * Carousel Block — Storybook Stories
 *
 * Pattern B: factory in mocks, thin stories.
 * Each story calls createCarousel() which builds document-shaped DOM
 * and runs the real decorate() — Storybook output matches production exactly.
 *
 * Figma references (docs/requirements/carousel/figma/):
 *  - node-5-5196-carousel-light.png  — light mode, all 3 variations
 *  - node-5-5296-carousel-dark.png   — dark mode, all 3 variations
 */

import './carousel.css';
import * as mocks from './carousel.mocks.js';

export default {
  title: 'Blocks/Carousel',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full-width hero banner carousel. Each slide shows a title (h2), optional sub-heading,
optional CTA link, and a configurable background (image, CSS colour/gradient, or default brand palette).

Navigation is manual only — prev/next overlay buttons and pagination dots.
Text colour is WCAG-contrast-computed per slide background.

**Variants**: light (default) · dark

**Figma**: [Light](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5196) ·
[Dark](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-5296)
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
};

// =============================================================================
// Light mode
// =============================================================================

/** Variation 1 (light) — 3 slides: navy, gold, teal */
export const ThreeSlides = {
  name: 'Light — 3 slides',
  render: () => mocks.createCarousel(mocks.threeSlides),
  parameters: {
    docs: {
      description: {
        story:
          'Matches Figma Variation 1 (node 5:5196). ' +
          'Prev button disabled on first slide; next enabled. ' +
          'Gold slide uses navy text (computed contrast).',
      },
    },
  },
};

/** Variation 2 (light) — 5 slides: blue/green/purple/amber/pink */
export const FiveSlides = {
  name: 'Light — 5 slides',
  render: () => mocks.createCarousel(mocks.fiveSlides),
  parameters: {
    docs: {
      description: {
        story: 'Matches Figma Variation 2. Tests amber slide contrast computation.',
      },
    },
  },
};

/** Variation 3 (light) — 2 slides: default palette (navy-teal, gold) */
export const TwoSlides = {
  name: 'Light — 2 slides',
  render: () => mocks.createCarousel(mocks.twoSlides),
  parameters: {
    docs: {
      description: {
        story: 'Matches Figma Variation 3. Minimum slide count (2).',
      },
    },
  },
};

// =============================================================================
// Dark mode
// =============================================================================

/** Dark — 3 slides */
export const DarkThreeSlides = {
  name: 'Dark — 3 slides',
  render: () => mocks.createCarousel(mocks.threeSlides, { dark: true }),
  parameters: {
    docs: {
      description: {
        story:
          'Matches Figma dark variation (node 5:5296). ' +
          'Gold active dot, dark nav buttons with border.',
      },
    },
  },
};

/** Dark — 5 slides */
export const DarkFiveSlides = {
  name: 'Dark — 5 slides',
  render: () => mocks.createCarousel(mocks.fiveSlides, { dark: true }),
};

/** Dark — 2 slides */
export const DarkTwoSlides = {
  name: 'Dark — 2 slides',
  render: () => mocks.createCarousel(mocks.twoSlides, { dark: true }),
};

// =============================================================================
// Image backgrounds
// =============================================================================

/** Image slides — exercises background image + scrim + white text */
export const ImageSlides = {
  name: 'Image backgrounds',
  render: () => mocks.createCarousel(mocks.imageSlides),
  parameters: {
    docs: {
      description: {
        story:
          'Slides with `<img>` background. Semi-transparent scrim is shown. ' +
          'Text is always white for image slides.',
      },
    },
  },
};

/** Image slides — dark mode */
export const DarkImageSlides = {
  name: 'Image backgrounds (dark)',
  render: () => mocks.createCarousel(mocks.imageSlides, { dark: true }),
};

// =============================================================================
// Edge cases
// =============================================================================

/** Minimal — titles only, no description / link / explicit background */
export const MinimalSlides = {
  name: 'Minimal — required fields only',
  render: () => mocks.createCarousel(mocks.minimalSlides),
  parameters: {
    docs: {
      description: {
        story:
          'Only title provided per slide. Default brand palette applied by index. ' +
          'No description, no CTA link.',
      },
    },
  },
};

/** Single slide — prev and next both disabled */
export const SingleSlide = {
  name: 'Single slide',
  render: () => mocks.createCarousel([mocks.threeSlides[0]]),
  parameters: {
    docs: {
      description: {
        story: 'Edge case: one slide. Both nav buttons are disabled.',
      },
    },
  },
};
