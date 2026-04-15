/**
 * Big Numbers Block Component
 *
 * Displays key statistics and rates with emphasis, supporting both tabbed
 * and non-tabbed variations. Combines the tab interaction pattern with card-like
 * content display.
 *
 * Features:
 * - Tabbed or single-item display modes
 * - Two-column rate layout with large numeric display (42px) and smaller text suffix (24px)
 * - Optional offer badges in tabs
 * - Rich content support (lists, links, superscripts for legal disclaimers)
 * - Card-style container with border and rounded corners
 * - Light and dark mode support
 * - Full keyboard navigation (Arrow keys, Home, End) for tabs
 * - ARIA accessibility attributes
 * - Horizontal scrollable tabs on smaller viewports with visual indicators
 *
 * Uses the standard EDS pattern: extractData → renderHTML → decorate
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/aem.js';
import {
  parseBool,
  getCellText,
  getCellHTML,
  debounce,
  removeFocusFromAriaHidden,
} from '../../scripts/utility/shared.js';
import enhanceFileLinks from '../../scripts/link-enhancer.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const ITEM_TYPE = {
  TAB: 'Tabs',
  NO_TAB: 'No Tabs',
};

// =============================================================================
// ID Generation
// =============================================================================

let bigNumbersIdCounter = 0;
function generateId(prefix = 'big-numbers') {
  bigNumbersIdCounter += 1;
  return `${prefix}-${bigNumbersIdCounter}`;
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract big-numbers item data from a DOM row.
 * Based on _big-numbers.json model:
 * - Cell 0: tab-label (text)
 * - Cell 1: show-offer-badge (boolean)
 * - Cell 2: subtitle (text)
 * - Cell 3: rate-top-label-1 (richtext)
 * - Cell 4: rate-1 (text) - %p.a. automatically appended if value exists
 * - Cell 5: rate-bottom-label-1 (richtext)
 * - Cell 6: rate-top-label-2 (richtext)
 * - Cell 7: rate-2 (text) - %p.a. automatically appended if value exists
 * - Cell 8: rate-bottom-label-2 (richtext)
 * - Cell 9: description (richtext)
 *
 * @param {HTMLElement} row - The row element
 * @returns {{tabLabel: string, showOfferBadge: boolean, subtitle: string,
 *   rateTopLabel1: string, rate1: string, rateText1: string, rateBottomLabel1: string,
 *   rateTopLabel2: string, rate2: string, rateText2: string,
 *   rateBottomLabel2: string, description: string, row: HTMLElement}|null}
 */
function extractItemFromRow(row) {
  console.log('extractItemFromRow', 'line 46');
  const cells = [...row.children];

  // Validate minimum required cells (at least 5 for basic item after field removal)
  if (cells.length < 5) {
    return null;
  }

  const tabLabel = getCellText(cells[0]) || '';
  const showOfferBadge = parseBool(getCellText(cells[1]), false);
  const subtitle = getCellText(cells[2]) || '';
  const rateTopLabel1 = getCellHTML(cells[3]) || '';
  const rate1 = getCellText(cells[4]) || '';
  const rateText1 = rate1 ? '%p.a.' : ''; // Automatically append %p.a. if rate exists
  const rateBottomLabel1 = getCellHTML(cells[5]) || '';
  const rateTopLabel2 = getCellHTML(cells[6]) || '';
  const rate2 = getCellText(cells[7]) || '';
  const rateText2 = rate2 ? '%p.a.' : ''; // Automatically append %p.a. if rate exists
  const rateBottomLabel2 = getCellHTML(cells[8]) || '';
  const description = getCellHTML(cells[9]) || '';

  const item = {
    tabLabel,
    showOfferBadge,
    subtitle,
    rateTopLabel1,
    rate1,
    rateText1,
    rateBottomLabel1,
    rateTopLabel2,
    rate2,
    rateText2,
    rateBottomLabel2,
    description,
    row, // Keep reference for moveInstrumentation
  };

  console.log('extractedItem', item);
  return item;
}

