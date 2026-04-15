/**
 * Carousel Block
 *
 * Full-width, single-slide hero banner carousel.
 * Navigation: prev/next overlay buttons + pagination dots.
 * Manual only — no auto-advance.
 * Text colour is WCAG-contrast-computed per slide background.
 *
 * Authored row shape (one row per slide):
 *   Cell 0: title (required)
 *   Cell 1: description (optional text)
 *   Cell 2: CTA link (optional <a>)
 *   Cell 3: background — <img> or CSS colour/gradient string (optional)
 *
 * EDS lifecycle: extractData() → renderHTML() → decorate()
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import { getCellText, getCellImage } from '../../scripts/utility/shared.js';

// =============================================================================
// Constants
// =============================================================================

const CHEVRON_LEFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
  <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

const CHEVRON_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

/** Default brand gradient palette — cycles by slide index. */
const DEFAULT_GRADIENTS = [
  ['#002855', '#003D7A'],
  ['#D4AF37', '#E8C968'],
  ['#008B8B', '#20B2AA'],
  ['#0066CC', '#3399FF'],
  ['#10B981', '#34D399'],
  ['#8B5CF6', '#A78BFA'],
  ['#F59E0B', '#FBBF24'],
  ['#EC4899', '#F472B6'],
];

// =============================================================================
// WCAG Contrast Utilities
// =============================================================================

/**
 * Parse a 6-digit hex colour to [r, g, b] (0–255 each).
 * Returns null if the string is not a recognisable 3- or 6-digit hex.
 * @param {string} hex
 * @returns {number[]|null}
 */
function hexToRgb(hex) {
  const clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    return clean.split('').map((c) => parseInt(c + c, 16));
  }
  if (clean.length === 6) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return null;
}

/**
 * Blend two hex colours at the given fraction (0 = from, 1 = to).
 * @param {string} from
 * @param {string} to
 * @param {number} t
 * @returns {number[]} [r, g, b]
 */
