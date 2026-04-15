/**
 * Accordion Block Component
 *
 * Implements GEL-compliant accordion with:
 * - Expand/collapse functionality with animated plus/minus icon
 * - Multi-panel support (multiple panels can be open)
 * - Full keyboard navigation (Enter, Space, Arrow keys, Home, End)
 * - ARIA accessibility attributes
 * - Smooth animations
 * - Light mode (default) and Dark mode support
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  getCellText,
  getCellHTML,
  getFirstCell,
  renderBlockHeader,
} from '../../scripts/utility/shared.js';
import enhanceFileLinks from '../../scripts/link-enhancer.js';

// =============================================================================
// ID Generation
// =============================================================================

let accordionIdCounter = 0;
function generateId(prefix = 'accordion') {
  accordionIdCounter += 1;
  return `${prefix}-${accordionIdCounter}`;
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract accordion item data from a DOM row.
 * Based on _accordion.json model: title(0) | content(1)
 *
 * @param {HTMLElement} row - The row element
 * @returns {{title: string, content: string, isEmpty: boolean, row: HTMLElement}|null}
 *   Extracted item data or null if invalid
 */
function extractItemFromRow(row) {
  const cells = [...row.children];

  // Must have 2 cells for accordion-item structure
  if (cells.length < 2) {
    return null;
  }

  // Cell 0: title (required, plain text)
  const title = getCellText(cells[0]) || '';

  // Cell 1: content (optional, richtext)
  const content = getCellHTML(cells[1]) || '';

  // Check if item is empty (no content after stripping HTML)
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  const isEmpty = !title.trim() && !textContent;

  return {
    title,
    content,
    isEmpty,
    row, // Keep reference for moveInstrumentation
  };
}

/**
 * Extract accordion block data from DOM structure.
 * Based on _accordion.json model: title(row 0) | classes(row 1) | items (remaining rows)
 * Note: classes field is automatically applied by EDS to block.classList
 *
 * @param {HTMLElement} block - The block element
 * @returns {{title: string, items: Array<{title: string, content: string,
 *   isEmpty: boolean, row: HTMLElement}>}} Extracted block data
 */
function extractData(block) {
  const rows = [...block.children];

  const data = {
    title: getCellText(getFirstCell(rows[0])) || '',
    items: [],
  };

  // Extract accordion items from remaining rows (starting at row 1)
  // Note: We skip row 1 (classes field) as it's already applied to block.classList by EDS
  data.items = rows
    .slice(1)
    .map(extractItemFromRow)
    .filter(Boolean);

  return data;
}

// =============================================================================
// Render
// =============================================================================

/**
 * Render accordion HTML.
 *
 * @param {Object} data - Extracted accordion data
 * @param {string} accordionId - Unique accordion ID
 * @returns {string} HTML string
 */
function renderHTML(data, accordionId) {
  const { title, items } = data;

  const headingHTML = title
    ? renderBlockHeader({
      heading: title,
      headingLevel: 'h2',
    })
    : '';

  const itemsHTML = items
    .map((item, index) => {
      const panelId = `${accordionId}-panel-${index}`;
      const triggerId = `${accordionId}-trigger-${index}`;
      const emptyClass = item.isEmpty ? ' accordion-item-empty' : '';

      return `
      <div class="accordion-item${emptyClass}" data-index="${index}">
        <button
          class="accordion-trigger"
          id="${triggerId}"
          type="button"
          aria-expanded="false"
          aria-controls="${panelId}"
        >
          <span class="accordion-title"></span>
          <span class="accordion-icon" aria-hidden="true"></span>
        </button>
        <div
          class="accordion-content"
          id="${panelId}"
          role="region"
          aria-labelledby="${triggerId}"
          hidden
        >
          <div class="accordion-content-inner"></div>
        </div>
      </div>
    `;
    })
    .join('');

  return headingHTML + itemsHTML;
}

