/**
 * Accordion Block
 *
 * FAQ-style collapsible items with:
 * - Multi-expand (multiple panels open simultaneously)
 * - Chevron icon that rotates on expand
 * - Full keyboard navigation (Tab, Enter, Space, Arrow, Home, End)
 * - ARIA disclosure button pattern
 * - Light (default) and Dark mode via 'dark' class
 * - Universal Editor instrumentation support
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
 * Extract one accordion item from a DOM row.
 * Row structure: col 0 = question text, col 1 = answer richtext
 *
 * @param {HTMLElement} row
 * @returns {{title: string, content: string, isEmpty: boolean, row: HTMLElement}|null}
 */
function extractItemFromRow(row) {
  const cells = [...row.children];
  if (cells.length < 2) return null;

  const title = getCellText(cells[0]) || '';
  const content = getCellHTML(cells[1]) || '';
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  const isEmpty = !title.trim() && !textContent;

  return {
    title,
    content,
    isEmpty,
    row,
  };
}

/**
 * Extract all data from the accordion block.
 * Row 0 = optional block title; rows 1+ = accordion items.
 * Note: the 'classes' select field is applied to block.classList automatically by EDS.
 *
 * @param {HTMLElement} block
 * @returns {{title: string, items: Array}}
 */
function extractData(block) {
  const rows = [...block.children];

  return {
    title: getCellText(getFirstCell(rows[0])) || '',
    items: rows.slice(1).map(extractItemFromRow).filter(Boolean),
  };
}

// =============================================================================
// Render
// =============================================================================

/**
 * Build accordion HTML from extracted data.
 *
 * @param {{title: string, items: Array}} data
 * @param {string} accordionId
 * @returns {string}
 */
