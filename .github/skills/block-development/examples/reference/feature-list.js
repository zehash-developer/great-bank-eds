/**
 * Feature List Block Component
 *
 * Implements GEL-compliant feature list with:
 * - Two variants: White (default) and Grey
 * - Icon support using GEL filled icons
 * - Hyperlink support (White variant only)
 * - Optional heading (visual H5, semantic H2)
 * - Light and Dark mode support via GEL tokens
 * - WCAG 2.1 AA accessibility compliance
 *
 * @see docs/requirements/feature-list.md
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  parseBool,
  getCellText,
  getCellHTML,
  getCellUrl,
  getFirstCell,
  renderBlockHeader,
} from '../../scripts/utility/shared.js';
import enhanceFileLinks from '../../scripts/link-enhancer.js';

// =============================================================================
// ID Generation
// =============================================================================

let featureListIdCounter = 0;
function generateId(prefix = 'feature-list') {
  featureListIdCounter += 1;
  return `${prefix}-${featureListIdCounter}`;
}

// =============================================================================
// Icon Handling
// =============================================================================

/**
 * Normalize icon input to a valid GEL icon class
 * Accepts various formats:
 * - Full class: "gel-icon gel-icon-gift" or "gel-icon gel-icon-info-outlined"
 * - Short name: "gift", "info", "dollar"
 * - With variant suffix: "info-outlined" (filled icons have NO suffix)
 *
 * GEL icon naming convention:
 * - Filled icons: gel-icon-{name} (NO -filled suffix)
 * - Outlined icons: gel-icon-{name}-outlined
 *
 * @param {string} iconInput - The icon input from author
 * @returns {string} - Full GEL icon class string (e.g., "gel-icon gel-icon-gift")
 */
function normalizeIconClass(iconInput) {
  if (!iconInput || iconInput.trim() === '') {
    return ''; // Default icon (filled = no suffix)
  }

  const input = iconInput.trim();

  // If already has "gel-icon gel-icon-" prefix, return as-is
  if (input.startsWith('gel-icon gel-icon-')) {
    return input;
  }

  // If has "gel-icon-" prefix but missing "gel-icon" base class
  if (input.startsWith('gel-icon-')) {
    return `gel-icon ${input}`;
  }

  // Otherwise, treat as short name
  // Filled icons have NO suffix in GEL, only outlined has -outlined suffix
  // Remove any erroneous -filled suffix if present
  const iconName = input.endsWith('-filled') ? input.replace('-filled', '') : input;

  return `gel-icon gel-icon-${iconName}`;
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract feature item data from a DOM row.
 * Based on _feature-list.json model:
 * - Cell 0: icon (text)
 * - Cell 1: description (richtext)
 * - Cell 2: link (URL)
 * - Cell 3: linkText (text)
 * - Cell 4: linkNewWindow (boolean)
 *
 * @param {HTMLElement} row - The row element
 * @param {'white' | 'grey'} variant - The variant type (link only valid for white)
 * @returns {Object|null} Extracted item data or null if invalid
 */
function extractItemFromRow(row, variant) {
  const cells = [...row.children];

  // Validate minimum required cells (icon + description)
  if (cells.length < 2) {
    return null;
  }

  // Extract fields from cells
  const icon = getCellText(cells[0]);
  const description = getCellHTML(cells[1]) || '';
  const linkUrl = getCellUrl(cells[2]) || '';
  const linkText = getCellText(cells[3]) || 'Discover more';
  const linkNewWindow = parseBool(getCellText(cells[4]), false);

  // Check if item is empty (no icon and no description text)
  const descText = description.replace(/<[^>]*>/g, '').trim();
  const isEmpty = icon === '' && !descText;

  // Build link object (only for White variant and if URL exists)
  let link = null;
  if (variant === 'white' && linkUrl) {
    link = {
      url: linkUrl,
      text: linkText,
      newWindow: linkNewWindow,
    };
  }

  return {
    icon,
    description,
    link,
    isEmpty,
    row, // CRITICAL: Keep reference for moveInstrumentation
  };
}

/**
 * Extract feature-list data from DOM structure.
 * Based on _feature-list.json model:
 * - Row 0: type (white/grey)
 * - Row 1: heading (optional)
 * - Row 2: classes (light/dark) - NOT extracted (auto-applied by EDS)
 * - Remaining rows: feature items
 *
 * Cell order must match _feature-list.json model field order.
 *
 * @param {HTMLElement} block - The block element containing table structure
 * @returns {Object} Extracted block data with items array
 */
function extractData(block) {
  console.log('extractData', 'line 120');
  const rows = [...block.children];

  // Extract block-level fields
  const type = getCellText(getFirstCell(rows[0])) || 'white';
  const heading = getCellText(getFirstCell(rows[1])) || null;
  // classes field (row 2) is NOT extracted - EDS applies it automatically

  // Determine variant
  const variant = type.toLowerCase() === 'grey' ? 'grey' : 'white';

  // Apply variant class
  block.classList.remove('white', 'grey');
  block.classList.add(variant);

  // Extract feature items from remaining rows (starting at row 3)
  const items = rows
    .slice(2)
    .map((row) => extractItemFromRow(row, variant))
    .filter(Boolean);

  const data = {
    variant,
    heading,
    items,
  };

  console.log('extractedData', data);
  return data;
}

// =============================================================================
// Render HTML
// =============================================================================

/**
 * Render feature list HTML from extracted data.
 *
 * @param {Object} data - Extracted block data
 * @param {string} listId - Unique list ID
 * @returns {string} HTML string
 */
function renderHTML(data, listId) {
  const headingHTML = data.heading && data.variant === 'grey'
    ? renderBlockHeader({
      heading: data.heading,
      headingLevel: 'h2',
    })
    : '';

  // Feature items
  const itemsHTML = data.items
    .map((item, index) => {
      const itemId = `${listId}-item-${index}`;
      const emptyClass = item.isEmpty ? ' feature-list-item-empty' : '';

      // Link HTML (only for White variant)
      let linkHTML = '';
      if (data.variant === 'white' && item.link) {
        const targetAttr = item.link.newWindow ? ' target="_blank" rel="noopener noreferrer"' : '';
        linkHTML = `
          <a href="${item.link.url}" class="feature-list-link"${targetAttr}>
            ${item.link.text}
          </a>
        `;
      }

      // Normalize icon to GEL icon class format
      const iconClass = normalizeIconClass(item.icon);

      return `
        <div class="feature-list-item${emptyClass}" id="${itemId}" role="listitem" data-index="${index}">
          <div class="feature-list-icon-wrapper" aria-hidden="true">
            ${iconClass ? `<i class="${iconClass}" aria-hidden="true"></i>` : ''}
          </div>
          <div class="feature-list-content">
            <div class="feature-list-description"></div>
            ${linkHTML}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    ${headingHTML}
    <div class="feature-list-items" role="list">
      ${itemsHTML}
    </div>
  `;
}

// =============================================================================
// Event Binding
// =============================================================================

/**
 * Bind keyboard events for links (Enter key activation)
 * @param {HTMLElement} block - The feature list block
 */
function bindEvents(block) {
  const links = block.querySelectorAll('.feature-list-link');
  links.forEach((link) => {
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        // Native behavior handles Enter
      }
    });
  });
}

