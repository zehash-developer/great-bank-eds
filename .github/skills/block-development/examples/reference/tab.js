/**
 * Tab Block Component
 *
 * Implements GEL-compliant tabs with:
 * - Horizontal tab buttons (2-6 tabs for without-icons, 2-4 tabs for with-icons)
 * - Scrollable list on smaller viewports
 * - Optional icons on the left of labels
 * - Full keyboard navigation (Arrow keys, Home, End)
 * - ARIA accessibility attributes
 * - Light mode (default) and Dark mode support
 * - 4px bottom border on selected tab
 * - Tab content that can contain other blocks
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/aem.js';
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

let tabIdCounter = 0;
function generateId(prefix = 'tab') {
  console.log('generateId() called', { line: 31, prefix });
  tabIdCounter += 1;
  const id = `${prefix}-${tabIdCounter}`;
  console.log('Generated ID:', { line: 34, id });
  return id;
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract tab item data from a DOM row.
 * Based on _tab.json model: label(0) | icon(1) | content(2)
 *
 * @param {HTMLElement} row - The row element
 * @returns {Object|null} Extracted item data or null if invalid
 */
function extractItemFromRow(row) {
  console.log('extractItemFromRow() called', { line: 45 });
  const cells = [...row.children];

  if (cells.length < 1) {
    console.log('Row has insufficient cells', { line: 49 });
    return null;
  }

  const label = getCellText(cells[0]) || '';
  const icon = getCellText(cells[1]) || null;
  const contentHTML = getCellHTML(cells[2]) || '';

  console.log('Extracted item:', {
    line: 57, label, icon, hasContent: !!contentHTML,
  });

  return {
    label: label || 'Tab',
    icon: icon && icon.trim() !== '' ? icon.trim() : null,
    contentHTML,
    row,
    cells,
  };
}

/**
 * Extract tab data from DOM structure.
 * Based on _tab.json model:
 * - Row 0: heading (block-level)
 * - Row 1: type (block-level)
 * - Row 2: classes (block-level, auto-applied by EDS)
 * - Remaining rows: tab items (label | icon | content)
 *
 * @param {HTMLElement} block - The block element
 * @returns {{heading: string, hideHeading: boolean, type: string, tabs: Array}}
 */
function extractData(block) {
  console.log('extractData() called', { line: 84 });

  const rows = [...block.children];
  console.log('Total rows:', { line: 87, count: rows.length });

  const heading = getCellText(getFirstCell(rows[0])) || '';
  const type = getCellText(getFirstCell(rows[1])) || '';

  console.log('Block-level fields:', { line: 92, heading, type });

  const tabs = rows
    .slice(3)
    .map(extractItemFromRow)
    .filter(Boolean);

  console.log('Total tabs extracted:', { line: 99, count: tabs.length });

  // Validate tab count based on type
  const hasIcons = type === 'white-with-icons' || type === 'grey-with-icons';
  const maxTabs = hasIcons ? 4 : 6;

  if (tabs.length > maxTabs) {
    console.warn(
      `Tab count exceeds maximum for type "${type}":`,
      {
        line: 106, count: tabs.length, maxTabs, type,
      },
    );
    console.warn(
      `Only the first ${maxTabs} tabs will be displayed.`,
      { line: 110 },
    );
  }

  return {
    heading,
    hideHeading: block.classList.contains('hide-heading'),
    type,
    tabs: tabs.slice(0, maxTabs), // Limit to max allowed
  };
}

// =============================================================================
// Render HTML
// =============================================================================

/**
 * Render accordion-style HTML for mobile (below MD breakpoint)
 * @param {Array} tabs - Tab data from extractData()
 * @param {string} tabId - Unique tab ID
 * @param {boolean} hideIcons - Whether to exclude icon elements from rendering
 * @returns {string} HTML string
 */
function renderAccordionHTML(tabs, tabId, hideIcons = false) {
  console.log('renderAccordionHTML() called', {
    line: 131, tabId, tabCount: tabs.length, hideIcons,
  });

  const accordionItemsHTML = tabs
    .map((tab, index) => {
      const isExpanded = index === 0;
      const triggerId = `${tabId}-accordion-trigger-${index}`;
      const panelId = `${tabId}-accordion-panel-${index}`;

      console.log('Rendering accordion item', {
        line: 145, index, label: tab.label, isExpanded,
      });

      return `
        <div class="tab-accordion-item" data-index="${index}">
          <button
            class="tab-accordion-trigger"
            id="${triggerId}"
            type="button"
            aria-expanded="${isExpanded}"
            aria-controls="${panelId}"
          >
            <span class="tab-accordion-label"></span>
            <span class="tab-accordion-icon" aria-hidden="true"></span>
          </button>
          <div
            class="tab-accordion-content${isExpanded ? ' open' : ''}"
            id="${panelId}"
            role="region"
            aria-labelledby="${triggerId}"
            ${!isExpanded ? 'hidden' : ''}
          >
            <div class="tab-accordion-content-inner"></div>
          </div>
        </div>
      `;
    })
    .join('');

  console.log('Accordion HTML rendered', { line: 176 });
  return accordionItemsHTML;
}