/**
 * Extract big-numbers block data from DOM structure.
 * Based on _big-numbers.json model:
 * - Row 0: type field
 * - Row 1: classes field (NOT extracted - EDS applies automatically)
 * - Remaining rows: big-numbers items
 *
 * Cell order must match _big-numbers.json model field order.
 *
 * @param {HTMLElement} block - The block element containing table structure
 * @returns {{type: string, items: Array}} Extracted block data with items array
 */
function extractData(block) {
  console.log('extractData', 'line 110');
  const rows = [...block.children];

  const data = {
    type: '',
    items: [],
  };

  // Extract items from remaining rows (starting at row 1)
  // Note: Row 1 contains the classes field which is already applied to block.classList by EDS
  data.items = rows
    .map(extractItemFromRow)
    .filter(Boolean);

  data.items.splice(5); // Limit to 5 items for performance and design constraints

  data.type = data.items.length > 1
    && data.items.filter((item) => item.tabLabel || item.showOfferBadge)?.length > 0
    ? ITEM_TYPE.TAB : ITEM_TYPE.NO_TAB;

  if (data.type === ITEM_TYPE.TAB) {
    data.items.sort((a, b) => {
      if (a.showOfferBadge === b.showOfferBadge) {
        return 0;
      }
      return a.showOfferBadge ? -1 : 1;
    });
  }
  console.log('extractedData', data);
  return data;
}

// =============================================================================
// Build Screen Reader Text
// =============================================================================

/**
 * Build complete rate text for screen readers (aria-label)
 * Combines top label, rate number, rate text, and bottom label into single announcement
 * @param {Object} rate - Rate data object
 * @returns {string} Complete rate text for screen readers
 */
function buildRateAriaLabel(rate) {
  const parts = [];

  // Strip HTML tags from labels for aria-label
  const stripHTML = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  if (rate.topLabel) {
    parts.push(stripHTML(rate.topLabel));
  }

  if (rate.number && rate.text) {
    parts.push(`${rate.number}${rate.text}`);
  } else if (rate.number) {
    parts.push(rate.number);
  }

  if (rate.bottomLabel) {
    parts.push(stripHTML(rate.bottomLabel));
  }

  return parts.join(' ');
}

// =============================================================================
// Render HTML
// =============================================================================

/**
 * Render a single rate field (used for top labels, rates, and bottom labels)
 * @param {Object} rate - Rate data
 * @param {string} ariaLabel - ARIA label for the rate group
 * @returns {Object} Object containing HTML for each field type
 */
function renderRateFields(rate, ariaLabel) {
  if (!rate.number && !rate.text && !rate.topLabel && !rate.bottomLabel) {
    return null;
  }

  return {
    topLabel: rate.topLabel || '',
    rateDisplay: rate.number || rate.text ? `
      <span class="big-numbers-rate-number">${rate.number || ''}</span>
      ${rate.text ? `<span class="big-numbers-rate-text">${rate.text}</span>` : ''}
    ` : '',
    bottomLabel: rate.bottomLabel || '',
    ariaLabel,
  };
}

/**
 * Render content panel (rates + description)
 * @param {Object} item - Item data
 * @returns {string} HTML string
 */
