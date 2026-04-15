import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  getCellText,
  getCellHTML,
  getFirstCell,
  renderBlockHeader,
} from '../../scripts/utility/shared.js';

/**
 * Extract information card data from DOM structure.
 * Reads from table row cells in the authored structure.
 * Expected structure: One row with cells for each field.
 *
 * Cell order must match _information-card.json model field order:
 * - Cell 0: type (text)
 * - Cell 1: heading (text)
 * - Cell 2: description (text)
 * - Cell 3: cardHeading (text)
 * - Cell 4: subtitle (text)
 * - Cell 5: cardDescription (richtext)
 *
 * @param {HTMLElement} block - The block element containing table structure
 * @returns {Object} Extracted information card data
 */
function extractData(block) {
  // Get first row (direct child of block)
  const row = getFirstCell(block)?.parentElement;
  if (!row) {
    // Return defaults if no data
    return {
      type: 'grey',
      heading: null,
      description: null,
      cardHeading: '',
      subtitle: null,
      cardDescription: '',
      row: null,
    };
  }

  const cells = [...row.children];

  // Extract fields from cells (based on model field order in _information-card.json)
  const type = (getCellText(cells[0]) || 'grey').toLowerCase();
  const heading = getCellText(cells[1]) || null;
  const description = getCellHTML(cells[2]) || null; // richtext field
  const cardHeading = getCellText(cells[3]) || '';
  const subtitle = getCellText(cells[4]) || null;
  const cardDescription = getCellHTML(cells[5]) || '';

  return {
    type,
    heading,
    description,
    cardHeading,
    subtitle,
    cardDescription,
    row, // Keep reference for moveInstrumentation
  };
}

/**
 * Render information card HTML from extracted data.
 *
 * @param {Object} data - Extracted information card data
 * @returns {string} HTML string
 */
function renderHTML(data) {
  const {
    heading,
    description,
    cardHeading,
    subtitle,
    cardDescription,
  } = data;

  // Render block-header if heading or description is provided (optional for both types)
  const headerHTML = (heading || description)
    ? renderBlockHeader({
      heading: heading || '',
      infoText: description || '',
      headingLevel: 'h3',
      customClass: 'information-card-header',
    })
    : '';

  // Card content section (required for both types)
  let html = `${headerHTML}`;
  html += '<div class="information-card-container">';

  // Add subtitle first for both types (product name / product line)
  if (subtitle) {
    html += `<p class="information-card-subtitle">${subtitle}</p>`;
  }

  // Card heading
  html += `<h4 class="information-card-card-heading">${cardHeading}</h4>`;

  // Card description
  html += `<div class="information-card-card-description">${cardDescription}</div>`;

  html += '</div>'; // Close container

  return html;
}

/**
 * Decorate the information card block.
 * Follows EDS pattern: extractData → renderHTML → moveInstrumentation.
 * Preserves Universal Editor instrumentation for authoring mode.
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  // Check if already decorated (avoid re-decoration)
  const isAlreadyDecorated = block.querySelector('.information-card-container') !== null;

  if (isAlreadyDecorated) {
    return;
  }

  // 1. Extract data from DOM structure
  const data = extractData(block);

  // Keep reference to authored row for UE instrumentation
  const authoredRow = data.row;

  // 2. Add type class
  if (data.type) {
    block.classList.add(data.type);
  }

  // 3. Store cell references BEFORE rendering
  const cells = authoredRow ? [...authoredRow.children] : [];

  // 4. Render HTML
  const html = renderHTML(data);
  block.innerHTML = html;

  // 5. Move Universal Editor instrumentation from authored elements to rendered elements
  if (authoredRow && cells.length > 0) {
    // Get the container element for component-level instrumentation
    const container = block.querySelector('.information-card-container');

    // Move component instrumentation from row to container
    if (container) {
      moveInstrumentation(authoredRow, container);
    }

    // Move heading and description instrumentation to block-header elements (if rendered)
    const headingTarget = block.querySelector('.block-heading');
    const descriptionTarget = block.querySelector('.block-info-text');

    // Move heading instrumentation (cell 1)
    if (cells[1] && headingTarget) {
      moveInstrumentation(cells[1], headingTarget);
    }

    // Move description instrumentation (cell 2)
    if (cells[2] && descriptionTarget) {
      moveInstrumentation(cells[2], descriptionTarget);
    }

    // Move card content field instrumentation (all types)
    const cardHeadingTarget = block.querySelector('.information-card-card-heading');
    const subtitleTarget = block.querySelector('.information-card-subtitle');
    const cardDescriptionTarget = block.querySelector('.information-card-card-description');

    // Move cardHeading instrumentation (cell 3)
    if (cells[3] && cardHeadingTarget) {
      moveInstrumentation(cells[3], cardHeadingTarget);
    }

    // Move subtitle instrumentation (cell 4)
    if (cells[4] && subtitleTarget) {
      moveInstrumentation(cells[4], subtitleTarget);
    }

    // Move cardDescription instrumentation (cell 5)
    if (cells[5] && cardDescriptionTarget) {
      moveInstrumentation(cells[5], cardDescriptionTarget);
    }
  }
}