/**
 * Render tab HTML structure
 * @param {Object} data - Data from extractData()
 * @param {string} data.heading - Block heading
 * @param {boolean} data.hideHeading - Whether to visually hide the heading
 * @param {Array} data.tabs - Tab data
 * @param {string} tabId - Unique tab ID
 * @param {boolean} hideIcons - Whether to exclude icon elements from rendering
 * @returns {string} HTML string
 */
function renderTabHTML(data, tabId, hideIcons = false) {
  console.log('renderTabHTML() called', {
    line: 135, tabId, tabCount: data.tabs.length, hideIcons,
  });

  const { heading, hideHeading, tabs } = data;

  const headingHTML = heading
    ? renderBlockHeader({
      heading,
      hideHeading,
      headingLevel: 'h2',
    })
    : '';

  const tabButtonsHTML = tabs
    .map((tab, index) => {
      const isSelected = index === 0;
      const triggerId = `${tabId}-trigger-${index}`;
      const panelId = `${tabId}-panel-${index}`;
      const iconClass = (!hideIcons && tab.icon) ? ' tab-button-with-icon' : '';

      console.log('Rendering tab button', {
        line: 148, index, label: tab.label, icon: tab.icon,
      });

      return `
        <button
          class="tab-button${iconClass}"
          id="${triggerId}"
          type="button"
          role="tab"
          aria-selected="${isSelected}"
          aria-controls="${panelId}"
          tabindex="${isSelected ? '0' : '-1'}"
          data-index="${index}"
        >
          <span class="tab-label"></span>
        </button>
      `;
    })
    .join('');

  const tabPanelsHTML = tabs
    .map((tab, index) => {
      const isSelected = index === 0;
      const panelId = `${tabId}-panel-${index}`;
      const triggerId = `${tabId}-trigger-${index}`;

      console.log('Rendering tab panel', { line: 176, index, isSelected });

      return `
        <div
          class="tab-panel"
          id="${panelId}"
          role="tabpanel"
          aria-labelledby="${triggerId}"
          ${!isSelected ? 'hidden' : ''}
          data-index="${index}"
        >
          <div class="tab-panel-content"></div>
        </div>
      `;
    })
    .join('');

  const html = `
    ${headingHTML}
    <div class="tab-list-container">
      <div class="tab-list" role="tablist">
        ${tabButtonsHTML}
      </div>
    </div>
    <div class="tab-panels">
      ${tabPanelsHTML}
    </div>
    <div class="tab-accordion-list">
      ${renderAccordionHTML(tabs, tabId, hideIcons)}
    </div>
  `;

  console.log('Tab HTML rendered', { line: 210 });
  return html;
}

// =============================================================================
// Event Handlers
// =============================================================================

/**
 * Switch to a specific tab
 * @param {HTMLElement} block - The block element
 * @param {number} targetIndex - Index of the tab to activate
 */
function switchToTab(block, targetIndex) {
  console.log('switchToTab() called', { line: 218, targetIndex });

  const tabButtons = block.querySelectorAll('.tab-button');
  const tabPanels = block.querySelectorAll('.tab-panel');

  // Validate index
  if (targetIndex < 0 || targetIndex >= tabButtons.length) {
    console.log('Invalid tab index', { line: 225, targetIndex, max: tabButtons.length - 1 });
    return;
  }

  console.log('Switching tabs', { line: 229, from: block.querySelector('[aria-selected="true"]')?.dataset.index, to: targetIndex });

  // Update all tab buttons
  tabButtons.forEach((button, index) => {
    const isSelected = index === targetIndex;
    button.setAttribute('aria-selected', isSelected);
    button.setAttribute('tabindex', isSelected ? '0' : '-1');
    console.log('Updated tab button', { line: 236, index, isSelected });
  });

  // Update all tab panels
  tabPanels.forEach((panel, index) => {
    const isSelected = index === targetIndex;
    if (isSelected) {
      panel.removeAttribute('hidden');
      console.log('Showing panel', { line: 244, index });
    } else {
      panel.setAttribute('hidden', '');
      console.log('Hiding panel', { line: 247, index });
    }
  });

  // Focus the selected tab button
  tabButtons[targetIndex]?.focus();
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 * @param {HTMLElement} block - The block element
 */
function handleKeyboardNavigation(event, block) {
  console.log('handleKeyboardNavigation() called', { line: 260, key: event.key });

  const tabButtons = [...block.querySelectorAll('.tab-button')];
  const currentIndex = parseInt(event.target.dataset.index, 10);
  console.log('Current tab index:', { line: 264, currentIndex });

  let targetIndex = currentIndex;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      targetIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
      console.log('ArrowLeft pressed', { line: 272, targetIndex });
      break;

    case 'ArrowRight':
      event.preventDefault();
      targetIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
      console.log('ArrowRight pressed', { line: 277, targetIndex });
      break;

    case 'Home':
      event.preventDefault();
      targetIndex = 0;
      console.log('Home pressed', { line: 282, targetIndex });
      break;

    case 'End':
      event.preventDefault();
      targetIndex = tabButtons.length - 1;
      console.log('End pressed', { line: 287, targetIndex });
      break;

    default:
      return;
  }

  switchToTab(block, targetIndex);
}

