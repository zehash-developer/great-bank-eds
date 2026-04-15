/**
 * Information Panel Block Component
 *
 * This block creates an information panel with optional icon, heading, description,
 * dismissible functionality, and CTA button.
 *
 * Follows EDS decorator pattern:
 * 1. extractData() - Reads from authored DOM structure (table rows/cells)
 * 2. renderHTML() - Generates semantic HTML from extracted data
 * 3. decorate() - Orchestrates extraction, rendering, and event binding
 */

import {
  parseBool,
  getCellText,
  getCellHTML,
  getCellUrl,
  getFirstCell,
} from '../../scripts/utility/shared.js';
import enhanceFileLinks from '../../scripts/link-enhancer.js';

let informationPanelIdCounter = 0;

function generateId(prefix = 'info-panel') {
  informationPanelIdCounter += 1;
  return `${prefix}-${informationPanelIdCounter}`;
}

/**
 * Extract information panel data from DOM structure.
 * Reads from table row cells in the authored structure.
 * Expected structure: One row with cells for each field.
 *
 * @param {HTMLElement} block - The block element containing table structure
 * @returns {Object} Extracted panel data
 */
function extractData(block) {
  const row = getFirstCell(block)?.parentElement;
  if (!row) {
    return {
      type: 'black',
      variant: 'default',
      heading: null,
      icon: null,
      description: null,
      dismissible: false,
      ctaLabel: null,
      url: null,
      openInNewWindow: false,
    };
  }

  const cells = [...row.children];

  // Extract fields from cells (based on model field order)
  const type = getCellText(cells[0]) || 'black';
  const heading = getCellText(cells[1]) || null;
  const icon = getCellText(cells[2]) || null;
  const description = getCellHTML(cells[3]) || null;
  const dismissible = parseBool(getCellText(cells[4]), false);
  const ctaLabel = getCellText(cells[5]) || null;
  const url = getCellUrl(cells[6]) || null;
  const openInNewWindow = parseBool(getCellText(cells[7]), false);
  // Note: classes field (cells[8]) is not extracted here - it's already applied as a block class

  // Determine variant from type
  const variant = type.toLowerCase() === 'red' ? 'accent' : 'default';

  // CTA is only valid when both label and url exist
  const hasCTA = !!(ctaLabel && url);

  return {
    type,
    variant,
    heading,
    icon,
    description,
    dismissible,
    ctaLabel: hasCTA ? ctaLabel : null,
    url: hasCTA ? url : null,
    openInNewWindow,
  };
}

/**
 * Render the information panel HTML from extracted data.
 *
 * @param {Object} data - Extracted panel data
 * @param {string} panelId - Unique ID for the panel
 * @returns {string} HTML string for the panel
 */
function renderHTML(data, panelId) {
  const variantClass = data.variant === 'accent'
    ? 'information-panel-accent'
    : 'information-panel-default';

  // Build icon HTML with proper GEL icon class format (always use outlined variant)
  let iconHTML = '';
  if (data.icon) {
    // Normalize icon name to proper GEL format: gel-icon gel-icon-{name}-outlined
    let iconName = data.icon.trim();
    // Remove "gel-icon-" prefix if present
    iconName = iconName.replace(/^gel-icon-/, '');
    // Remove "-outlined" suffix if present (we'll add it back)
    iconName = iconName.replace(/-outlined$/, '');

    iconHTML = `
      <div class="information-panel-icon" aria-hidden="true">
        <i class="gel-icon gel-icon-${iconName}-outlined" aria-hidden="true"></i>
      </div>
    `;
  }

  const headingHTML = data.heading
    ? `<h4 class="information-panel-heading">${data.heading}</h4>`
    : '';

  const contentHTML = data.description
    ? `<div class="information-panel-content">${data.description}</div>`
    : '';

  const ctaHTML = (data.ctaLabel && data.url)
    ? (() => {
      const target = data.openInNewWindow ? '_blank' : '_self';
      const rel = data.openInNewWindow ? 'rel="noopener noreferrer"' : '';
      return `
          <div class="information-panel-cta">
            <a href="${data.url}" class="button secondary information-panel-cta-button" target="${target}" ${rel}>
              ${data.ctaLabel}
            </a>
          </div>
        `;
    })()
    : '';

  const closeButtonHTML = data.dismissible
    ? `
      <button
        type="button"
        class="information-panel-close"
        aria-label="Dismiss information panel"
        data-panel-id="${panelId}"
      >
        <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
      </button>
    `
    : '';

  return `
    <div class="information-panel-block-container ${variantClass}" id="${panelId}" role="region" aria-label="Information">
      ${iconHTML}
      <div class="information-panel-body">
        ${headingHTML}
        ${contentHTML}
        ${ctaHTML}
      </div>
      ${closeButtonHTML}
    </div>
  `;
}

/**
 * Bind event listeners for dismissible panel.
 * Handles click and keyboard interactions for the close button.
 *
 * @param {HTMLElement} block - The block element
 */
function bindEvents(block) {
  const closeButton = block.querySelector('.information-panel-close');
  if (!closeButton) return;

  closeButton.addEventListener('click', () => {
    const panel = block.querySelector('.information-panel-block-container');
    if (!panel) return;

    panel.classList.add('information-panel-hiding');
    panel.addEventListener('animationend', () => {
      block.style.display = 'none';
      block.setAttribute('aria-hidden', 'true');
    }, { once: true });
  });

  closeButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeButton.click();
    }
  });
}

/**
 * Decorate the information panel block.
 * Follows EDS pattern: extractData → renderHTML → bindEvents.
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  // Extract data from DOM structure
  const data = extractData(block);
  const panelId = generateId();

  // Render HTML
  block.innerHTML = renderHTML(data, panelId);

  // Bind event listeners
  bindEvents(block);

  // Enhance file links
  await enhanceFileLinks(block);
}