function renderContentPanel(item) {
  const hasRate1 = item.rate1 || item.rateText1
    || item.rateTopLabel1 || item.rateBottomLabel1;
  const hasRate2 = (item.rate2 || item.rateText2 || item.rateTopLabel2 || item.rateBottomLabel2);

  const rate1AriaLabel = buildRateAriaLabel({
    topLabel: item.rateTopLabel1,
    number: item.rate1,
    text: item.rateText1,
    bottomLabel: item.rateBottomLabel1,
  });

  const rate2AriaLabel = buildRateAriaLabel({
    topLabel: item.rateTopLabel2,
    number: item.rate2,
    text: item.rateText2,
    bottomLabel: item.rateBottomLabel2,
  });

  const rate1Fields = hasRate1 ? renderRateFields({
    topLabel: item.rateTopLabel1,
    number: item.rate1,
    text: item.rateText1,
    bottomLabel: item.rateBottomLabel1,
  }, rate1AriaLabel) : null;

  const rate2Fields = hasRate2 ? renderRateFields({
    topLabel: item.rateTopLabel2,
    number: item.rate2,
    text: item.rateText2,
    bottomLabel: item.rateBottomLabel2,
  }, rate2AriaLabel) : null;

  // Count actual rate columns for styling
  const rateCount = (hasRate1 ? 1 : 0) + (hasRate2 ? 1 : 0);
  const rateCountClass = rateCount === 1 ? ' big-numbers-rates-single' : '';

  return `
    <div class="big-numbers-content-panel">
      ${item.subtitle ? `<div class="big-numbers-subtitle">${item.subtitle}</div>` : ''}
      ${hasRate1 || hasRate2 ? `
        <div class="big-numbers-rates${rateCountClass}" data-rate-count="${rateCount}">
          ${rate1Fields || rate2Fields ? `
            <div class="big-numbers-rates-row big-numbers-rates-top-labels">
              ${rate1Fields ? `<div class="big-numbers-rate-top-label" aria-hidden="true">${rate1Fields.topLabel}</div>` : ''}
              ${rate2Fields ? `<div class="big-numbers-rate-top-label" aria-hidden="true">${rate2Fields.topLabel}</div>` : ''}
            </div>
            <div class="big-numbers-rates-row big-numbers-rates-displays">
              ${rate1Fields ? `<div class="big-numbers-rate-display" role="group" aria-label="${rate1Fields.ariaLabel}">${rate1Fields.rateDisplay}</div>` : ''}
              ${rate2Fields ? `<div class="big-numbers-rate-display" role="group" aria-label="${rate2Fields.ariaLabel}">${rate2Fields.rateDisplay}</div>` : ''}
            </div>
            <div class="big-numbers-rates-row big-numbers-rates-bottom-labels">
              ${rate1Fields ? `<div class="big-numbers-rate-bottom-label" aria-hidden="true">${rate1Fields.bottomLabel}</div>` : ''}
              ${rate2Fields ? `<div class="big-numbers-rate-bottom-label" aria-hidden="true">${rate2Fields.bottomLabel}</div>` : ''}
            </div>
          ` : ''}
        </div>
      ` : ''}
      ${item.description ? `<div class="big-numbers-description">${item.description}</div>` : ''}
    </div>
  `;
}

/**
 * Render tab HTML structure (for "Tabs" type)
 * @param {Array} items - Item data array
 * @param {string} bigNumbersId - Unique big-numbers ID
 * @returns {string} HTML string
 */
function renderTabsHTML(items, bigNumbersId) {
  const tabButtonsHTML = items
    .map((item, index) => {
      const isSelected = index === 0;
      const triggerId = `${bigNumbersId}-trigger-${index}`;
      const panelId = `${bigNumbersId}-panel-${index}`;
      const emptyClass = !item.tabLabel ? ' big-numbers-tab-button-empty' : '';

      const offerBadgeHTML = item.showOfferBadge
        ? '<i class="gel-icon gel-icon-star-rate gel-icon-xs" aria-hidden="true"></i>'
        : '';

      return `
        <button
          class="big-numbers-tab-button${emptyClass}"
          id="${triggerId}"
          type="button"
          role="tab"
          aria-selected="${isSelected}"
          aria-controls="${panelId}"
          tabindex="${isSelected ? '0' : '-1'}"
        >
          ${offerBadgeHTML}
          <span class="big-numbers-tab-label">${item.tabLabel || `Tab ${index + 1}`}</span>
        </button>
      `;
    })
    .join('');

  const tabPanelsHTML = items
    .map((item, index) => {
      const isSelected = index === 0;
      const panelId = `${bigNumbersId}-panel-${index}`;
      const triggerId = `${bigNumbersId}-trigger-${index}`;

      return `
        <div
          class="big-numbers-tab-panel"
          id="${panelId}"
          role="tabpanel"
          aria-labelledby="${triggerId}"
          tabindex="0"
          ${!isSelected ? 'hidden' : ''}
        >
          ${renderContentPanel(item)}
        </div>
      `;
    })
    .join('');

  return `
    <div class="big-numbers-tab-list-container">
      <div class="big-numbers-tab-list" role="tablist">
        ${tabButtonsHTML}
      </div>
      <div class="big-numbers-tab-scroll-indicator" aria-hidden="true">
        <i class="gel-icon gel-icon-arrow-right"></i>
      </div>
    </div>
    <div class="big-numbers-tab-panels">
      ${tabPanelsHTML}
    </div>
  `;
}