// =============================================================================
// Event Handlers
// =============================================================================

/**
 * Toggle accordion panel open/closed state with smooth animation
 * @param {HTMLElement} trigger - The trigger button element
 * @param {HTMLElement} content - The content panel element
 */
function togglePanel(trigger, content) {
  const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
  const item = trigger.closest('.accordion-item');

  if (isExpanded) {
    // Closing: animate height to 0
    const contentHeight = content.scrollHeight;
    content.style.maxHeight = `${contentHeight}px`;

    // Force reflow to ensure the initial state is applied
    content.offsetHeight; // eslint-disable-line no-unused-expressions

    // Start closing animation
    content.style.maxHeight = '0';
    content.classList.remove('open');
    content.classList.add('closing');

    trigger.setAttribute('aria-expanded', 'false');
    item?.classList.remove('expanded');

    // After animation completes, set hidden
    content.addEventListener(
      'transitionend',
      function onClose() {
        content.removeEventListener('transitionend', onClose);
        content.classList.remove('closing');
        if (trigger.getAttribute('aria-expanded') === 'false') {
          content.setAttribute('hidden', '');
          content.style.maxHeight = '';
        }
      },
      { once: true },
    );
  } else {
    // Opening: animate height from 0 to auto
    content.removeAttribute('hidden');
    content.classList.add('open');

    // Get the natural height of the content
    const contentHeight = content.scrollHeight;
    content.style.maxHeight = '0';

    // Force reflow
    content.offsetHeight; // eslint-disable-line no-unused-expressions

    // Start opening animation
    content.style.maxHeight = `${contentHeight}px`;

    trigger.setAttribute('aria-expanded', 'true');
    item?.classList.add('expanded');

    // After animation completes, remove max-height for dynamic content
    content.addEventListener(
      'transitionend',
      function onOpen() {
        content.removeEventListener('transitionend', onOpen);
        if (trigger.getAttribute('aria-expanded') === 'true') {
          content.style.maxHeight = 'none';
        }
      },
      { once: true },
    );
  }
}

/**
 * Handle keyboard navigation within accordion
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLElement[]} triggers - Array of all trigger button elements
 */
function handleKeydown(event, triggers) {
  const currentIndex = triggers.indexOf(event.target);
  let newIndex;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      newIndex = (currentIndex + 1) % triggers.length;
      triggers[newIndex].focus();
      break;

    case 'ArrowUp':
      event.preventDefault();
      newIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      triggers[newIndex].focus();
      break;

    case 'Home':
      event.preventDefault();
      triggers[0].focus();
      break;

    case 'End':
      event.preventDefault();
      triggers[triggers.length - 1].focus();
      break;

    case 'Enter':
    case ' ':
      event.preventDefault();
      event.target.click();
      break;

    default:
      break;
  }
}

// =============================================================================
// Event Binding
// =============================================================================

/**
 * Bind all event listeners to accordion elements
 * @param {HTMLElement} block - The accordion block
 */
function bindEvents(block) {
  const triggers = [...block.querySelectorAll('.accordion-trigger')];

  triggers.forEach((trigger) => {
    const content = trigger.nextElementSibling;

    // Click to toggle
    trigger.addEventListener('click', () => {
      togglePanel(trigger, content);
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', (event) => {
      handleKeydown(event, triggers);
    });
  });
}

// =============================================================================
// Universal Editor Support
// =============================================================================

/**
 * Move author-added direct children of .accordion-item into .accordion-content-inner
 * so UE-inserted blocks (e.g. Card) render inside the panel content.
 * @param {HTMLElement} block - The accordion block
 */
function nestAuthorAddedBlocks(block) {
  const items = block.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const contentInner = item.querySelector('.accordion-content-inner');
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!contentInner || !trigger || !content) return;

    const toMove = [...item.children].filter((c) => c !== trigger && c !== content);
    toMove.forEach((c) => contentInner.appendChild(c));
  });
}

