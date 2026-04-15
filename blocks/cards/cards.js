/**
 * Cards Block
 *
 * Displays a horizontal row of product/service cards.
 * Each card has an icon, badge tags, title, subtitle (optional),
 * description, and 1–2 CTA buttons.
 *
 * Desktop: CSS grid layout.
 * Mobile: horizontal scrolling carousel via scripts/utility/carousel.js.
 *
 * Authored row shape (one row per card):
 *   Cell 0: icon image (required)
 *   Cell 1: tags — comma-separated text, e.g. "Popular, No Fees" (optional)
 *   Cell 2: title (required)
 *   Cell 3: subtitle — highlighted gold text, e.g. rate/fee callout (optional)
 *   Cell 4: description (required)
 *   Cell 5: CTA links — 1 or 2 <a> elements (required)
 *
 * EDS lifecycle: extractData() → renderHTML() → decorate()
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  getCellText,
  getCellImage,
} from '../../scripts/utility/shared.js';
import {
  initializeCarousel,
  renderCarouselContainer,
} from '../../scripts/utility/carousel.js';

// =============================================================================
// Constants
// =============================================================================

/**
 * Custom carousel thresholds: only activate carousel on mobile (xs / xsl).
 * sm+ (≥ 768px) uses CSS grid — threshold set impossibly high so carousel
 * never activates at those breakpoints.
 */
const CARD_CAROUSEL_THRESHOLDS = {
  xs: 1,
  xsl: 1,
  sm: 99,
  md: 99,
  lg: 99,
  xl: 99,
};

/**
 * Item column spans for mobile carousel item widths.
 * 10/12 columns on xs (shows a sliver of next card).
 * 8/12 on xsl (slightly wider viewport, show more peeking).
 */
const CARD_ITEM_SPANS = {
  xs: 10,
  xsl: 8,
  sm: 4,
  md: 4,
  lg: 4,
  xl: 3,
};

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract CTA link data from a cell element.
 * Queries all <a> elements; falls back to cell text if none found.
 * @param {HTMLElement|null} cell
 * @returns {Array<{text: string, href: string}>}
 */
function getCTAsFromCell(cell) {
  if (!cell) return [];
  const links = [...cell.querySelectorAll('a')];
  if (links.length) {
    return links.map((a) => ({
      text: (a.textContent || '').trim(),
      href: a.getAttribute('href') || '#',
    }));
  }
  // Fallback: plain text in cell treated as a single CTA label with no URL
  const text = (cell.textContent || '').trim();
  return text ? [{ text, href: '#' }] : [];
}

/**
 * Extract a single card's data from an authored row element.
 * @param {HTMLElement} row
 * @returns {{icon: {src:string,alt:string}|null, tags: string[], title: string,
 *   subtitle: string, description: string, ctas: Array, row: HTMLElement}|null}
 */
function extractCardFromRow(row) {
  console.log('extractCardFromRow', 'row', row);
  const cells = [...row.children];

  if (cells.length < 4) {
    console.log('insufficient cells, skipping row');
    return null;
  }

  const icon = getCellImage(cells[0]);
  console.log('icon', icon);

  const tagsRaw = getCellText(cells[1]) || '';
  const tags = tagsRaw
    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : [];
  console.log('tags', tags);

  const title = getCellText(cells[2]) || '';
  console.log('title', title);

  const subtitle = cells[3] ? (getCellText(cells[3]) || '') : '';
  console.log('subtitle', subtitle);

  const description = cells[4] ? (getCellText(cells[4]) || '') : '';
  console.log('description', description);

  const ctas = getCTAsFromCell(cells[5] || null);
  console.log('ctas', ctas);

  if (!title) {
    console.log('missing title, skipping row');
    return null;
  }

  return {
    icon,
    tags,
    title,
    subtitle,
    description,
    ctas,
    row,
  };
}

/**
 * Extract all card data from the block element.
 * @param {HTMLElement} block
 * @returns {{ cards: Array }}
 */
function extractData(block) {
  console.log('extractData');
  const rows = [...block.children];
  console.log('totalRows', rows.length);

  const cards = rows
    .map(extractCardFromRow)
    .filter(Boolean);

  console.log('extractedCards', cards.length);
  return { cards };
}

// =============================================================================
// Render
// =============================================================================

/**
 * Render badge tag pills HTML.
 * @param {string[]} tags
 * @returns {string}
 */
function renderTagsHTML(tags) {
  if (!tags.length) return '';
  const pillsHTML = tags
    .map((tag) => `<span class="card-tag">${tag}</span>`)
    .join('');
  return `<div class="card-tags">${pillsHTML}</div>`;
}

/**
 * Render CTA button links HTML.
 * First link → primary button; second link → outline button.
 * @param {Array<{text: string, href: string}>} ctas
 * @returns {string}
 */
function renderCTAsHTML(ctas) {
  if (!ctas.length) return '';
  const [primary, secondary] = ctas;
  let html = `<a href="${primary.href}" class="button primary btn-md">${primary.text}</a>`;
  if (secondary) {
    html += `<a href="${secondary.href}" class="button outline btn-md">${secondary.text}</a>`;
  }
  return `<div class="card-ctas">${html}</div>`;
}

/**
 * Render a single card item as a carousel list item.
 * @param {{icon, tags, title, subtitle, description, ctas}} card
 * @returns {string}
 */
function renderCardHTML(card) {
  console.log('renderCardHTML', card.title);

  const iconHTML = card.icon?.src
    ? `<div class="card-icon-container" aria-hidden="true">
        <img src="${card.icon.src}" alt="${card.icon.alt}" class="card-icon" width="24" height="24" loading="lazy" />
      </div>`
    : '';

  const subtitleHTML = card.subtitle
    ? `<p class="card-subtitle">${card.subtitle}</p>`
    : '';

  const descriptionHTML = card.description
    ? `<p class="card-description">${card.description}</p>`
    : '';

  return `
    <li class="carousel-item card-item">
      <article class="card">
        ${iconHTML}
        ${renderTagsHTML(card.tags)}
        <h3 class="card-title">${card.title}</h3>
        ${subtitleHTML}
        ${descriptionHTML}
        ${renderCTAsHTML(card.ctas)}
      </article>
    </li>
  `;
}

/**
 * Render the full block HTML.
 * @param {{ cards: Array }} data
 * @returns {string}
 */
function renderHTML(data) {
  console.log('renderHTML', 'cardCount', data.cards.length);
  const cardsHTML = data.cards.map(renderCardHTML).join('');
  return renderCarouselContainer('card', cardsHTML);
}

// =============================================================================
// Main Decorate Function
// =============================================================================

/**
 * Decorate the Cards block.
 * Transforms the document-authored table structure into an accessible
 * card grid with a mobile carousel fallback.
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  console.log('decorate cards');

  const data = extractData(block);
  block.innerHTML = renderHTML(data);

  // Transfer Universal Editor instrumentation from authored rows to rendered items
  const renderedItems = block.querySelectorAll('.card-item');
  data.cards.forEach((card, index) => {
    if (renderedItems[index] && card.row) {
      moveInstrumentation(card.row, renderedItems[index]);
    }
  });

  // Initialise carousel — activates only on mobile (xs / xsl)
  initializeCarousel(block, data.cards.length, {
    carouselThresholds: CARD_CAROUSEL_THRESHOLDS,
    carouselItemSpans: CARD_ITEM_SPANS,
    equalizeHeights: true,
  });
}
