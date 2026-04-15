/**
 * Shared Carousel Utilities
 * Used by: card, action-card, tap-tiles blocks
 */

import { debounce } from './shared.js';

const MAX_CONTENT_WIDTH = 1584;
// =============================================================================
// Default Carousel Thresholds
// =============================================================================

/**
 * Default carousel thresholds by breakpoint
 * These are the most common values used across blocks
 * Can be overridden per block using createCarouselThresholdChecker
 */
const DEFAULT_CAROUSEL_THRESHOLDS = {
  xl: 5, // 1584px+: 5+ items = carousel
  lg: 4, // 1200px+: 4+ items = carousel
  md: 3, // 992px+: 3+ items = carousel
  sm: 3, // 768px+: 3+ items = carousel
  xsl: 2, // 576px+: 3+ items = carousel
  xs: 2, // <576px: 2+ items = carousel
};

const DEFAULT_CAROUSEL_ITEMS_COLUMN_SPAN = {
  xl: 3, // 1584px+: 5+ items = carousel
  lg: 4, // 1200px+: 4+ items = carousel
  md: 4, // 992px+: 3+ items = carousel
  sm: 5, // 768px+: 3+ items = carousel
  xsl: 10, // 576px+: 3+ items = carousel
  xs: 10, // <576px: 2+ items = carousel
};

const GRID_COLUMN_INFO = {
  xl: { padding: 72, gap: 24 },
  lg: { padding: 60, gap: 24 },
  md: { padding: 42, gap: 24 },
  sm: { padding: 36, gap: 24 },
  xsl: { padding: 12, gap: 12 },
  xs: { padding: 12, gap: 12 },
};

// =============================================================================
// Breakpoint Detection
// =============================================================================

/**
 * Get current breakpoint based on window width (GEL breakpoints)
 * @returns {string} Breakpoint name (xs, xsl, sm, md, lg, xl)
 */
export function getCurrentBreakpoint() {
  const width = window.innerWidth;
  if (width >= 1584) return 'xl'; // Extra large (ultrawide)
  if (width >= 1200) return 'lg'; // Large (wide desktop)
  if (width >= 992) return 'md'; // Medium (desktop)
  if (width >= 768) return 'sm'; // Small (tablet)
  if (width >= 576) return 'xsl'; // Extra small landscape
  return 'xs'; // Extra small (mobile)
}

// =============================================================================
// Carousel Threshold Logic
// =============================================================================

/**
 * Create a shouldShowCarousel function with custom or default thresholds
 * @param {Object} [customThresholds] - Optional custom thresholds to override defaults
 * @returns {Function} Function(itemCount, breakpoint) => boolean
 *
 * @example
 * // Use default thresholds
 * const shouldShowCarousel = createCarouselThresholdChecker();
 *
 * @example
 * // Override specific breakpoints
 * const shouldShowCarousel = createCarouselThresholdChecker({
 *   xl: 7,
 *   lg: 7,
 *   md: 6,
 *   sm: 5,
 * });
 */
export function createCarouselThresholdChecker(customThresholds = {}) {
  const thresholds = { ...DEFAULT_CAROUSEL_THRESHOLDS, ...customThresholds };

  return function shouldShowCarousel(itemCount, breakpoint) {
    const threshold = thresholds[breakpoint] || thresholds.lg;
    return itemCount >= threshold;
  };
}

export function createCarouselWidthSetter(customSpans = {}) {
  const spans = { ...DEFAULT_CAROUSEL_ITEMS_COLUMN_SPAN, ...customSpans };

  return function getCarouselItemWidth(breakpoint) {
    const span = spans[breakpoint] || spans.lg;
    const gridInfo = GRID_COLUMN_INFO[breakpoint] || GRID_COLUMN_INFO.lg;
    const { padding, gap } = gridInfo;
    const innerSize = Math.min(window.innerWidth, MAX_CONTENT_WIDTH) - (padding * 2);
    const colWidth = ((innerSize - (gap * 11)) / 12).toFixed(2);
    const totalGap = gap * (span - 1);
    return (colWidth * span) + totalGap;
  };
}