// =============================================================================
// Event Binding
// =============================================================================

/**
 * Bind event listeners to tab buttons
 * @param {HTMLElement} block - The block element
 */
function bindTabEvents(block) {
  console.log('bindTabEvents() called', { line: 306, block });

  const tabButtons = block.querySelectorAll('.tab-button');
  console.log('Found tab buttons:', { line: 309, count: tabButtons.length });

  tabButtons.forEach((button, index) => {
    // Click event
    button.addEventListener('click', () => {
      console.log('Tab button clicked', { line: 314, index });
      switchToTab(block, index);
    });

    // Keyboard navigation
    button.addEventListener('keydown', (event) => {
      handleKeyboardNavigation(event, block);
    });
  });

  console.log('Tab events bound', { line: 382 });
}

// =============================================================================
// Accordion Event Handlers
// =============================================================================

/**
 * Toggle accordion panel open/closed
 * @param {HTMLElement} trigger - The accordion trigger button
 * @param {HTMLElement} content - The accordion content panel
 */
function toggleAccordionPanel(trigger, content) {
  console.log('toggleAccordionPanel() called', { line: 394 });

  const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

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

    // After animation completes, set hidden
    content.addEventListener('transitionend', function onClose() {
      content.removeEventListener('transitionend', onClose);
      content.classList.remove('closing');
      if (trigger.getAttribute('aria-expanded') === 'false') {
        content.setAttribute('hidden', '');
        content.style.maxHeight = '';
      }
      console.log('Accordion panel closed', { line: 423 });
    }, { once: true });
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

    // After animation completes, remove max-height for dynamic content
    content.addEventListener('transitionend', function onOpen() {
      content.removeEventListener('transitionend', onOpen);
      if (trigger.getAttribute('aria-expanded') === 'true') {
        content.style.maxHeight = 'none';
      }
      console.log('Accordion panel opened', { line: 450 });
    }, { once: true });
  }

  console.log('Accordion toggle complete', { line: 454, isExpanded: !isExpanded });
}

/**
 * Bind event listeners to accordion triggers
 * @param {HTMLElement} block - The block element
 */
function bindAccordionEvents(block) {
  console.log('bindAccordionEvents() called', { line: 454, block });

  const accordionTriggers = block.querySelectorAll('.tab-accordion-trigger');
  console.log('Found accordion triggers:', { line: 457, count: accordionTriggers.length });

  accordionTriggers.forEach((trigger, index) => {
    const content = block.querySelector(`#${trigger.getAttribute('aria-controls')}`);

    if (!content) {
      console.warn('Accordion content not found', { line: 462, index });
      return;
    }

    // Click event
    trigger.addEventListener('click', () => {
      console.log('Accordion trigger clicked', { line: 468, index });
      toggleAccordionPanel(trigger, content);
    });

    // Keyboard support (Enter/Space)
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        console.log('Accordion trigger activated via keyboard', { line: 476, key: event.key });
        toggleAccordionPanel(trigger, content);
      }
    });
  });

  console.log('Accordion events bound', { line: 482 });
}

// =============================================================================
// Content Population
// =============================================================================

/**
 * Populate tab panels and accordion panels with content and move UE instrumentation
 * @param {HTMLElement} block - The block element
 * @param {Array} tabs - Tab data
 * @param {boolean} hideIcons - Whether icons are hidden
 */