/**
 * Render "No Tabs" HTML structure (single item display)
 * @param {Array} items - Item data array (only first item used)
 * @returns {string} HTML string
 */
function renderNoTabsHTML(items) {
  if (items.length === 0) return '<div class="big-numbers-content-panel"></div>';
  return renderContentPanel(items[0]);
}

/**
 * Render big-numbers HTML structure
 * @param {Object} data - Data from extractData
 * @param {string} bigNumbersId - Unique big-numbers ID
 * @returns {string} HTML string
 */
function renderBigNumbersHTML(data, bigNumbersId) {
  console.log('renderBigNumbersHTML', 'line 345');
  const isTabs = data.type === ITEM_TYPE.TAB;
  if (isTabs) {
    return renderTabsHTML(data.items, bigNumbersId);
  }
  return renderNoTabsHTML(data.items);
}

// =============================================================================
// Tab Interaction Logic
// =============================================================================

/**
 * Setup keyboard navigation for tabs
 * @param {HTMLElement} block - The block element
 * @param {HTMLElement} tabList - The tab list container
 */
function setupTabKeyboardNavigation(block, tabList) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];

  if (tabs.length === 0) return;

  /**
   * Switch to a specific tab
   * @param {number} index - Tab index to switch to
   */
  function switchToTab(index) {
    tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', isSelected);
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');

      const panelId = tab.getAttribute('aria-controls');
      const panel = block.querySelector(`#${panelId}`);

      if (panel) {
        if (isSelected) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      }
    });

    tabs[index].focus();
  }

  // Keyboard event handler
  tabList.addEventListener('keydown', (e) => {
    const currentIndex = tabs.findIndex((tab) => tab === e.target);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        switchToTab(newIndex);
        // Scroll tab into view
        tabs[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        break;

      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        switchToTab(newIndex);
        // Scroll tab into view
        tabs[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        break;

      case 'Home':
        e.preventDefault();
        switchToTab(0);
        tabs[0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        break;

      case 'End':
        e.preventDefault();
        switchToTab(tabs.length - 1);
        tabs[tabs.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        switchToTab(currentIndex);
        break;

      default:
        break;
    }
  });

  // Click event handler
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => switchToTab(index));
  });
}

/**
 * Check if tab list overflows and toggle scroll indicator
 * @param {HTMLElement} block - The block element
 */
function updateTabScrollIndicator(block) {
  const container = block.querySelector('.big-numbers-tab-list-container');
  const tabList = block.querySelector('.big-numbers-tab-list');
  const indicator = block.querySelector('.big-numbers-tab-scroll-indicator');

  if (!container || !tabList || !indicator) return;

  const isOverflowing = tabList.scrollWidth > tabList.clientWidth;

  if (isOverflowing) {
    indicator.classList.add('visible');
    container.classList.add('has-scroll-indicator');

    // Also check if we're at the end
    const { scrollLeft } = container;
    const { scrollWidth } = container;
    const { clientWidth } = container;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; // 5px threshold

    if (isAtEnd) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  } else {
    indicator.classList.remove('visible');
    container.classList.remove('has-scroll-indicator');
    indicator.classList.remove('hidden');
  }
}

/**
 * Setup scroll indicator click handler to scroll tabs
 * @param {HTMLElement} block - The block element
 */
function setupTabScrollIndicator(block) {
  const indicator = block.querySelector('.big-numbers-tab-scroll-indicator');
  const tabListContainer = block.querySelector('.big-numbers-tab-list-container');
  const tabList = block.querySelector('.big-numbers-tab-list');

  if (!indicator || !tabListContainer || !tabList) return;

  indicator.addEventListener('click', () => {
    const firstTab = tabList.querySelector('[role="tab"]');
    if (!firstTab) return;
    const tabWidth = firstTab.offsetWidth;
    tabListContainer.scrollBy({ left: tabWidth, behavior: 'smooth' });
  });
}

/**
 * Setup mouse wheel horizontal scrolling for tabs
 * @param {HTMLElement} block - The block element
 */