// =============================================================================
// Height Equalization
// =============================================================================

/**
 * Equalize item heights to match tallest item
 * @param {HTMLElement} block - The block element
 * @param {string} itemSelector - CSS selector for items (e.g., '.card-item')
 */
export function equalizeCardHeights(block, itemSelector) {
  console.log('equalizeCardHeights', itemSelector);
  const items = block.querySelectorAll(itemSelector);
  if (items.length === 0) return;

  // Reset heights first
  items.forEach((item) => {
    item.style.height = '';
  });

  // Get tallest item height
  let maxHeight = 0;
  items.forEach((item) => {
    const height = item.offsetHeight;
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  console.log('maxHeight', maxHeight);

  // Set all items to max height
  if (maxHeight > 0) {
    items.forEach((item) => {
      item.style.height = `${maxHeight}px`;
    });
  }
}

// =============================================================================
// Scroll Controls
// =============================================================================

/**
 * Update scroll button states and scrollbar thumb position
 * @param {HTMLElement} list - The scrollable list element
 * @param {HTMLElement} prevBtn - Previous button
 * @param {HTMLElement} nextBtn - Next button
 * @param {HTMLElement} scrollbarThumb - Scrollbar thumb element
 */
export function updateScrollButtons(list, prevBtn, nextBtn, scrollbarThumb) {
  console.log('updateScrollButtons');

  if (!list || !prevBtn || !nextBtn) {
    console.log('missing elements in updateScrollButtons');
    return;
  }

  const { scrollLeft, scrollWidth, clientWidth } = list;
  console.log('scroll info', { scrollLeft, scrollWidth, clientWidth });

  // Check if there's scrollable content
  const hasScroll = scrollWidth > clientWidth;

  if (!hasScroll) {
    // No scrollable content - disable both buttons
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    if (scrollbarThumb) {
      scrollbarThumb.style.width = '100%';
      scrollbarThumb.style.left = '0%';
    }
    console.log('no scroll needed');
    return;
  }

  const isAtStart = scrollLeft <= 1;
  const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

  // Update button disabled states
  prevBtn.disabled = isAtStart;
  nextBtn.disabled = isAtEnd;

  // Update scrollbar thumb position and size
  if (scrollbarThumb) {
    const maxScrollLeft = scrollWidth - clientWidth;
    const scrollPercentage = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
    const thumbWidthPercent = (clientWidth / scrollWidth) * 100;
    const maxThumbLeft = 100 - thumbWidthPercent;
    const thumbLeft = scrollPercentage * maxThumbLeft;

    scrollbarThumb.style.width = `${thumbWidthPercent}%`;
    scrollbarThumb.style.left = `${thumbLeft}%`;

    console.log('scrollbar thumb', { thumbWidthPercent, thumbLeft });
  }

  console.log('button states', { isAtStart, isAtEnd, hasScroll });
}

/**
 * Scroll the carousel by one item width
 * @param {HTMLElement} list - The scrollable list element
 * @param {number} direction - 1 for next, -1 for previous
 */
export function scrollCarousel(list, direction) {
  console.log('scrollCarousel', 'direction', direction);
  const breakpoint = getCurrentBreakpoint();

  const isScrollStart = list.scrollLeft <= 0;
  const isScrollEnd = Math.abs(list.scrollLeft - (list.scrollWidth - list.clientWidth)) < 1;
  const padding = (isScrollStart || isScrollEnd) ? GRID_COLUMN_INFO[breakpoint]?.padding
                  || GRID_COLUMN_INFO.lg.padding : 0;
  const firstItem = list.querySelector(':scope .carousel-item');
  if (!firstItem) return;

  const itemWidth = firstItem.offsetWidth;
  const gap = GRID_COLUMN_INFO[breakpoint]?.gap || GRID_COLUMN_INFO.lg.gap || 0;
  const scrollAmount = (itemWidth + gap + padding) * direction;

  console.log('scroll amount', scrollAmount);
  list.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// =============================================================================
// HTML Rendering
// =============================================================================

/**
 * Render carousel controls HTML (scrollbar + navigation buttons)
 * Adds both generic carousel classes and block-specific classes for styling
 * @param {string} prefix - Block-specific prefix (e.g., 'card', 'action-card', 'tap-tiles')
 * @returns {string} HTML string for carousel controls
 */
export function renderCarouselControls(prefix = 'card') {
  return `
    <div class="carousel-row-2 ${prefix}-row-2">
      <div class="carousel-scrollbar-container ${prefix}-scrollbar-container">
        <div class="carousel-scrollbar ${prefix}-scrollbar">
          <div class="carousel-scrollbar-thumb ${prefix}-scrollbar-thumb"></div>
        </div>
      </div>
      <div class="carousel-controls ${prefix}-controls">
        <button class="carousel-scroll-btn carousel-scroll-prev ${prefix}-scroll-btn ${prefix}-scroll-prev" aria-label="Scroll left" disabled>
          <i class="gel-icon gel-icon-arrow-left gel-icon-md" aria-hidden="true"></i>
        </button>
        <button class="carousel-scroll-btn carousel-scroll-next ${prefix}-scroll-btn ${prefix}-scroll-next" aria-label="Scroll right">
          <i class="gel-icon gel-icon-arrow-right gel-icon-md" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;
}

/**
 * Render carousel container with padding wrapper
 * Structure:
 *   .carousel-list (parent scroll container)
 *     └─ .carousel-list-padding (child wrapper with padding)
 *         └─ ul (list items)
 *
 * Note: The parent (.carousel-list) is the scroll container.
 * The child (.carousel-list-padding) has padding on left and right.
 * Because padding is on a child element inside the scroll container,
 * both left and right padding create scrollable overflow space.
 *
 * @param {string} prefix - Block-specific prefix (e.g., 'card', 'action-card', 'tap-tiles')
 * @param {string} itemsHTML - HTML string for list items
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.isStacked=false] - Whether to apply stacked layout class
 * @returns {string} HTML string for carousel container
 */
export function renderCarouselContainer(prefix, itemsHTML, options = {}) {
  const { isStacked = false } = options;
  return `
    <div class="carousel-block-container ${prefix}-block-container${isStacked ? ` ${prefix}-stacked` : ''}">
      <div class="carousel-list ${prefix}-row-1">
        <div class="carousel-list-padding ${prefix}-list-padding">
          <ul class="${prefix}-list" role="list" tabindex="0">
            ${itemsHTML}
          </ul>
        </div>
      </div>
      ${renderCarouselControls(prefix)}
    </div>
  `;
}

// =============================================================================
// Main Initialization
// =============================================================================

/**
 * Initialize carousel functionality
 * All parameters have defaults - pass only what you want to customize
 * @param {HTMLElement} block - The block element
 * @param {number} itemCount - Number of items in carousel
 * @param {Object} [options={}] - Configuration options (all optional with defaults)
 * @param {boolean} [options.isStacked=false] - Disable carousel (stacked layout)
 * @param {boolean} [options.equalizeHeights=false] - Equalize item heights
 * @param {Object} [options.carouselThresholds] - Custom thresholds
 * @param {Object} [options.carouselItemSpans] - Custom item spans
 * @param {Object} [options.canCarouselItemGrow=false] - Whether carousel items can grow
 *   (e.g., {xl: 7, lg: 7}) - uses defaults if not provided
 */
export function initializeCarousel(block, itemCount, options = {}) {
  console.log('initializeCarousel', 'itemCount:', itemCount);

  // Destructure with defaults
  const {
    isStacked = false,
    equalizeHeights = false,
    carouselThresholds,
    carouselItemSpans,
    canCarouselItemGrow = false,
  } = options;

  // Create threshold checker with custom or default thresholds
  const shouldShowCarousel = createCarouselThresholdChecker(carouselThresholds);
  const getCarouselItemWidth = createCarouselWidthSetter(carouselItemSpans);

  // Query elements
  const container = block.querySelector('.carousel-block-container');
  const list = block.querySelector('.carousel-list'); // The parent scroll container
  const prevBtn = block.querySelector('.carousel-scroll-prev');
  const nextBtn = block.querySelector('.carousel-scroll-next');
  const scrollbarThumb = block.querySelector('.carousel-scrollbar-thumb');
  const scrollbar = block.querySelector('.carousel-scrollbar');

  if (!container || !list || !prevBtn || !nextBtn) {
    console.log('Required carousel elements not found');
    return;
  }

  function applyCarouselItemWidths(breakpoint) {
    const itemWidth = getCarouselItemWidth(breakpoint);
    const items = list.querySelectorAll('.carousel-item');
    items.forEach((item) => {
      item.style.flex = `${canCarouselItemGrow ? '1' : '0'} 0 ${itemWidth}px`;
    });
  }

  /**
   * Update carousel visibility based on breakpoint
   */
  function updateCarouselVisibility() {
    console.log('updateCarouselVisibility');
    const breakpoint = getCurrentBreakpoint();

    applyCarouselItemWidths(breakpoint);

    // Check if carousel should be shown based on thresholds
    const showCarousel = !isStacked && shouldShowCarousel(itemCount, breakpoint);

    console.log('carousel state', {
      breakpoint, itemCount, showCarousel, isStacked,
    });

    // Toggle carousel mode class if container and class provided
    if (container) {
      container.classList.toggle('carousel-mode', showCarousel);
    }

    // Handle height equalization and button updates
    if (showCarousel) {
      requestAnimationFrame(() => {
        if (equalizeHeights) {
          equalizeCardHeights(block, '.carousel-item');
        }
        updateScrollButtons(list, prevBtn, nextBtn, scrollbarThumb);
      });
    } else if (equalizeHeights) {
      // Equalize in non-carousel mode too (if requested)
      requestAnimationFrame(() => {
        equalizeCardHeights(block, '.carousel-item');
      });
    }
  }

  // Initial setup
  updateCarouselVisibility();

  // Scroll button handlers
  prevBtn.addEventListener('click', () => {
    console.log('prev button clicked');
    scrollCarousel(list, -1);
  });

  nextBtn.addEventListener('click', () => {
    console.log('next button clicked');
    scrollCarousel(list, 1);
  });

  // Update buttons and scrollbar after scroll
  list.addEventListener('scroll', () => {
    console.log('list scrolled');
    updateScrollButtons(list, prevBtn, nextBtn, scrollbarThumb);
  });

  // Scrollbar drag functionality
  if (scrollbar && scrollbarThumb) {
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    scrollbarThumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startScrollLeft = list.scrollLeft;
      scrollbarThumb.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const scrollbarWidth = scrollbar.offsetWidth;
      const scrollRatio = list.scrollWidth / scrollbarWidth;
      list.scrollLeft = startScrollLeft + deltaX * scrollRatio;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        scrollbarThumb.style.cursor = 'grab';
      }
    });

    // Click on scrollbar track to jump
    scrollbar.addEventListener('click', (e) => {
      if (e.target === scrollbar) {
        const rect = scrollbar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const scrollbarWidth = scrollbar.offsetWidth;
        const scrollRatio = list.scrollWidth / scrollbarWidth;
        list.scrollLeft = clickX * scrollRatio;
      }
    });
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      console.log('window resized');
      updateCarouselVisibility();
    }, 150);
  });

  // Watch for content dimension changes (e.g., lazy-loaded images, dynamic content)
  const debouncedUpdateScrollButtons = debounce(() => {
    console.log('list dimensions changed (debounced)');
    updateScrollButtons(list, prevBtn, nextBtn, scrollbarThumb);
  }, 100);

  const resizeObserver = new ResizeObserver(() => {
    debouncedUpdateScrollButtons();
  });
  resizeObserver.observe(list);

  // Note: ResizeObserver will automatically disconnect when the observed
  // element is removed from DOM. No explicit cleanup needed in typical EDS block lifecycle
}
