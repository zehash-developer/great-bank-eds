/**
 * Card Block Component
 *
 * Displays a grid or carousel of cards with images at the top and content below.
 * Cards are non-clickable display elements with title, optional description, and image.
 * Carousel mode activates automatically based on card count and breakpoint.
 * Uses the standard EDS pattern: extractData → renderHTML → decorate
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/aem.js';
import {
  renderBlockHeader,
  parseBool,
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
 * Extract card-item data from a DOM row.
 * Based on _cards.json model: title(0) | description(1) | card-image-type(2) | image(3)
 *   | pictogram(4) | show-cta(5) | cta1-label(6) | cta1-url(7) | cta1-variant(8)
 *   | cta2-label(9) | cta2-url(10) | cta2-variant(11)
 *
 * @param {HTMLElement} row - The row element
 * @returns {Object|null} Extracted card-item data or null if invalid
 */
function extractCardItemFromRow(row) {
  console.log('extractCardItemFromRow', 'line 33');
  const cells = [...row.children];
  console.log('cells', cells);

  // Must have at least 2 cells (title + description minimum)
  if (cells.length < 2) {
    console.log('insufficient cells, skipping row');
    return null;
  }

  // Cell 0: title (required)
  const title = getCellText(cells[0]);
  console.log('title', title);

  if (!title) {
    console.log('no title found, skipping row');
    return null;
  }

  // Cell 1: description (optional, richtext)
  const description = getCellHTML(cells[1]) || '';
  console.log('description', description);

  // Cell 2: card-image-type (default: 'image')
  const cardImageType = getCellText(cells[2]) || 'image';
  console.log('cardImageType', cardImageType);

  // Cell 3: image (optional)
  const image = getCellImage(cells[3]) || null;
  console.log('image', image);

  // Cell 4: pictogram (optional)
  let pictogram = getCellText(cells[4]) || '';
  // Also check for icon span if text is empty
  if (!pictogram && cells[4]) {
    const span = cells[4].querySelector('span[class]');
    if (span) {
      pictogram = (span.className || '').trim().split(/\s+/)[0] ?? '';
    }
  }
  console.log('pictogram', pictogram);

  // Cell 5: show-cta (boolean, default: false)
  const showCta = parseBool(getCellText(cells[5]), false);
  console.log('showCta', showCta);

  // Cell 6: cta1-label (optional)
  const cta1Label = getCellText(cells[6]) || '';
  console.log('cta1Label', cta1Label);

  // Cell 7: cta1-url (optional)
  const cta1Url = getCellUrl(cells[7]) || '';
  console.log('cta1Url', cta1Url);

  // Cell 8: cta1-variant (default: 'primary')
  const cta1Variant = getCellText(cells[8]) || 'primary';
  console.log('cta1Variant', cta1Variant);

  // Cell 9: cta2-label (optional)
  const cta2Label = getCellText(cells[9]) || '';
  console.log('cta2Label', cta2Label);

  // Cell 10: cta2-url (optional)
  const cta2Url = getCellUrl(cells[10]) || '';
  console.log('cta2Url', cta2Url);

  // Cell 11: cta2-variant (default: 'secondary')
  const cta2Variant = getCellText(cells[11]) || 'secondary';
  console.log('cta2Variant', cta2Variant);

  // Build CTAs array
  const ctas = [];
  if (cta1Label && cta1Url) {
    ctas.push({ link: cta1Url, className: cta1Variant, label: cta1Label });
  }
  if (cta2Label && cta2Url) {
    ctas.push({ link: cta2Url, className: cta2Variant, label: cta2Label });
  }

  return {
    title,
    description,
    cardImageType,
    image,
    pictogram,
    showCta,
    ctas,
    row, // CRITICAL: Keep reference for moveInstrumentation
  };
}

/**
 * Extract block-level data from HTML structure.
 * Based on _cards.json model: type(row 0) | heading(row 1) | info-text(row 2)
 *   | classes(row 3) | items (remaining rows)
 * Note: classes field is automatically applied by EDS to block.classList
 *
 * @param {HTMLElement} block - The block element
 * @returns {Object} Extracted block data with cards array
 */
