/**
 * Collapsible Block Component
 *
 * Implements GEL-compliant collapsible with:
 * - Single expandable/collapsible content section
 * - Animated chevron icon
 * - Optional default-open state
 * - Full keyboard navigation (Enter, Space)
 * - ARIA accessibility attributes
 * - Smooth animations
 * - Light mode (default) and Dark mode support
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  getCellText,
  getCellHTML,
  getFirstCell,
  parseBool,
} from '../../scripts/utility/shared.js';
import enhanceFileLinks from '../../scripts/link-enhancer.js';

// =============================================================================
// ID Generation
// =============================================================================

let collapsibleIdCounter = 0;
function generateId(prefix = 'collapsible') {
  collapsibleIdCounter += 1;
  return `${prefix}-${collapsibleIdCounter}`;
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract collapsible block data from DOM structure.
 * Based on _collapsible.json model:
 *   - Row 0: heading (required, plain text, max 80 chars)
 *   - Row 1: defaultOpen (checkbox, optional)
 *   - Row 2: content (richtext, optional)
 *
 * @param {HTMLElement} block - The block element
 * @returns {{heading: string, defaultOpen: boolean, content: string,
 *   contentRow: HTMLElement|null}} Extracted block data
 */
function extractData(block) {
  console.log('extractData: Starting extraction', block);
  const rows = [...block.children];
  console.log('extractData: Total rows', rows.length);

  const data = {
    heading: getCellText(getFirstCell(rows[0])) || '',
    defaultOpen: parseBool(getCellText(getFirstCell(rows[1]))),
    content: rows[2] ? getCellHTML(getFirstCell(rows[2])) || '' : '',
    contentRow: rows[2] || null,
  };

  console.log('extractData: Extracted data', data);
  return data;
}

// =============================================================================
// Render
// =============================================================================

/**
 * Render collapsible HTML.
 *
 * @param {Object} data - Extracted collapsible data
 * @param {string} collapsibleId - Unique collapsible ID
 * @returns {string} HTML string
 */
function renderHTML(data, collapsibleId) {
  const { defaultOpen } = data;

  const contentId = `${collapsibleId}-content`;
  const triggerId = `${collapsibleId}-trigger`;
  const expanded = defaultOpen ? 'true' : 'false';
  const hiddenAttr = defaultOpen ? '' : ' hidden';

  return `
    <button
      class="collapsible-trigger"
      id="${triggerId}"
      type="button"
      aria-expanded="${expanded}"
      aria-controls="${contentId}"
    >
      <span class="collapsible-heading"></span>
      <svg class="collapsible-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div
      class="collapsible-content"
      id="${contentId}"
      role="region"
      aria-labelledby="${triggerId}"${hiddenAttr}
    >
      <div class="collapsible-content-inner"></div>
    </div>
  `;
}

// =============================================================================
// Event Handlers
// =============================================================================

/**
 * Toggle collapsible content open/closed state with smooth animation
 * @param {HTMLElement} trigger - The trigger button element
 * @param {HTMLElement} content - The content panel element
 */