// =============================================================================
// Main Decorate Function
// =============================================================================

/**
 * Decorate feature list block.
 * Follows EDS pattern: extractData → renderHTML → bindEvents.
 * Preserves Universal Editor instrumentation for authoring mode.
 *
 * Transforms AEM content structure into accessible feature list:
 * - Supports White (default) and Grey variants
 * - Supports Light (default) and Dark mode via 'dark' class
 * - White variant allows hyperlinks (1-8 items)
 * - Grey variant has no hyperlinks (1-5 items)
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  console.log('decorate', 'line 233');

  // Check if already decorated (avoid re-decoration)
  if (block.querySelector('.feature-list-items')) {
    bindEvents(block);
    await enhanceFileLinks(block);
    return;
  }

  const listId = generateId();

  // 1. Extract data from DOM structure
  const data = extractData(block);

  // Apply max items constraint based on variant
  const maxItems = data.variant === 'grey' ? 5 : 8;
  if (data.items.length > maxItems) {
    data.items.splice(maxItems);
  }

  // Keep reference to authored rows for UE instrumentation
  const authoredRows = data.items.map((item) => item.row);

  // 2. Render HTML
  block.innerHTML = renderHTML(data, listId);

  // 3. Move Universal Editor instrumentation from authored elements to rendered elements
  const renderedItems = [...block.querySelectorAll('.feature-list-item')];
  renderedItems.forEach((renderedItem, index) => {
    const authoredRow = authoredRows[index];
    if (!authoredRow) return;

    // Move component instrumentation from row to rendered item
    moveInstrumentation(authoredRow, renderedItem);

    // Move field instrumentation from cells to rendered elements
    const descCell = authoredRow.children?.[1];
    const descTarget = renderedItem.querySelector('.feature-list-description');

    if (descCell && descTarget) {
      // Transfer description content and instrumentation
      descTarget.replaceChildren(...descCell.childNodes);
      moveInstrumentation(descCell, descTarget);
    }
  });

  // 4. Bind event listeners
  bindEvents(block);

  // 5. Enhance file links
  await enhanceFileLinks(block);

  // Set presentation role on block container
  block.setAttribute('role', 'presentation');
}