function extractData(block) {
  console.log('extractData', 'line 127');
  const rows = [...block.children];
  console.log('totalRows', rows.length);

  const data = {
    type: getCellText(getFirstCell(rows[0])) || '',
    heading: getCellText(getFirstCell(rows[1])) || '',
    infoText: getCellText(getFirstCell(rows[2])) || '',
    cards: [],
  };

  console.log('type', data.type);
  console.log('heading', data.heading);
  console.log('infoText', data.infoText);

  // Apply type class to block
  if (data.type) {
    block.classList.add(data.type);
  }

  // Extract card items from remaining rows (starting at row 3, after type/heading/info-text)
  data.cards = rows
    .slice(3)
    .map(extractCardItemFromRow)
    .filter(Boolean);

  console.log('extractedData', data);
  return data;
}

// =============================================================================
// Render
// =============================================================================

/**
 * Render cards HTML using template literals.
 * Renders empty placeholder elements for card content, then transfers actual content
 * via moveInstrumentation in the decorate function.
 *
 * @param {Object} data - Data from extractData
 * @returns {string} HTML string
 */
function renderHTML(data) {
  console.log('renderHTML', 'line 169');
  const { heading, infoText, cards } = data;
  console.log('renderData', data);

  // Render block header if heading exists
  const headingHTML = heading
    ? renderBlockHeader({
      heading,
      infoText,
      headingLevel: 'h2',
    })
    : '';

  // Render cards HTML
  const cardsHTML = cards
    .map(
      (card) => `
    <li class="carousel-item card-item">
      ${card.cardImageType === 'pictogram' && card.pictogram
    ? `<div class="card-pictogram-container">
          <i class="gel-pictogram ${card.pictogram}" aria-hidden="true"></i>
        </div>`
    : ''
}
      ${card.cardImageType === 'image' && card.image?.src
    ? `<div class="card-image-container">
            <img src="${card.image.src}" alt="${card.image.alt}" class="card-image" />
        </div>`
    : ''
}
      <div class="card-content">
        <h3 class="card-title">${card.title}</h3>
        ${card.description ? `<div class="card-description">${card.description}</div>` : ''}
        ${card.showCta && card.ctas && card.ctas.length > 0 ? `
          <div class="card-cta-container">
          ${card.ctas
    .map((cta) => `<a href="${cta.link}" class="button ${cta.className}">${cta.label}</a>`)
    .join('')}
            </div>` : ''}
      </div>
    </li>
  `,
    )
    .join('');

  const html = `
    ${headingHTML}
    ${renderCarouselContainer('card', cardsHTML)}
  `;

  console.log('renderedHTML', html);
  return html;
}

// =============================================================================
// Main Decorate Function
// =============================================================================

/**
 * Decorate card block.
 * Follows EDS pattern: extractData → renderHTML → bindEvents.
 * Preserves Universal Editor instrumentation for authoring mode.
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  console.log('decorate cards', 'line 227');

  // Check if already decorated (avoid re-decoration)
  const isAlreadyDecorated = block.querySelector('.card-block-container') !== null;

  if (isAlreadyDecorated) {
    console.log('Block already decorated, re-initializing carousel only');
    await enhanceFileLinks(block);
    return;
  }

  // 1. Extract data from DOM structure
  const data = extractData(block);
  console.log('extractedData', data);

  if (!data.cards.length) {
    console.log('No cards found, skipping decoration');
    return;
  }

  // 2. Render HTML using template
  const renderedHTML = renderHTML(data);
  console.log('renderedHTML', renderedHTML);

  block.innerHTML = renderedHTML;

  // 3. Move Universal Editor instrumentation from authored elements to rendered elements
  const renderedItems = block.querySelectorAll('.card-item');
  console.log('renderedItems', renderedItems);

  data.cards.forEach((card, index) => {
    const renderedItem = renderedItems[index];
    if (!renderedItem || !card.row) return;

    console.log(`movingInstrumentation for card ${index}`);
    // Move component instrumentation from row to rendered item
    moveInstrumentation(card.row, renderedItem);
  });

  // 4. Decorate icons
  decorateIcons(block);

  // 5. Initialize carousel
  const totalCards = data.cards.length;
  console.log('totalCards', totalCards);

  if (totalCards > 0) {
    requestAnimationFrame(() => {
      console.log('initializingCarousel');
      initializeCarousel(block, totalCards, { equalizeHeights: true });
    });
  }

  // 6. Enhance file links
  await enhanceFileLinks(block);

  console.log('cards decoration complete', 'line 285');
}