function toggleContent(trigger, content) {
  const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
  const block = trigger.closest('.collapsible');

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
    block?.classList.remove('expanded');

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
    block?.classList.add('expanded');

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

// =============================================================================
// Event Binding
// =============================================================================

/**
 * Bind all event listeners to collapsible elements
 * @param {HTMLElement} block - The collapsible block
 */
function bindEvents(block) {
  const trigger = block.querySelector('.collapsible-trigger');
  const content = block.querySelector('.collapsible-content');

  if (!trigger || !content) return;

  // Click to toggle
  trigger.addEventListener('click', () => {
    toggleContent(trigger, content);
  });

  // Keyboard support (Enter and Space are handled natively by button element)
}

// =============================================================================
// Universal Editor Support
// =============================================================================

/**
 * Move author-added direct children of .collapsible into .collapsible-content-inner
 * so UE-inserted blocks (e.g. Text, Image, Table) render inside the content area.
 * @param {HTMLElement} block - The collapsible block
 */
function nestAuthorAddedBlocks(block) {
  const contentInner = block.querySelector('.collapsible-content-inner');
  const trigger = block.querySelector('.collapsible-trigger');
  const content = block.querySelector('.collapsible-content');
  if (!contentInner || !trigger || !content) return;

  const toMove = [...block.children].filter((c) => c !== trigger && c !== content);
  toMove.forEach((c) => contentInner.appendChild(c));
}

/**
 * Set richtext instrumentation on .collapsible-content-inner when in UE authoring mode.
 * @param {HTMLElement} block - The collapsible block
 */
function setContentInnerInstrumentation(block) {
  console.log('setContentInnerInstrumentation: Starting', block);
  const contentInner = block.querySelector('.collapsible-content-inner');
  if (!contentInner) {
    console.log('setContentInnerInstrumentation: No .collapsible-content-inner found');
    return;
  }

  // Check if this is in UE authoring mode
  const isAuthoring = document.documentElement.classList.contains('adobe-ue-edit');
  console.log('setContentInnerInstrumentation: Is authoring mode?', isAuthoring);
  console.log('setContentInnerInstrumentation: contentInner current HTML', contentInner.innerHTML);

  // Set UE instrumentation attributes
  contentInner.setAttribute('data-aue-prop', 'content');
  contentInner.setAttribute('data-aue-type', 'richtext');
  console.log('setContentInnerInstrumentation: Attributes set on contentInner');
}

/**
 * Expand collapsible content when in UE authoring mode.
 * @param {HTMLElement} block - The collapsible block
 */
function expandContentInAuthoring(block) {
  const adobeUeEdit = document.documentElement.classList.contains('adobe-ue-edit');
  if (!adobeUeEdit) return;

  const content = block.querySelector('.collapsible-content');
  const trigger = block.querySelector('.collapsible-trigger');
  if (content && trigger) {
    content.removeAttribute('hidden');
    content.classList.add('open');
    content.style.maxHeight = 'none';
    trigger.setAttribute('aria-expanded', 'true');
    block.classList.add('expanded');
  }
}

// =============================================================================
// Main Decorate Function
// =============================================================================

/**
 * Decorate collapsible block.
 * Follows EDS pattern: extractData → renderHTML → bindEvents.
 * Preserves Universal Editor instrumentation for authoring mode.
 * Supports light (default) and dark mode via 'dark' class (auto-applied by EDS).
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  console.log('decorate: Starting decoration', block);
  console.log('decorate: Block innerHTML', block.innerHTML);

  // Check if already decorated (avoid re-decoration)
  const isCollapsibleStructure = block.querySelector('.collapsible-trigger') !== null;
  console.log('decorate: Is already decorated?', isCollapsibleStructure);

  if (isCollapsibleStructure) {
    console.log('decorate: Block already decorated, applying UE support');
    setContentInnerInstrumentation(block);
    bindEvents(block);
    expandContentInAuthoring(block);
    nestAuthorAddedBlocks(block);
    block.setAttribute('role', 'presentation');
    await enhanceFileLinks(block);
    console.log('decorate: Finished re-decoration');
    return;
  }

  const collapsibleId = generateId();

  // 1. Extract data from DOM structure
  const data = extractData(block);

  // Keep reference to authored rows so we can preserve UE instrumentation
  const [headingRow, defaultOpenRow, contentRow] = [...block.children];
  console.log('decorate: Heading row', headingRow);
  console.log('decorate: Default open row', defaultOpenRow);
  console.log('decorate: Content row', contentRow);
  console.log('decorate: Extracted data', data);

  // 2. Render HTML using template
  block.innerHTML = renderHTML(data, collapsibleId);

  // 3. Move Universal Editor instrumentation + authored content into the new DOM
  const headingTarget = block.querySelector('.collapsible-heading');
  const contentTarget = block.querySelector('.collapsible-content-inner');
  console.log('decorate: Content target element', contentTarget);

  // Preserve authored heading markup (including data-aue-prop)
  if (headingRow && headingTarget) {
    const headingCell = getFirstCell(headingRow);
    if (headingCell) {
      headingTarget.innerHTML = headingCell.childNodes[0].innerHTML;
      moveInstrumentation(headingCell.childNodes[0], headingTarget);
    }
  }

  // Preserve authored content richtext markup (including data-aue-prop)
  if (contentRow && contentTarget) {
    const contentCell = getFirstCell(contentRow);
    console.log('decorate: Content cell', contentCell);
    console.log('decorate: Content cell innerHTML', contentCell ? contentCell.innerHTML : 'null');
    if (contentCell) {
      contentTarget.replaceChildren(...contentCell.childNodes);
      console.log('decorate: After replaceChildren, contentTarget.innerHTML', contentTarget.innerHTML);
      moveInstrumentation(contentCell, contentTarget);
      console.log('decorate: After moveInstrumentation, contentTarget.innerHTML', contentTarget.innerHTML);
    }
  }

  setContentInnerInstrumentation(block);

  // 4. Apply default open state if specified
  if (data.defaultOpen) {
    const content = block.querySelector('.collapsible-content');
    if (content) {
      content.classList.add('open');
      content.style.maxHeight = 'none';
      block.classList.add('expanded');
    }
  }

  // 5. Bind event listeners
  bindEvents(block);

  expandContentInAuthoring(block);

  nestAuthorAddedBlocks(block);

  // 6. Set role on container
  block.setAttribute('role', 'presentation');

  // 7. Enhance file links
  await enhanceFileLinks(block);

  console.log('decorate: Finished initial decoration');
  console.log('decorate: Final block innerHTML', block.innerHTML);
}
