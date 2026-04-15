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

// =============================================================================
// Figma reference helpers
// =============================================================================

const FIGMA_VARIATIONS = [
  { label: 'Variation 1: Carousel (3 Slides)', slides: () => mocks.threeSlides },
  { label: 'Variation 2: Carousel (5 Slides)', slides: () => mocks.fiveSlides },
  { label: 'Variation 3: Carousel (2 Slides - Simple)', slides: () => mocks.twoSlides },
];

/**
 * Render all three Figma variations stacked — mirrors the Figma frame layout
 * (node 5:5196 for light, node 5:5296 for dark).
 */
function renderFigmaPage({ dark = false } = {}) {
  const bg = dark ? '#111827' : '#ffffff';
  const headingColor = dark ? '#f1f5f9' : '#0f172a';

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `background:${bg};padding:24px;font-family:Inter,sans-serif;`;

  const pageTitle = document.createElement('p');
  pageTitle.textContent = 'Carousel Component';
  pageTitle.style.cssText = `color:${headingColor};font-size:20px;font-weight:700;margin:0 0 24px;line-height:28px;`;
  wrapper.appendChild(pageTitle);

  FIGMA_VARIATIONS.forEach(({ label, slides }, i) => {
    const section = document.createElement('div');
    if (i < FIGMA_VARIATIONS.length - 1) section.style.marginBottom = '32px';

    const varLabel = document.createElement('p');
    varLabel.textContent = label;
    varLabel.style.cssText = `color:${headingColor};font-size:14px;font-weight:700;margin:0 0 12px;line-height:20px;`;
    section.appendChild(varLabel);
    section.appendChild(mocks.createCarousel(slides(), { dark }));
    wrapper.appendChild(section);
  });

  return wrapper;
}

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
// Figma reference — composite (mirrors Figma screenshot exactly)
// =============================================================================

/**
 * Figma Light (node 5:5196) — all 3 variations stacked on white,
 * with variation labels matching the Figma frame layout.
 */
export const FigmaLight = {
  name: 'Figma — Light (node 5:5196)',
  render: () => renderFigmaPage({ dark: false }),
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'white' },
    docs: {
      description: {
        story:
          'Composite story mirroring Figma node 5:5196. '
          + 'All 3 variations (3-slide, 5-slide, 2-slide) on white background. '
          + 'Use for side-by-side comparison with the Figma screenshot.',
      },
    },
  },
};

/**
 * Figma Dark (node 5:5296) — all 3 variations stacked on #111827 background,
 * with variation labels matching the Figma frame layout.
 */
export const FigmaDark = {
  name: 'Figma — Dark (node 5:5296)',
  render: () => renderFigmaPage({ dark: true }),
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Composite story mirroring Figma node 5:5296. '
          + 'All 3 variations on #111827 dark background. '
          + 'Dark nav buttons (border, no shadow), gold active dots.',
      },
    },
  },
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
