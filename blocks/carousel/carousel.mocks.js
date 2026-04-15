/**
 * Carousel Block — Mock Data and Factory
 *
 * Slide shape: { title, description?, linkText?, linkHref?, bgColor?, bgImg? }
 *
 * createCarousel(slides, options) builds the document-shaped DOM and runs decorate().
 *
 * Variations match the Figma visual reference matrix:
 *  - threeSlides  (Variation 1 — 3 slides, navy/gold/teal)
 *  - fiveSlides   (Variation 2 — 5 slides, blue/green/purple/amber/pink)
 *  - twoSlides    (Variation 3 — 2 slides, default palette)
 *  - imageSlides  (image backgrounds)
 */

import { createMockBlock } from '../../scripts/mockBuilder.js';
import decorate from './carousel.js';

// =============================================================================
// Slide data sets
// =============================================================================

/** Variation 1 — 3 slides (navy, gold, teal), matching Figma node 5:5196 row 1 */
export const threeSlides = [
  {
    title: 'Slide 1: Home Loans',
    description: 'Competitive rates from 5.99%',
    linkText: 'Learn more',
    linkHref: '/home-loans',
    bgColor: 'linear-gradient(90deg, #002855 0%, #003D7A 100%)',
  },
  {
    title: 'Slide 2: Credit Cards',
    description: 'Earn rewards on every purchase',
    linkText: 'Apply now',
    linkHref: '/credit-cards',
    bgColor: 'linear-gradient(90deg, #D4AF37 0%, #E8C968 100%)',
  },
  {
    title: 'Slide 3: Insurance',
    description: 'Comprehensive protection',
    bgColor: 'linear-gradient(90deg, #008B8B 0%, #20B2AA 100%)',
  },
];

/** Variation 2 — 5 slides (blue/green/purple/amber/pink), matching Figma node 5:5196 row 2 */
export const fiveSlides = [
  {
    title: 'Slide 1: Savings',
    description: 'High interest savings accounts',
    linkText: 'Open today',
    linkHref: '/savings',
    bgColor: 'linear-gradient(90deg, #0066CC 0%, #3399FF 100%)',
  },
  {
    title: 'Slide 2: Investments',
    description: 'Grow your wealth with expert advice',
    linkText: 'Get started',
    linkHref: '/investments',
    bgColor: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
  },
  {
    title: 'Slide 3: Premium',
    description: 'Exclusive benefits and rewards',
    bgColor: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
  },
  {
    title: 'Slide 4: Business',
    description: 'Solutions for growing businesses',
    linkText: 'Find out more',
    linkHref: '/business',
    bgColor: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
  },
  {
    title: 'Slide 5: Mobile App',
    description: 'Bank anywhere, anytime',
    linkText: 'Download',
    linkHref: '/mobile',
    bgColor: 'linear-gradient(90deg, #EC4899 0%, #F472B6 100%)',
  },
];

/** Variation 3 — 2 slides (navy-teal + gold), matching Figma node 5:5196 row 3 */
export const twoSlides = [
  {
    title: 'New Customer Offer',
    description: 'Switch to Great Bank and get $200 bonus',
    linkText: 'Switch now',
    linkHref: '/switch',
    bgColor: 'linear-gradient(90deg, #002855 0%, #20B2AA 100%)',
  },
  {
    title: 'Refer a Friend',
    description: 'Earn $100 for every successful referral',
    linkText: 'Refer now',
    linkHref: '/refer',
    bgColor: 'linear-gradient(90deg, #D4AF37 0%, #E8C968 100%)',
  },
];

/** Image background slides — exercises image + scrim + white text path */
export const imageSlides = [
  {
    title: 'Home Loans',
    description: 'Competitive rates from 5.99%',
    linkText: 'Learn more',
    linkHref: '/home-loans',
    bgImg: 'https://picsum.photos/seed/carousel1/1200/400',
  },
  {
    title: 'Savings',
    description: 'High interest savings accounts',
    bgImg: 'https://picsum.photos/seed/carousel2/1200/400',
  },
];

/** Minimal required-only slide (exercises no-description, no-link, no-background paths) */
export const minimalSlides = [
  { title: 'Quarterly Update' },
  { title: 'New Branch Opening', description: 'Visit us at Central Station' },
];

// =============================================================================
// Factory function
// =============================================================================

/**
 * Convert slide data to a two-dimensional row array matching extractData()'s
 * expected cell layout:
 *   Cell 0: title (text)
 *   Cell 1: description (text)
 *   Cell 2: link (<a> element or empty string)
 *   Cell 3: background (<img> element or colour string or empty string)
 *
 * @param {Array} slides
 * @returns {Array<Array<string>>}
 */
function slidesToRows(slides) {
  return slides.map((slide) => {
    const linkHTML =
      slide.linkText && slide.linkHref ? `<a href="${slide.linkHref}">${slide.linkText}</a>` : '';

    let bgHTML = '';
    if (slide.bgImg) {
      bgHTML = `<img src="${slide.bgImg}" alt="">`;
    } else if (slide.bgColor) {
      bgHTML = slide.bgColor;
    }

    return [slide.title || '', slide.description || '', linkHTML, bgHTML];
  });
}

/**
 * Build a carousel block and run decorate().
 *
 * @param {Array} slides     - Slide data from mock exports above
 * @param {Object} options
 * @param {boolean} [options.dark=false] - Apply dark class
 * @returns {HTMLElement}
 */
export function createCarousel(slides, { dark = false } = {}) {
  const rows = slidesToRows(slides);
  const block = createMockBlock('carousel', rows);
  if (dark) block.classList.add('dark');
  decorate(block);
  return block;
}
