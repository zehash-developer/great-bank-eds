/**
 * Shared utility functions for EDS blocks
 */

/**
 * Check if we're in Universal Editor authoring mode
 * @returns {boolean} True if in authoring mode
 */
export function isAuthoringMode() {
  return document.querySelector('[data-aue-resource]') !== null;
}

/**
 * Parse a boolean value from a string
 * @param {*} v - Value to parse
 * @param {boolean} fallback - Default value if parsing fails
 * @returns {boolean} Parsed boolean value
 */
export function parseBool(v, fallback = false) {
  const s = String(v ?? '').trim().toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  return fallback;
}

/**
 * Normalize a URL string
 * @param {string} raw - Raw URL input
 * @returns {string|null} Normalized URL or null
 */
export function normalizeUrl(raw) {
  const v = String(raw ?? '').trim();
  if (!v) return null;
  if (v.startsWith('#') || v.startsWith('/') || v.startsWith('./') || v.startsWith('../')) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/**
 * Get text content from a Universal Editor field
 * @param {HTMLElement} block - Block element
 * @param {string} prop - Property name (data-aue-prop value)
 * @returns {string|null} Text content or null
 */
export function getUEText(block, prop) {
  const el = block.querySelector(`[data-aue-prop="${prop}"]`);
  return el ? (el.textContent || '').trim() : null;
}

/**
 * Get text content directly from a DOM element (cell or block)
 * @param {HTMLElement} element - DOM element to extract text from
 * @returns {string|null} Text content or null
 */
export function getCellText(element) {
  if (!element) return null;
  return (element.textContent || '').trim() || null;
}

/**
 * Get rich text HTML from a Universal Editor field
 * Processes links to add button tertiary class and reference-link class for bracketed content
 * @param {HTMLElement} block - Block element
 * @param {string} prop - Property name (data-aue-prop value)
 * @returns {string|null} HTML content or null
 */
export function getUERichTextHTML(block, prop) {
  const el = block.querySelector(`[data-aue-prop="${prop}"]`);
  if (!el) return null;
  return (el.innerHTML || '').trim();
}

/**
 * Get rich text HTML directly from a DOM element (cell or block)
 * Processes links to add button tertiary class and reference-link class for bracketed content
 * @param {HTMLElement} element - DOM element to extract HTML from
 * @returns {string|null} HTML content or null
 */
export function getCellHTML(element) {
  if (!element) return null;
  return (element.innerHTML || '').trim() || null;
}

/**
 * Get image data from a Universal Editor reference field
 * @param {HTMLElement} element - Container element (block or row)
 * @param {string} prop - Property name (data-aue-prop value)
 * @returns {{src: string, alt: string}|null} Image data or null
 */
export function getUEImage(element, prop) {
  const img = element.querySelector(`[data-aue-prop="${prop}"]`);
  return img ? { src: img.src, alt: img.alt || '' } : null;
}

/**
 * Get image data directly from a DOM element (cell, row, or block)
 * @param {HTMLElement} element - Container element to search for image
 * @returns {{src: string, alt: string}|null} Image data or null
 */
export function getCellImage(element) {
  if (!element) return null;

  const img = element.querySelector('img');
  return img ? { src: img.src, alt: img.alt || '' } : null;
}

/**
 * Get URL directly from a DOM element and normalize it
 * @param {HTMLElement} element - DOM element to extract URL from
 * @returns {string} Normalized URL or empty string
 */
export function getCellUrl(element) {
  if (!element) return '';
  const url = (element.textContent || '').trim();
  if (!url) return '';
  return normalizeUrl(url) || url;
}

/**
 * Helper to safely get first cell from a row
 * @param {HTMLElement} row - Row element
 * @returns {HTMLElement|null} First cell or null
 */
export function getFirstCell(row) {
  return row?.children?.[0] || null;
}

/**
 * Render block header HTML with optional heading, supporting link, and info text
 * Uses fixed class names: block-header, block-heading, block-supporting-link, block-info-text
 *
 * @param {Object} options - Header configuration options
 * @param {string} options.heading - Heading text (required)
 * @param {boolean} [options.hideHeading=false] - Whether to visually hide the heading
 *   (still accessible via aria-label)
 * @param {string} [options.supportingLinkLabel=''] - Optional supporting link text
 * @param {string} [options.supportingLinkUrl=''] - Optional supporting link URL
 * @param {string} [options.infoText=''] - Optional info/description text below heading.
 *   Can be plain text (will be wrapped in a div) or richtext HTML (will be used as-is).
 * @param {string} [options.headingLevel='h2'] - HTML heading element (h1-h6)
 * @param {string} [options.customClass=''] - Additional CSS class for top-level container
 *
 * @returns {string} HTML string for the block header section
 *
 * @example
 * // Simple heading
 * renderBlockHeader({ heading: 'My Title' })
 *
 * @example
 * // Heading with supporting link and custom class
 * renderBlockHeader({
 *   heading: 'Featured Products',
 *   supportingLinkLabel: 'View all',
 *   supportingLinkUrl: '/products',
 *   customClass: 'action-card-header'
 * })
 *
 * @example
 * // Hidden heading with info text
 * renderBlockHeader({
 *   heading: 'Card List',
 *   hideHeading: true,
 *   infoText: 'Browse our collection',
 *   customClass: 'card-header'
 * })
 */
export function renderBlockHeader(options = {}) {
  const {
    heading = '',
    hideHeading = false,
    supportingLinkLabel = '',
    supportingLinkUrl = '',
    infoText = '',
    headingLevel = 'h2',
    customClass = '',
  } = options;

  // Return empty string if no heading provided
  if (!heading) {
    return '';
  }

  // Determine if we need a header container (when supporting link exists)
  const hasSupportingLink = supportingLinkLabel && supportingLinkUrl;
  const hasInfoText = infoText && infoText.length > 0;

  // Build heading HTML
  const ariaLabelAttr = hideHeading ? ` aria-label="${heading}"` : '';
  const headingContent = hideHeading ? '' : heading;

  const headingHTML = `<${headingLevel} class="block-heading"${ariaLabelAttr}>${headingContent}</${headingLevel}>`;

  // Build supporting link HTML (if provided)
  const supportingLinkHTML = hasSupportingLink
    ? `<a href="${supportingLinkUrl}" class="block-supporting-link  button tertiary">${supportingLinkLabel}<i class="gel-icon gel-icon-arrow-right gel-icon-md" aria-hidden="true"></i></a>`
    : '';

  // Build info text HTML (if provided) - always on new line as block element
  // Support both plain text (wrapped in <p>) and richtext (already contains HTML)
  const infoTextHTML = hasInfoText
    ? `<div class="block-info-text">${infoText}</div>`
    : '';

  const wrapperClassNames = ['block-header', customClass].filter(Boolean).join(' ');

  return `
    <div class="${wrapperClassNames}">
      ${headingHTML}
      ${supportingLinkHTML}
      ${infoTextHTML}
    </div>
  `.trim();
}

/**
 * Debounce a function to limit how often it can be called
 * Returns a debounced version of the function that delays execution until after
 * the specified wait time has elapsed since the last time it was invoked
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 *
 * @example
 * // Debounce a resize handler
 * const debouncedResize = debounce(() => {
 *   console.log('Window resized');
 * }, 150);
 * window.addEventListener('resize', debouncedResize);
 *
 * @example
 * // Debounce a search input
 * const debouncedSearch = debounce((query) => {
 *   performSearch(query);
 * }, 300);
 * inputElement.addEventListener('input', (e) => debouncedSearch(e.target.value));
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Make all focusable elements within aria-hidden containers unfocusable
 * This prevents accessibility violations where focusable content exists inside aria-hidden elements
 * Complies with WCAG 2.1 Level A success criteria 4.1.2 and 2.1.1
 *
 * @param {HTMLElement} element - The element to process
 *
 * @example
 * // After rendering content with aria-hidden elements
 * const block = document.querySelector('.my-block');
 * removeFocusFromAriaHidden(block);
 */
export function removeFocusFromAriaHidden(element) {
  const ariaHiddenElements = element.querySelectorAll('[aria-hidden="true"]');

  ariaHiddenElements.forEach((hiddenElement) => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const focusableElements = hiddenElement.querySelectorAll(focusableSelectors.join(','));

    focusableElements.forEach((focusable) => {
      focusable.setAttribute('tabindex', '-1');
    });
  });
}
