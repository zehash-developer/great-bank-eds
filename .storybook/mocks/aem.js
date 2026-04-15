/**
 * Mock implementations of AEM utilities for Storybook
 * These replace the actual AEM functions when running in Storybook
 */

/**
 * Creates an optimized picture element (mock version)
 * In Storybook, we just create a simple picture element without optimization
 * 
 * @param {string} src - The image source URL
 * @param {string} alt - Alt text for the image
 * @param {boolean} eager - Whether to load eagerly
 * @param {Array} breakpoints - Breakpoint configurations (ignored in mock)
 * @returns {HTMLPictureElement}
 */
export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = []) {
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  
  img.src = src || 'https://placehold.co/600x400';
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';
  img.style.width = '100%';
  img.style.height = 'auto';
  
  picture.appendChild(img);
  return picture;
}

/**
 * Loads a CSS file (mock - no-op in Storybook)
 * @param {string} href - URL to the CSS file
 */
export async function loadCSS(href) {
  // No-op in Storybook - styles are handled by Vite
  return Promise.resolve();
}

/**
 * Loads a script file (mock - no-op in Storybook)
 * @param {string} src - URL to the script file
 * @param {Object} attrs - Additional attributes
 */
export async function loadScript(src, attrs) {
  // No-op in Storybook
  return Promise.resolve();
}

/**
 * Gets metadata from the document head (mock)
 * @param {string} name - The metadata name
 * @returns {string}
 */
export function getMetadata(name) {
  return '';
}

/**
 * Sample RUM function (mock - no-op)
 */
export function sampleRUM() {
  // No-op in Storybook
}

/**
 * Converts a string to a class name
 * @param {string} name - The string to convert
 * @returns {string}
 */
export function toClassName(name) {
  return typeof name === 'string'
    ? name
        .toLowerCase()
        .replace(/[^0-9a-z]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : '';
}

/**
 * Converts a string to camelCase
 * @param {string} name - The string to convert
 * @returns {string}
 */
export function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Decorates buttons (mock - simplified version)
 * @param {Element} element - Container element
 */
export function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    const up = a.parentElement;
    if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
      a.className = 'button';
      up.classList.add('button-container');
    }
  });
}

/**
 * Decorates icons (mock - simplified version)
 * @param {Element} element - Container element
 */
export function decorateIcons(element) {
  // No-op in Storybook
}

/**
 * Builds a block element (mock)
 * @param {string} blockName - Name of the block
 * @param {*} content - Block content
 * @returns {HTMLElement}
 */
export function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement('div');
  blockEl.classList.add(blockName);
  
  table.forEach((row) => {
    const rowEl = document.createElement('div');
    row.forEach((col) => {
      const colEl = document.createElement('div');
      const vals = col.elems ? col.elems : [col];
      vals.forEach((val) => {
        if (val) {
          if (typeof val === 'string') {
            colEl.innerHTML += val;
          } else {
            colEl.appendChild(val);
          }
        }
      });
      rowEl.appendChild(colEl);
    });
    blockEl.appendChild(rowEl);
  });
  
  return blockEl;
}

/**
 * Reads block configuration (mock)
 * @param {Element} block - The block element
 * @returns {Object}
 */
export function readBlockConfig(block) {
  return {};
}

/**
 * Loads sections (mock - no-op in Storybook)
 * @param {Element} element - Container element
 */
export async function loadSections(element) {
  return Promise.resolve();
}

