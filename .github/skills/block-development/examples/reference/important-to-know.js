/**
 * Important To Know Block Component
 *
 * Implements an informational panel with:
 * - GEL Outlined Info icon aligned with heading
 * - Mandatory heading (H5 visual, H3 for screen readers)
 * - Required description with rich text support
 * - Light mode (default) and Dark mode support
 *
 * @see https://gel.westpacgroup.com.au/design-system/wbc/components/alert
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  getCellText,
  getCellHTML,
  getFirstCell,
} from '../../scripts/utility/shared.js';
import enhanceFileLinks from '../../scripts/link-enhancer.js';

// =============================================================================
// ID Generation
// =============================================================================

let importantToKnowIdCounter = 0;

function generateId(prefix = 'important-to-know') {
  importantToKnowIdCounter += 1;
  return `${prefix}-${importantToKnowIdCounter}`;
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract important-to-know data from DOM structure.
 * Reads from table row cells in the authored structure.
 * Expected structure: One row with cells for each field.
 *
 * Cell order must match _important-to-know.json model field order:
 * - Cell 0: heading (text)
 * - Cell 1: description (richtext)
 * - classes field is NOT extracted (auto-applied by EDS)
 *
 * @param {HTMLElement} block - The block element containing table structure
 * @returns {{heading: string|null, description: string|null}}
 */
function extractData(block) {
  const row = getFirstCell(block)?.parentElement;
  if (!row) {
    return {
      heading: null,
      description: null,
    };
  }

  const cells = [...row.children];

  // Extract fields from cells (based on model field order in _important-to-know.json)
  const heading = getCellText(cells[0]) || null;
  const description = getCellHTML(cells[1]) || null;
  // Note: classes field is NOT extracted - EDS applies it automatically

  return {
    heading,
    description,
  };
}

// =============================================================================
// Render
// =============================================================================

/**
 * Render important-to-know HTML
 *
 * @param {Object} data - Data from extractImportantToKnowDataFromBlock()
 * @param {string} panelId - Unique panel ID
 * @returns {string} HTML string
 */
function renderHTML(data, panelId) {
  const headingHTML = data.heading
    ? `<h5 class="important-to-know-heading" role="heading" aria-level="3">${data.heading}</h5>`
    : '';

  const descriptionHTML = data.description
    ? `<div class="important-to-know-description">${data.description}</div>`
    : '';

  return `
    <div class="important-to-know-block-container" id="${panelId}" role="region" aria-label="Important to Know">
      <div class="important-to-know-icon" aria-hidden="true">
        <i class="gel-icon gel-icon-info-outlined" aria-hidden="true"></i>
      </div>
      <div class="important-to-know-content">
        ${headingHTML}
        ${descriptionHTML}
      </div>
    </div>
  `;
}

// =============================================================================
// Main Decorator
// =============================================================================

/**
 * Decorate the important-to-know block.
 * Follows EDS pattern: extractData → renderHTML.
 * Preserves Universal Editor instrumentation for authoring mode.
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  // Check if already decorated (avoid re-decoration)
  if (block.querySelector('.important-to-know-block-container')) {
    await enhanceFileLinks(block);
    return;
  }

  const panelId = generateId();

  // 1. Extract data from DOM structure
  const data = extractData(block);

  // Keep reference to authored rows for UE instrumentation
  const originalRows = [...block.children];

  // 2. Render HTML
  block.innerHTML = renderHTML(data, panelId);

  // 3. Move Universal Editor instrumentation from authored elements to rendered elements
  const container = block.querySelector('.important-to-know-block-container');
  if (container && originalRows.length > 0) {
    moveInstrumentation(originalRows[0], container);
  }

  // 4. Enhance file links
  await enhanceFileLinks(block);
}