function populateTabContent(block, tabs, hideIcons = false) {
  console.log('populateTabContent() called', { line: 492, tabCount: tabs.length });

  const tabButtons = block.querySelectorAll('.tab-button');
  const tabPanels = block.querySelectorAll('.tab-panel-content');
  const accordionItems = block.querySelectorAll('.tab-accordion-item');

  tabs.forEach((tab, index) => {
    console.log('Populating content for tab', { line: 501, index });

    // Move instrumentation from row to button
    const button = tabButtons[index];
    if (button && tab.row) {
      moveInstrumentation(tab.row, button);
      console.log('Moved instrumentation from row to button', { line: 507, index });
    }

    // Populate button label from cell 0 (clone for button)
    const buttonLabel = button?.querySelector('.tab-label');
    if (buttonLabel && tab.cells[0]) {
      if (!hideIcons && tab.icon) {
        const iconHTML = `<i class="gel-icon ${tab.icon}" aria-hidden="true"></i>`;
        buttonLabel.insertAdjacentHTML('beforebegin', iconHTML);
      }
      buttonLabel.textContent = tab.label;
    }

    // Populate desktop tab panel content from cell 2 (clone for desktop)
    const panelContent = tabPanels[index];
    if (panelContent && tab.cells[2]) {
      const panelContentClone = tab.cells[2].cloneNode(true);
      panelContent.replaceChildren(...panelContentClone.childNodes);
      moveInstrumentation(tab.cells[2], panelContent);
      console.log('Populated tab panel content', { line: 528, index });
    }

    // Populate mobile accordion content
    const accordionItem = accordionItems[index];
    if (accordionItem) {
      const accordionLabel = accordionItem.querySelector('.tab-accordion-label');
      const accordionContent = accordionItem.querySelector('.tab-accordion-content-inner');

      // Populate accordion label from cell 0 (move original)
      if (accordionLabel && tab.cells[0]) {
        // Move the cell content into the label
        accordionLabel.textContent = tab.label;

        // Prepend icon inside the label if present and not hidden
        if (!hideIcons && tab.icon) {
          const iconHTML = `<i class="gel-icon ${tab.icon}" aria-hidden="true"></i>`;
          accordionLabel.insertAdjacentHTML('afterbegin', iconHTML);
        }
      }

      // Populate accordion content from cell 2 (move original)
      if (accordionContent && tab.cells[2]) {
        accordionContent.replaceChildren(...tab.cells[2].childNodes);
        moveInstrumentation(tab.cells[2], accordionContent);
        console.log('Populated accordion content', { line: 554, index });
      }
    }
  });

  console.log('All content populated', { line: 559 });
}

// =============================================================================
// Main Decorator
// =============================================================================

/**
 * Decorate the tab block
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  console.log('[tab.js:596] decorate() called');

  // Check if already decorated
  if (block.querySelector('.tab-list')) {
    console.log('[tab.js:600] Block already decorated, skipping');
    await enhanceFileLinks(block);
    return;
  }

  // Generate unique ID for this tab instance
  const tabId = generateId('tab');
  console.log('[tab.js:634] Tab ID generated:', tabId);

  // Extract tab data
  const data = extractData(block);
  console.log('Data extracted:', {
    line: 378, heading: data.heading, type: data.type, count: data.tabs.length,
  });

  // Apply type-based classes
  if (data.type.includes('grey')) {
    block.classList.add('grey');
    console.log('[tab.js:625] Added grey class to block');
  }

  const hideIcons = data.type === 'white-without-icons' || data.type === 'grey-without-icons';
  console.log('[tab.js:630] Hide icons:', hideIcons);

  // Validate: minimum 2 tabs
  if (data.tabs.length < 2) {
    console.warn('Tab block requires at least 2 tabs', { line: 382, count: data.tabs.length });
    block.innerHTML = '<p class="tab-error">Tab block requires at least 2 tabs.</p>';
    return;
  }

  // Validate: maximum 6 tabs
  if (data.tabs.length > 6) {
    console.warn('Tab block allows maximum 6 tabs', { line: 389, count: data.tabs.length });
    data.tabs.splice(6);
  }

  // Render tab structure
  const html = renderTabHTML(data, tabId, hideIcons);
  block.innerHTML = html;
  console.log('[tab.js:637] Tab HTML injected into block');

  // Populate content and move UE instrumentation
  populateTabContent(block, data.tabs, hideIcons);

  // Decorate icons if present
  await decorateIcons(block);
  console.log('[tab.js:644] Icons decorated');

  // Bind event listeners
  bindTabEvents(block);
  bindAccordionEvents(block);

  // Enhance file links
  await enhanceFileLinks(block);

  console.log('[tab.js:650] Tab block decoration complete', tabId);
}
