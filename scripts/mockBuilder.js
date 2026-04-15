/**
 * Mock Builder Utilities
 * Common helpers for creating AEM block structures in Storybook stories
 *
 * Usage:
 *   import { createMockBlock, panelsToRows } from '../../scripts/mockBuilder.js';
 *   const block = createMockBlock('accordion', panelsToRows(panels), { variants: ['lego'] });
 *   decorate(block);
 */

/**
 * Build HTML content from a content object
 * Handles common patterns: description, features, steps, paragraphs, notes, links
 * @param {Object|string} content - Content object or string
 * @returns {string} HTML string
 */
export function buildContentHTML(content) {
  if (typeof content === 'string') return content;

  let html = '';
  if (content.description) html += `<p>${content.description}</p>`;
  if (content.steps?.length) {
    html += `<ol>${content.steps.map((s) => `<li>${s}</li>`).join('')}</ol>`;
  }
  if (content.features?.length) {
    html += `<ul>${content.features.map((f) => `<li>${f}</li>`).join('')}</ul>`;
  }
  if (content.paragraphs?.length) {
    content.paragraphs.forEach((p) => { html += `<p>${p}</p>`; });
  }
  if (content.note) html += `<p><em>${content.note}</em></p>`;
  if (content.link) html += `<p><a href="${content.link.url}">${content.link.text}</a></p>`;
  return html;
}

/**
 * Create a mock AEM block structure
 * This creates the raw HTML structure that EDS produces from document authoring,
 * which is then transformed by the block's decorate() function.
 *
 * @param {string} blockName - Block name (e.g., 'accordion', 'cards', 'hero')
 * @param {Array} rows - Array of row data, each row is array of cell contents
 * @param {Object} options - Configuration options
 * @param {Array<string>} options.variants - Variant classes to add (e.g., ['lego', 'tabcordion'])
 * @returns {HTMLElement} Block element ready for decorate()
 *
 * @example
 * // Simple block with string cells
 * createMockBlock('cards', [
 *   ['Card 1 Title', 'Card 1 content'],
 *   ['Card 2 Title', 'Card 2 content'],
 * ]);
 *
 * @example
 * // Accordion with content objects
 * createMockBlock('accordion', panelsToRows(panels), { variants: ['lego'] });
 */
export function createMockBlock(blockName, rows, options = {}) {
  const { variants = [] } = options;

  const block = document.createElement('div');
  block.className = `${blockName} block`;
  block.dataset.blockName = blockName;

  // Add variant classes
  variants.forEach((v) => block.classList.add(v));

  // Create rows with cells (mimics AEM document table structure)
  rows.forEach((rowData) => {
    const row = document.createElement('div');
    const cells = Array.isArray(rowData) ? rowData : [rowData];

    cells.forEach((cellContent) => {
      const cell = document.createElement('div');
      if (typeof cellContent === 'object' && cellContent !== null) {
        cell.innerHTML = buildContentHTML(cellContent);
      } else {
        cell.innerHTML = String(cellContent);
      }
      row.appendChild(cell);
    });

    block.appendChild(row);
  });

  return block;
}

/**
 * Convert panel objects to row format for accordion-style blocks
 * @param {Array} panels - Array of { title, description, features, ... }
 * @returns {Array} Array of [title, contentObject] pairs
 *
 * @example
 * const panels = [{ title: 'FAQ 1', description: 'Answer 1' }];
 * const rows = panelsToRows(panels);
 * // => [['FAQ 1', { description: 'Answer 1' }]]
 */
export function panelsToRows(panels) {
  return panels.map((panel) => {
    const { title, ...content } = panel;
    return [title, content];
  });
}