/**
 * Set container instrumentation on each .accordion-item when in UE authoring mode.
 * @param {NodeListOf<Element>|Element[]} items - .accordion-item elements
 */
function setContainerOnAccordionItems(items) {
  items.forEach((renderedItem) => {
    const resource = renderedItem.getAttribute('data-aue-resource') || '';
    renderedItem.setAttribute('data-aue-type', 'container');
    renderedItem.setAttribute('data-aue-filter', 'accordion-item');
    if (resource) renderedItem.setAttribute('data-aue-resource', resource);
  });
}

/**
 * Expand all accordion panels when in UE authoring mode.
 * @param {HTMLElement} block - The accordion block
 */
function expandAllPanelsInAuthoring(block) {
  const adobeUeEdit = document.documentElement.classList.contains('adobe-ue-edit');
  if (!adobeUeEdit) return;

  const accordionItems = block.querySelectorAll('.accordion-item');
  accordionItems.forEach((item) => {
    const content = item.querySelector('.accordion-content');
    const trigger = item.querySelector('.accordion-trigger');
    if (content && trigger) {
      content.removeAttribute('hidden');
      content.classList.add('open');
      content.style.maxHeight = 'none';
      trigger.setAttribute('aria-expanded', 'true');
      item.classList.add('expanded');
    }
  });
}

// =============================================================================
// Main Decorate Function
// =============================================================================

/**
 * Decorate accordion block.
 * Follows EDS pattern: extractData → renderHTML → bindEvents.
 * Preserves Universal Editor instrumentation for authoring mode.
 * Supports light (default) and dark mode via 'dark' class (auto-applied by EDS).
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  // Check if already decorated (avoid re-decoration)
  const isAccordionStructure = block.querySelector('.accordion-item') !== null;

  if (isAccordionStructure) {
    const items = block.querySelectorAll('.accordion-item');
    setContainerOnAccordionItems(items);
    bindEvents(block);
    expandAllPanelsInAuthoring(block);
    nestAuthorAddedBlocks(block);
    block.setAttribute('role', 'presentation');
    await enhanceFileLinks(block);
    return;
  }

  const accordionId = generateId();

  // 1. Extract data from DOM structure
  const data = extractData(block);

  // Keep reference to authored rows so we can preserve UE instrumentation
  const authoredRows = data.items.map((item) => item.row);

  // 2. Render HTML using template
  block.innerHTML = renderHTML(data, accordionId);

  // 3. Move Universal Editor instrumentation + authored content into the new DOM
  const renderedItems = [...block.querySelectorAll('.accordion-item')];
  renderedItems.forEach((renderedItem, index) => {
    const authoredRow = authoredRows[index];
    if (!authoredRow) {
      return;
    }

    // Move UE component instrumentation from the original row onto the new item
    moveInstrumentation(authoredRow, renderedItem);

    const [titleDiv, contentDiv] = authoredRow.children || [];

    const titleTarget = renderedItem.querySelector('.accordion-title');
    const contentTarget = renderedItem.querySelector('.accordion-content-inner');

    // Preserve authored title markup (including data-aue-prop)
    if (titleDiv && titleTarget) {
      titleTarget.replaceChildren(...titleDiv.childNodes);
      moveInstrumentation(titleDiv, titleTarget);
    }

    // Preserve authored content markup (including richtext + any nested authoring hooks)
    if (contentDiv && contentTarget) {
      contentTarget.replaceChildren(...contentDiv.childNodes);
      moveInstrumentation(contentDiv, contentTarget);
    }
  });

  setContainerOnAccordionItems(renderedItems);

  // 4. Bind event listeners
  bindEvents(block);

  expandAllPanelsInAuthoring(block);

  nestAuthorAddedBlocks(block);

  // 5. Set role on container
  block.setAttribute('role', 'presentation');

  // 6. Enhance file links
  await enhanceFileLinks(block);
}