function blendRgb(from, to, t = 0.5) {
  const a = hexToRgb(from) || [0, 0, 0];
  const b = hexToRgb(to) || [0, 0, 0];
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/**
 * Compute WCAG 2.1 relative luminance from an [r, g, b] array (0–255).
 * @param {number[]} rgb
 * @returns {number}
 */
function relativeLuminance([r, g, b]) {
  return [r, g, b].reduce((acc, c, i) => {
    const s = c / 255;
    const lin = s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    return acc + lin * [0.2126, 0.7152, 0.0722][i];
  }, 0);
}

/**
 * Return '#ffffff' or '#002855' whichever meets WCAG 4.5:1 against bgRgb.
 * White is preferred; navy is used as fallback when white fails.
 * @param {number[]} bgRgb
 * @returns {string}
 */
function wcagTextColor(bgRgb) {
  const bgL = relativeLuminance(bgRgb);
  const whiteL = 1;
  const whiteContrast = (whiteL + 0.05) / (bgL + 0.05);
  return whiteContrast >= 4.5 ? '#ffffff' : '#002855';
}

/**
 * Determine the text colour to use over a CSS gradient or solid colour string.
 * Parses the last two hex stops from the gradient and uses their midpoint.
 * Falls back to white when parsing is not possible.
 * @param {string} cssValue - e.g. 'linear-gradient(90deg, #002855 0%, #003D7A 100%)' or '#002855'
 * @returns {string}
 */
function textColorFromCss(cssValue) {
  const hexMatches = (cssValue || '').match(/#[0-9a-fA-F]{3,6}/g);
  if (!hexMatches || hexMatches.length === 0) return '#ffffff';
  if (hexMatches.length === 1) {
    const rgb = hexToRgb(hexMatches[0]);
    return rgb ? wcagTextColor(rgb) : '#ffffff';
  }
  // Use midpoint of first and last hex stops
  const midRgb = blendRgb(hexMatches[0], hexMatches[hexMatches.length - 1]);
  return wcagTextColor(midRgb);
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract slide data from a single authored row.
 * @param {HTMLElement} row
 * @param {number} index - Zero-based slide index for palette fallback
 * @returns {{ title: string, description: string, linkHref: string, linkText: string,
 *   bgImg: {src: string, alt: string}|null, bgColor: string|null, row: HTMLElement }}
 */
function extractSlideFromRow(row, index) {
  const cells = [...row.children];

  const title = getCellText(cells[0]) || '';
  const description = getCellText(cells[1]) || '';

  // Cell 2: optional CTA link
  const linkEl = cells[2] ? cells[2].querySelector('a') : null;
  const linkHref = linkEl ? linkEl.href : '';
  const linkText = linkEl ? (linkEl.textContent || '').trim() : '';

  // Cell 3: optional background — img or colour text
  const bgImg = cells[3] ? getCellImage(cells[3]) : null;
  let bgColor = null;
  if (!bgImg && cells[3]) {
    const raw = getCellText(cells[3]);
    if (raw) bgColor = raw;
  }

  console.log(`slide[${index}]`, { title, description, linkHref, linkText, bgImg, bgColor });
  return {
    title,
    description,
    linkHref,
    linkText,
    bgImg,
    bgColor,
    row,
  };
}

/**
 * Extract all slide data from the block's authored rows.
 * @param {HTMLElement} block
 * @returns {Array}
 */
function extractData(block) {
  const rows = [...block.children];
  return rows.map((row, i) => extractSlideFromRow(row, i));
}

// =============================================================================
// Render
// =============================================================================

/**
 * Build the CSS background style value and resolved text colour for a slide.
 * @param {{ bgImg: object|null, bgColor: string|null }} slide
 * @param {number} index
 * @returns {{ bg: string, textColor: string, isImage: boolean }}
 */
function resolveSlideBackground(slide, index) {
  const { bgImg, bgColor } = slide;

  if (bgImg) {
    return {
      bg: `url('${bgImg.src}')`, textColor: '#ffffff', isImage: true,
    };
  }

  if (bgColor) {
    const textColor = textColorFromCss(bgColor);
    const isGradient = bgColor.includes('gradient');
    const bg = isGradient ? bgColor : 'none';
    return {
      bg, textColor, isImage: false, solidColor: isGradient ? null : bgColor,
    };
  }

  const [from, to] = DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length];
  const midRgb = blendRgb(from, to);
  const textColor = wcagTextColor(midRgb);
  return {
    bg: `linear-gradient(90deg, ${from} 0%, ${to} 100%)`,
    textColor,
    isImage: false,
  };
}

/**
 * Render a single slide <li> as an HTML string.
 * @param {object} slide
 * @param {number} index
 * @param {number} total
 * @returns {string}
 */
function renderSlide(slide, index, total) {
  const { title, description, linkHref, linkText } = slide;

  const descHTML = description ? `<p class="carousel-slide-description">${description}</p>` : '';

  const ctaHTML =
    linkHref && linkText ? `<a class="carousel-slide-cta" href="${linkHref}">${linkText}</a>` : '';

  // aria-hidden on non-first slides; toggled in decorate
  const hidden = index !== 0 ? 'aria-hidden="true"' : '';

  return `
    <li class="carousel-slide" role="group" aria-roledescription="slide"
        aria-label="Slide ${index + 1} of ${total}" ${hidden}
        data-slide-index="${index}">
      <div class="carousel-slide-scrim" aria-hidden="true"></div>
      <div class="carousel-slide-content">
        <h2 class="carousel-slide-title">${title}</h2>
        ${descHTML}
        ${ctaHTML}
      </div>
    </li>`;
}

/**
 * Render the full carousel HTML string.
 * @param {Array} slides
 * @returns {string}
 */
function renderHTML(slides) {
  const total = slides.length;

  const slidesHTML = slides.map((s, i) => renderSlide(s, i, total)).join('');

  const dotsHTML = slides
    .map((_, i) => {
      const current = i === 0 ? 'aria-current="true"' : '';
      return `<button class="carousel-dot${i === 0 ? ' carousel-dot--active' : ''}"
        aria-label="Go to slide ${i + 1}" ${current} data-dot-index="${i}"></button>`;
    })
    .join('');

  return `
    <div class="carousel-viewport" aria-roledescription="carousel" aria-label="Promotional carousel" role="region">
      <ul class="carousel-track" aria-live="polite">
        ${slidesHTML}
      </ul>
      <button class="carousel-nav carousel-nav--prev" aria-label="Previous slide" aria-disabled="true">
        ${CHEVRON_LEFT_SVG}
      </button>
      <button class="carousel-nav carousel-nav--next" aria-label="Next slide"${total <= 1 ? ' aria-disabled="true"' : ''}>
        ${CHEVRON_RIGHT_SVG}
      </button>
    </div>
    <div class="carousel-dots" role="tablist" aria-label="Slide navigation">
      ${dotsHTML}
    </div>`;
}

// =============================================================================
// Decorate Helpers
// =============================================================================

/**
 * Apply slide backgrounds and text colours to rendered slide elements.
 * @param {HTMLElement} block
 * @param {Array} slides
 */
function applyBackgrounds(block, slides) {
  slides.forEach((slide, i) => {
    const slideEl = block.querySelector(`[data-slide-index="${i}"]`);
    if (!slideEl) return;

    const {
      bg, textColor, isImage, solidColor,
    } = resolveSlideBackground(slide, i);

    if (bg !== 'none') {
      slideEl.style.backgroundImage = bg;
    }
    if (solidColor) {
      slideEl.style.backgroundColor = solidColor;
    }
    if (isImage) {
      slideEl.style.backgroundSize = 'cover';
      slideEl.style.backgroundPosition = 'center';
      slideEl.style.backgroundRepeat = 'no-repeat';
      // Show scrim for image slides to guarantee legibility
      const scrim = slideEl.querySelector('.carousel-slide-scrim');
      if (scrim) scrim.removeAttribute('aria-hidden');
    }

    // Apply contrast-computed text colour
    slideEl.style.setProperty('--slide-text-color', textColor);
  });
}

/**
 * Update active state: aria-hidden on slides, aria-current + class on dots,
 * and aria-disabled on nav buttons.
 * @param {HTMLElement} block
 * @param {number} activeIndex
 * @param {number} total
 */
function updateActiveState(block, activeIndex, total) {
  // Slides
  block.querySelectorAll('.carousel-slide').forEach((el, i) => {
    const isActive = i === activeIndex;
    el.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  // Dots
  block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    const isActive = i === activeIndex;
    dot.classList.toggle('carousel-dot--active', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });

  // Nav buttons
  const prevBtn = block.querySelector('.carousel-nav--prev');
  const nextBtn = block.querySelector('.carousel-nav--next');
  if (prevBtn) prevBtn.setAttribute('aria-disabled', activeIndex === 0 ? 'true' : 'false');
  if (nextBtn) nextBtn.setAttribute('aria-disabled', activeIndex === total - 1 ? 'true' : 'false');
}

/**
 * Scroll the carousel track to the given slide index instantly or smoothly.
 * @param {HTMLElement} track
 * @param {number} index
 * @param {boolean} smooth
 */
function scrollToSlide(track, index, smooth = true) {
  const slide = track.children[index];
  if (!slide) return;
  track.scrollTo({
    left: slide.offsetLeft,
    behavior: smooth ? 'smooth' : 'instant',
  });
}

// =============================================================================
// Event Wiring
// =============================================================================

/**
 * Wire prev/next buttons, dot buttons, and scroll-based sync.
 * @param {HTMLElement} block
 * @param {number} total
 */
function wireEvents(block, total) {
  const track = block.querySelector('.carousel-track');
  if (!track) return;

  let activeIndex = 0;
  let scrolling = false;

  function goTo(index) {
    const clamped = Math.max(0, Math.min(total - 1, index));
    if (clamped === activeIndex) return;
    activeIndex = clamped;
    scrollToSlide(track, activeIndex);
    updateActiveState(block, activeIndex, total);
  }

  // Prev button
  const prevBtn = block.querySelector('.carousel-nav--prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (prevBtn.getAttribute('aria-disabled') === 'true') return;
      goTo(activeIndex - 1);
    });
  }

  // Next button
  const nextBtn = block.querySelector('.carousel-nav--next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (nextBtn.getAttribute('aria-disabled') === 'true') return;
      goTo(activeIndex + 1);
    });
  }

  // Dot buttons
  block.querySelectorAll('.carousel-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.dotIndex, 10);
      goTo(idx);
    });
  });

  // Keyboard: left/right arrow keys on the viewport
  const viewport = block.querySelector('.carousel-viewport');
  if (viewport) {
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (e.key === 'ArrowRight') goTo(activeIndex + 1);
      if (e.key === 'Home') goTo(0);
      if (e.key === 'End') goTo(total - 1);
    });
  }

  // Scroll sync: update state when user swipes/scrolls
  track.addEventListener('scroll', () => {
    if (scrolling) return;
    scrolling = true;
    requestAnimationFrame(() => {
      const slideWidth = track.children[0]?.offsetWidth || 1;
      const newIndex = Math.round(track.scrollLeft / slideWidth);
      if (newIndex !== activeIndex) {
        activeIndex = Math.max(0, Math.min(total - 1, newIndex));
        updateActiveState(block, activeIndex, total);
      }
      scrolling = false;
    });
  });
}

// =============================================================================
// Entry Point
// =============================================================================

/**
 * Decorate the carousel block.
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const slides = extractData(block);

  if (slides.length === 0) {
    block.innerHTML = '';
    return;
  }

  // Preserve UE instrumentation on slide rows before replacing innerHTML
  const originalRows = [...block.children];

  const html = renderHTML(slides);
  block.innerHTML = html;

  // Restore UE instrumentation: map authored rows → rendered slide elements
  const renderedSlides = block.querySelectorAll('.carousel-slide');
  originalRows.forEach((row, i) => {
    if (renderedSlides[i]) moveInstrumentation(row, renderedSlides[i]);
  });

  // Apply backgrounds and text colours
  applyBackgrounds(block, slides);

  // Set initial accessible state
  updateActiveState(block, 0, slides.length);

  // Wire interactions (deferred one frame so layout is settled)
  requestAnimationFrame(() => {
    wireEvents(block, slides.length);
    // Ensure track starts at position 0 without animation
    const track = block.querySelector('.carousel-track');
    if (track) scrollToSlide(track, 0, false);
  });
}