function renderHTML(data, accordionId) {
  const { title, items } = data;

  const headingHTML = title
    ? renderBlockHeader({ heading: title, headingLevel: 'h2' })
    : '';

  const itemsHTML = items
    .map((item, index) => {
      const panelId = `${accordionId}-panel-${index}`;
      const triggerId = `${accordionId}-trigger-${index}`;
      const emptyClass = item.isEmpty ? ' accordion-item--empty' : '';

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
          <i class="gel-icon gel-icon-chevron-down accordion-icon" aria-hidden="true"></i>
        </button>
        <div
          class="accordion-content"
          id="${panelId}"
          hidden
        >
          <div class="accordion-content-inner"></div>
        </div>
      </div>`;
    })
    .join('');

  return headingHTML + itemsHTML;
}

// =============================================================================
// Toggle / Animation
// =============================================================================

/**
 * Toggle an accordion panel open or closed with a max-height animation.
 *
 * @param {HTMLElement} trigger
 * @param {HTMLElement} content
 */
function togglePanel(trigger, content) {
  const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
  const item = trigger.closest('.accordion-item');

  if (isExpanded) {
    const contentHeight = content.scrollHeight;
    content.style.maxHeight = `${contentHeight}px`;
    // Force reflow
    content.offsetHeight; // eslint-disable-line no-unused-expressions
    content.style.maxHeight = '0';
    content.classList.remove('open');
    content.classList.add('closing');
    trigger.setAttribute('aria-expanded', 'false');
    item?.classList.remove('expanded');

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
    content.removeAttribute('hidden');
    content.classList.add('open');
    const contentHeight = content.scrollHeight;
    content.style.maxHeight = '0';
    // Force reflow
    content.offsetHeight; // eslint-disable-line no-unused-expressions
    content.style.maxHeight = `${contentHeight}px`;
    trigger.setAttribute('aria-expanded', 'true');
    item?.classList.add('expanded');

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

// =============================================================================
// Keyboard Navigation
// =============================================================================

/**
 * Handle keyboard navigation within the accordion trigger list.
 *
 * @param {KeyboardEvent} event
 * @param {HTMLElement[]} triggers
 */
function handleKeydown(event, triggers) {
  const currentIndex = triggers.indexOf(event.target);

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      triggers[(currentIndex + 1) % triggers.length].focus();
      break;
    case 'ArrowUp':
      event.preventDefault();
      triggers[(currentIndex - 1 + triggers.length) % triggers.length].focus();
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
 * Attach click and keydown listeners to all accordion triggers.
 *
 * @param {HTMLElement} block
 */
function bindEvents(block) {
  const triggers = [...block.querySelectorAll('.accordion-trigger')];

  triggers.forEach((trigger) => {
    const content = trigger.nextElementSibling;

    trigger.addEventListener('click', () => {
      togglePanel(trigger, content);
    });

    trigger.addEventListener('keydown', (event) => {
      handleKeydown(event, triggers);
    });
  });
}

// =============================================================================
// Universal Editor Support
// =============================================================================

/**
 * Move any UE-injected child elements into the content-inner div.
 *
 * @param {HTMLElement} block
 */
function nestAuthorAddedBlocks(block) {
  block.querySelectorAll('.accordion-item').forEach((item) => {
    const contentInner = item.querySelector('.accordion-content-inner');
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!contentInner || !trigger || !content) return;

    [...item.children]
      .filter((c) => c !== trigger && c !== content)
      .forEach((c) => contentInner.appendChild(c));
  });
}

/**
 * Mark each .accordion-item as a UE container.
 *
 * @param {Element[]|NodeListOf<Element>} items
 */
function setContainerOnAccordionItems(items) {
  items.forEach((item) => {
    item.setAttribute('data-aue-type', 'container');
    item.setAttribute('data-aue-filter', 'accordion-item');
  });
}

/**
 * Expand all panels when the block is rendered inside Universal Editor.
 *
 * @param {HTMLElement} block
 */
function expandAllPanelsInAuthoring(block) {
  if (!document.documentElement.classList.contains('adobe-ue-edit')) return;

  block.querySelectorAll('.accordion-item').forEach((item) => {
    const content = item.querySelector('.accordion-content');
    const trigger = item.querySelector('.accordion-trigger');
    if (!content || !trigger) return;
    content.removeAttribute('hidden');
    content.classList.add('open');
    content.style.maxHeight = 'none';
    trigger.setAttribute('aria-expanded', 'true');
    item.classList.add('expanded');
  });
}

// =============================================================================
// Main Decorate
// =============================================================================

/**
 * Decorate the accordion block.
 * Follows the EDS pattern: extractData → renderHTML → bindEvents.
 *
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  // Guard: already decorated (UE re-entry)
  if (block.querySelector('.accordion-item')) {
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

  // 1. Extract
  const data = extractData(block);
  const authoredRows = data.items.map((item) => item.row);

  // 2. Render
  block.innerHTML = renderHTML(data, accordionId);

  // 3. Move UE instrumentation + authored content into new DOM
  const renderedItems = [...block.querySelectorAll('.accordion-item')];
  renderedItems.forEach((renderedItem, index) => {
    const authoredRow = authoredRows[index];
    if (!authoredRow) return;

    moveInstrumentation(authoredRow, renderedItem);

    const [titleDiv, contentDiv] = authoredRow.children || [];
    const titleTarget = renderedItem.querySelector('.accordion-title');
    const contentTarget = renderedItem.querySelector('.accordion-content-inner');

    if (titleDiv && titleTarget) {
      titleTarget.replaceChildren(...titleDiv.childNodes);
      moveInstrumentation(titleDiv, titleTarget);
    }

    if (contentDiv && contentTarget) {
      contentTarget.replaceChildren(...contentDiv.childNodes);
      moveInstrumentation(contentDiv, contentTarget);
    }
  });

  setContainerOnAccordionItems(renderedItems);

  // 4. Bind events
  bindEvents(block);

  expandAllPanelsInAuthoring(block);
  nestAuthorAddedBlocks(block);

  block.setAttribute('role', 'presentation');

  await enhanceFileLinks(block);
}
