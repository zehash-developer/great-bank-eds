/**
 * Tap Tiles Block Component
 *
 * Displays a grid or carousel of clickable tiles with optional icons.
 * Carousel mode activates automatically based on tile count and breakpoint.
 * Uses the standard EDS pattern: extractData → renderHTML → decorate
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/aem.js';
import {
  getCellText,
  getCellUrl,
  getFirstCell,
  renderBlockHeader,
} from '../../scripts/utility/shared.js';

import {
  initializeCarousel,
  renderCarouselContainer,
} from '../../scripts/utility/carousel.js';

// =============================================================================
// Extract Data
// =============================================================================

/**
 * Extract tap-tile item data from a DOM row.
 * Based on _tap-tiles.json model: icon(0) | heading(1) | link(2)
 *
 * @param {HTMLElement} row - The row element
 * @returns {Object|null} Extracted item data or null if invalid
 */
function extractTileFromRow(row) {
  const cells = [...row.children];

  if (cells.length < 3) {
    return null;
  }

  const icon = getCellText(cells[0]) || '';
  const heading = getCellText(cells[1]) || '';
  const link = getCellUrl(cells[2]) || '';

  return {
    label: heading,
    url: link,
    openInNew: false,
    icon,
    row,
  };
}

/**
 * Extract tap-tiles data from DOM structure.
 * Based on _tap-tiles.json model:
 * - Row 0: type(0) | heading(1) | classes(2)
 * - Remaining rows: tile items
 *
 * Cell order must match _tap-tiles.json model field order:
 * - Cell 0: type (required - grey or empty)
 * - Cell 1: heading (required)
 * - Cell 2: classes (auto-applied by EDS, not extracted)
 *
 * @param {HTMLElement} block - The block element
 * @returns {Object} Extracted block data with tiles array
 */
function extractData(block) {
  const rows = [...block.children];

  const firstCell = getFirstCell(block);
  if (!firstCell) {
    return {
      heading: '',
      hideHeading: false,
      stackTiles: false,
      type: '',
      tiles: [],
    };
  }

  const blockRow = firstCell.parentElement;
  const blockCells = [...blockRow.children];

  const type = getCellText(blockCells[0]) || '';
  const heading = getCellText(blockCells[1]) || '';

  const data = {
    heading,
    hideHeading: block.classList.contains('hide-heading'),
    stackTiles: block.classList.contains('stack-tiles'),
    type,
    tiles: [],
  };

  if (type === 'grey') {
    block.classList.add('grey');
  }

  const blockRowIndex = rows.indexOf(blockRow);
  data.tiles = rows
    .slice(blockRowIndex + 1)
    .map(extractTileFromRow)
    .filter(Boolean);

  return data;
}

// =============================================================================
// Render
// =============================================================================

/**
 * Render tap tiles HTML using template literals
 * @param {Object} data - Data from extractData
 * @returns {string} HTML string
 */
function renderHTML(data) {
  const {
    heading, hideHeading, stackTiles, tiles,
  } = data;
  const headingHTML = heading
    ? renderBlockHeader({
      heading,
      hideHeading,
      headingLevel: 'h2',
    })
    : '';

  const hasIcons = tiles.some((tile) => tile.icon);
  const tilesHTML = tiles
    .map(
      (tile) => `
    <li class="carousel-item tap-tiles-item">
      <div class="tap-tiles-item-container">
        ${hasIcons && tile.icon ? `<i class="gel-icon gel-icon-${tile.icon} gel-icon-md" aria-hidden="true"></i>` : ''}
        <span class="tap-tiles-label">${tile.label}</span>
        ${tile.url && ` <a href="${tile.url}" class="tap-tiles-link"${tile.openInNew ? ' target="_blank" rel="noopener noreferrer"' : ''}>
        <i class="gel-icon gel-icon-arrow-forward-circle-outlined gel-icon-md tap-tiles-arrow" aria-hidden="true"></i>
        </a>`
}
      </div>
    </li>
  `,
    )
    .join('');

  return `
    ${headingHTML}
    ${renderCarouselContainer('tap-tiles', tilesHTML, { isStacked: stackTiles })}
  `;
}

// =============================================================================
// Main Decorate Function
// =============================================================================

/**
 * Decorate tap tiles block.
 * Follows EDS pattern: extractData → renderHTML → bindEvents.
 * Preserves Universal Editor instrumentation for authoring mode.
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  if (block.querySelector('.tap-tiles-container')) {
    decorateIcons(block);
    if (block.querySelectorAll('.tap-tiles-item').length > 0) {
      requestAnimationFrame(() => {
        initializeCarousel(block, block.querySelectorAll('.tap-tiles-item').length, {
          isStacked: block.classList.contains('stack-tiles'),
          equalizeHeights: false,
          carouselThresholds: {
            xl: 7, lg: 7, md: 6, sm: 5, xsl: 3, xs: 3,
          },
          carouselItemSpans: {
            xl: 2, lg: 2, md: 2.4, sm: 3, xsl: 5.2, xs: 5.2,
          },
          canCarouselItemGrow: true,
        });
      });
    }
    return;
  }

  const data = extractData(block);

  const authoredRows = data.tiles.map((tile) => tile.row);

  block.innerHTML = renderHTML(data);

  const renderedItems = block.querySelectorAll('.tap-tiles-item');
  renderedItems.forEach((renderedItem, index) => {
    const authoredRow = authoredRows[index];
    if (!authoredRow) return;

    moveInstrumentation(authoredRow, renderedItem);
  });

  decorateIcons(block);

  if (data.tiles.length > 0) {
    requestAnimationFrame(() => {
      initializeCarousel(block, data.tiles.length, {
        isStacked: data.stackTiles,
        equalizeHeights: false,
        carouselThresholds: {
          xl: 7, lg: 7, md: 6, sm: 5, xsl: 3, xs: 3,
        },
        carouselItemSpans: {
          xl: 2, lg: 2, md: 2.4, sm: 3, xsl: 5.2, xs: 5.2,
        },
        canCarouselItemGrow: true,
      });
    });
  }
}