function setupTabWheelScroll(block) {
  const tabListContainer = block.querySelector('.big-numbers-tab-list-container');
  if (!tabListContainer) return;

  tabListContainer.addEventListener('wheel', (e) => {
    // Only handle horizontal scroll if tabs are actually scrollable
    const isScrollable = tabListContainer.scrollWidth > tabListContainer.clientWidth;

    if (isScrollable) {
      e.preventDefault();
      const scrollAmount = e.deltaY;
      tabListContainer.scrollBy({ left: scrollAmount, behavior: 'auto' });
    }
  }, { passive: false });
}

/**
 * Setup scroll listener to hide indicator when scrolled to end
 * @param {HTMLElement} block - The block element
 */
function setupTabScrollListener(block) {
  const container = block.querySelector('.big-numbers-tab-list-container');
  const tabList = block.querySelector('.big-numbers-tab-list');
  const indicator = block.querySelector('.big-numbers-tab-scroll-indicator');

  if (!container || !tabList || !indicator) return;

  function updateIndicatorVisibility() {
    const { scrollLeft } = container;
    const { scrollWidth } = container;
    const { clientWidth } = container;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;

    if (isAtEnd) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  }

  // Listen to scroll events
  container.addEventListener('scroll', updateIndicatorVisibility);

  const debouncedUpdate = debounce(updateIndicatorVisibility, 150);
  const resizeObserver = new ResizeObserver(debouncedUpdate);
  resizeObserver.observe(tabList);
}

/**
 * Bind tab interactions (keyboard, scroll indicator, wheel, resize). Call when block
 * already has .big-numbers-block-container or after initial render.
 * @param {HTMLElement} block - The block element
 */
function bindTabInteractions(block) {
  const tabList = block.querySelector('.big-numbers-tab-list');
  if (!tabList) return;

  setupTabKeyboardNavigation(block, tabList);
  setupTabScrollIndicator(block);
  setupTabWheelScroll(block);
  setupTabScrollListener(block);
  updateTabScrollIndicator(block);
  const resizeObserver = new ResizeObserver(() => updateTabScrollIndicator(block));
  resizeObserver.observe(tabList);
}

// =============================================================================
// Decorate
// =============================================================================

/**
 * Decorate the big-numbers block.
 * Follows EDS pattern: extractData → renderHTML → bindEvents.
 * Preserves Universal Editor instrumentation for authoring mode.
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  console.log('decorate', 'line 487');

  // Check if already decorated (avoid re-decoration)
  const existingContainer = block.querySelector('.big-numbers-block-container');
  if (existingContainer) {
    // Already decorated, rebind interactions
    removeFocusFromAriaHidden(block);
    bindTabInteractions(block);
    decorateIcons(block);
    await enhanceFileLinks(block);
    return;
  }

  // 1. Extract data from DOM structure
  const data = extractData(block);
  if (!data.items.length) return;

  // Keep reference to authored rows for UE instrumentation
  const authoredRows = data.items.map((item) => item.row);

  // 2. Generate unique ID and render HTML
  const bigNumbersId = generateId();
  const newContainer = document.createElement('div');
  newContainer.className = 'big-numbers-block-container';
  newContainer.innerHTML = renderBigNumbersHTML(data, bigNumbersId);

  // 3. Move Universal Editor instrumentation from authored elements to rendered elements
  data.items.forEach((item, index) => {
    const authoredRow = authoredRows[index];
    if (!authoredRow) return;

    if (data.type === ITEM_TYPE.TAB) {
      // For tabs: Move instrumentation to tab panel
      const panel = newContainer.querySelector(`#${bigNumbersId}-panel-${index}`);
      if (panel) {
        moveInstrumentation(authoredRow, panel);
      }
    } else {
      // For no tabs: Move instrumentation to content panel
      const contentPanel = newContainer.querySelector('.big-numbers-content-panel');
      if (contentPanel && index === 0) {
        // Only move first item for "No Tabs" mode
        moveInstrumentation(authoredRow, contentPanel);
      }
    }
  });

  // 4. Replace block content with rendered container
  block.innerHTML = '';
  block.appendChild(newContainer);

  // Store type in dataset for re-decoration check
  block.dataset.type = data.type;

  // 5. Apply accessibility and interaction enhancements
  removeFocusFromAriaHidden(block);
  bindTabInteractions(block);
  decorateIcons(block);

  // 6. Enhance file links
  await enhanceFileLinks(block);
}
