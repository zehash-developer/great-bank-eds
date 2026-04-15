/**
 * Action Card Block Component
 *
 * Displays a grid or carousel of action cards with images and optional app card.
 * Carousel mode activates automatically based on card count and breakpoint.
 * Uses the standard EDS pattern: extractData → renderHTML → decorate
 */

import { decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  renderBlockHeader,
  getCellText,
  getCellHTML,
  getCellImage,
  getCellUrl,
  getFirstCell,
} from '../../scripts/utility/shared.js';
import {
  initializeCarousel,
  renderCarouselContainer,
} from '../../scripts/utility/carousel.js';
import enhanceFileLinks from '../../scripts/link-enhancer.js';

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract action-card-item data from a DOM row
 * Based on _action-card.json model: card-type(0) | image(1) | subtitle(2)
 *   | card-heading(3) | description(4) | url(5)
 * @param {HTMLElement} row - The row element
 * @returns {{cardType: string, image: {src: string, alt: string}|null, subtitle: string,
 *   cardHeading: string, description: string, url: string, row: HTMLElement}|null}
 */
function extractCardItemFromRow(row) {
  console.log('extractCardItemFromRow', 'line 32');
  const cells = [...row.children];
  console.log('cells', cells);

  // Must have 6 cells for action-card-item structure
  if (cells.length < 6) {
    console.log('insufficient cells, skipping row');
    return null;
  }

  // Cell 0: card-type (value should be "action-card" or "app-action-card")
  const cardType = getCellText(cells[0]) || 'action-card';
  console.log('cardType', cardType);

  // Cell 1: image (required per JSON)
  const image = getCellImage(cells[1]);
  console.log('image', image);

  // Cell 2: subtitle (optional)
  const subtitle = getCellText(cells[2]) || '';
  console.log('subtitle', subtitle);

  // Cell 3: card-heading (required per JSON)
  const cardHeading = getCellText(cells[3]) || '';
  console.log('cardHeading', cardHeading);

  // Cell 4: description (optional, richtext per JSON)
  const description = getCellHTML(cells[4]) || '';
  console.log('description', description);

  // Cell 5: url (optional)
  const url = getCellUrl(cells[5]);
  console.log('url', url);

  // Cell 6: aria-label (optional, only if url is provided)
  const ariaLabel = url ? getCellText(cells[6]) : '';
  console.log('ariaLabel', ariaLabel);

  return {
    cardType,
    image,
    subtitle,
    cardHeading,
    description,
    url,
    ariaLabel,
    row, // Keep reference for moveInstrumentation
  };
}

/**
 * Extract block-level data from HTML structure
 * Based on _action-card.json model: type(row 0) | heading(row 1)
 *   | supporting-link-label(row 2) | supporting-link-url(row 3)
 * Note: classes field is automatically applied by EDS to block.classList
 * @param {HTMLElement} block - The block element
 * @returns {{type: string, heading: string, supportingLinkLabel: string,
 *   supportingLinkUrl: string, cards: Array}}
 */
function extractData(block) {
  console.log('extractData', 'line 93');
  const rows = [...block.children];
  console.log('totalRows', rows.length);

  const data = {
    type: getCellText(getFirstCell(rows[0])) || '',
    heading: getCellText(getFirstCell(rows[1])) || '',
    supportingLinkLabel: getCellText(getFirstCell(rows[2])) || '',
    supportingLinkUrl: getCellUrl(getFirstCell(rows[3])),
    cards: [],
  };

  console.log('type', data.type);
  console.log('heading', data.heading);
  console.log('supportingLinkLabel', data.supportingLinkLabel);
  console.log('supportingLinkUrl', data.supportingLinkUrl);

  // Apply pale class if type is grey
  if (data.type === 'grey') {
    block.classList.add('pale');
  }

  // Extract card items from remaining rows (starting at row 4)
  data.cards = rows
    .slice(4)
    .map(extractCardItemFromRow)
    .filter(Boolean);

  console.log('extractedData', data);
  return data;
}

// =============================================================================
// Render
// =============================================================================

/**
 * Render action cards HTML using template literals
 * @param {Object} data - Data from extractData
 * @returns {string} HTML string
 */
function renderHTML(data) {
  console.log('renderHTML', 'line 136');
  const {
    heading, supportingLinkLabel, supportingLinkUrl, cards,
  } = data;
  console.log('renderData', data);

  // Render block header if heading exists
  const headingHTML = heading
    ? renderBlockHeader({
      heading,
      hideHeading: false,
      supportingLinkLabel,
      supportingLinkUrl,
      headingLevel: 'h2',
    })
    : '';

  // Render cards
  const cardsHTML = cards
    .map((card, index) => {
      console.log(`renderingCard ${index}`, card);

      // First card always gets special treatment (dark in light mode, white in dark mode)
      const isFirstCard = index === 0;
      const cardClass = isFirstCard ? 'action-card-item action-card-first' : 'action-card-item';

      return `
    <li class="carousel-item ${cardClass}">
      <div class="action-card-item-container">
        <div class="action-card-content">
          ${card.subtitle ? `<p class="action-card-pretitle">${card.subtitle}</p>` : ''}
          <h3 class="action-card-title">${card.cardHeading}</h3>
          ${card.description ? `<div class="action-card-description">${card.description}</div>` : ''}
        </div>
        <div class="action-card-image-container">
          ${card.image?.src ? `<img src="${card.image.src}" alt="${card.image.alt}" class="action-card-image" />` : ''}
        </div>
        ${card.url ? `<a href="${card.url}" ${card.ariaLabel ? `aria-label="${card.ariaLabel}"` : ''} class="action-card-link" tabindex="0"><i class="gel-icon gel-icon-arrow-forward-circle gel-icon-lg action-card-arrow" aria-hidden="true"></i></a>` : ''}
     </div>
    </li>
  `;
    })
    .join('');

  const html = `
    ${headingHTML}
    ${renderCarouselContainer('action-card', cardsHTML, { isStacked: false })}
  `;

  console.log('renderedHTML', html);
  return html;
}

// =============================================================================
// Main Decorate Function
// =============================================================================

/**
 * Decorate action card block
 * Transforms AEM content structure into interactive card grid/carousel
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  console.log('decorate action-card', 'line 278');

  // Check if already decorated
  if (block.querySelector('.action-card-block-container')) {
    console.log('Block already decorated, skipping');
    await enhanceFileLinks(block);
    return;
  }

  // 1. Extract data from HTML structure
  const data = extractData(block);
  console.log('extractedData', data);

  // 2. Render HTML using template
  const renderedHTML = renderHTML(data);
  console.log('renderedHTML', renderedHTML);

  block.innerHTML = renderedHTML;

  // 3. Move Universal Editor instrumentation from original rows to new items
  const items = block.querySelectorAll('.action-card-item');
  console.log('carouselItems', items);

  data.cards.forEach((card, index) => {
    if (items[index] && card.row) {
      console.log(`movingInstrumentation for card ${index}`);
      moveInstrumentation(card.row, items[index]);
    }
  });

  // 4. Decorate icons
  decorateIcons(block);

  // 5. Initialize carousel if needed
  const totalCards = data.cards.length;
  console.log('totalCards', totalCards);

  if (totalCards > 0) {
    requestAnimationFrame(() => {
      console.log('initializingCarousel');
      initializeCarousel(block, totalCards, {
        isStacked: false,
        equalizeHeights: true,
      });
    });
  }

  // 6. Enhance file links
  await enhanceFileLinks(block);

  console.log('action-card decoration complete', 'line 324');
}
