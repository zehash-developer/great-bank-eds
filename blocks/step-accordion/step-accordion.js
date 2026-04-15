/**
 * Step Accordion Block
 *
 * Implements a numbered step-by-step accordion with:
 * - Single-expand behaviour (one panel open at a time)
 * - First step expanded by default
 * - Visual timeline (numbered dot circles + vertical connector line)
 * - Optional right-hand image area that swaps on step activation
 * - Light (default) and Dark mode via `dark` class on block
 * - CTA section: none | single link | dual card links
 * - Full keyboard support (Tab + Enter/Space to activate)
 * - ARIA accordion pattern (aria-expanded, aria-controls, role="region")
 * - Universal Editor compatibility (all panels open in authoring mode)
 *
 * Authored row layout:
 *   Row 0: [heading]                           (1 cell, required)
 *   Row 1: [ctaType]                           (1 cell, "none"|"single"|"dual")
 *   Row 2: [singleLabel | dualIconOne]         (1 cell, ctaType-dependent)
 *   Row 3: [singleUrl   | dualLabelOne]        (1 cell)
 *   Row 4: [dualDescriptionOne]                (1 cell, dual only)
 *   Row 5: [dualUrlOne]                        (1 cell, dual only)
 *   Row 6: [dualIconTwo]                       (1 cell, dual only)
 *   Row 7: [dualLabelTwo]                      (1 cell, dual only)
 *   Row 8: [dualDescriptionTwo]                (1 cell, dual only)
 *   Row 9: [dualUrlTwo]                        (1 cell, dual only)
 *   Rows N+: [label | subtitle | description | image]  (4 cells per step)
 *            [label | description | image]             (3 cells, subtitle absent)
 *
 * Figma references:
 *   Light:  docs/requirements/step-accordion/figma/node-28-1000-step-accordion-light.png
 *   Dots:   docs/requirements/step-accordion/figma/node-28-1093-step-accordion-variant-b.png
 *   Dark:   docs/requirements/step-accordion/figma/node-28-2860-step-accordion-dark.png
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  getCellHTML,
  getCellImage,
  getCellText,
  getCellUrl,
  getFirstCell,
  renderBlockHeader,
} from '../../scripts/utility/shared.js';

// =============================================================================
// ID Generation
// =============================================================================

let stepAccordionIdCounter = 0;

function generateId(prefix = 'step-accordion') {
  stepAccordionIdCounter += 1;
  return `${prefix}-${stepAccordionIdCounter}`;
}

// =============================================================================
// UE authoring mode detection
// =============================================================================

function isUEMode() {
  return document.documentElement.classList.contains('adobe-ue-edit');
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Item rows have 3 or more cells (label [| subtitle] | description | image).
 * Heading and CTA field rows have exactly 1 cell.
 * @param {HTMLElement} row
 * @returns {boolean}
 */
function isItemRow(row) {
  return row.children.length >= 3;
}

/**
 * Extract a single step item from a 3- or 4-cell authored row.
 *
 * 4 cells: [label] [subtitle] [description richtext] [image]
 * 3 cells: [label] [description richtext] [image]  (subtitle absent)
 *
 * @param {HTMLElement} row
 * @returns {{label, subtitle, description, image, row}|null}
 */
function extractItemFromRow(row) {
  const cells = [...row.children];
  const label = getCellText(cells[0]) || '';
  if (!label.trim()) return null;

  const has4Cells = cells.length >= 4;
  const subtitle = has4Cells ? (getCellText(cells[1]) || '') : '';
  const descCell = has4Cells ? cells[2] : cells[1];
  const imgCell = has4Cells ? cells[3] : cells[2];

  return {
    label,
    subtitle,
    description: getCellHTML(descCell) || '',
    image: getCellImage(imgCell),
    row,
  };
}

/**
 * Extract CTA data from ordered single-cell rows between the heading row
 * and the first item row.
 *
 * Single CTA row order: [ctaType] [singleLabel] [singleUrl]
 * Dual CTA row order:   [ctaType] [dualIconOne] [dualLabelOne]
 *                       [dualDescriptionOne] [dualUrlOne]
 *                       [dualIconTwo] [dualLabelTwo] [dualDescriptionTwo] [dualUrlTwo]
 *
 * @param {HTMLElement[]} ctaRows
 * @returns {Object}
 */
function extractCTA(ctaRows) {
  const getText = (i) => {
    const row = ctaRows[i];
    return row ? (getCellText(getFirstCell(row)) || '') : '';
  };
  const getUrl = (i) => {
    const row = ctaRows[i];
    return row ? (getCellUrl(getFirstCell(row)) || '') : '';
  };

  const ctaType = getText(0) || 'none';
  if (ctaType === 'single') {
    return {
      ctaType,
      singleLabel: getText(1),
      singleUrl: getUrl(2),
    };
  }
  if (ctaType === 'dual') {
    return {
      ctaType,
      dualIconOne: getText(1),
      dualLabelOne: getText(2),
      dualDescriptionOne: getText(3),
      dualUrlOne: getUrl(4),
      dualIconTwo: getText(5),
      dualLabelTwo: getText(6),
      dualDescriptionTwo: getText(7),
      dualUrlTwo: getUrl(8),
    };
  }
  return { ctaType: 'none' };
}

/**
 * Extract all block data from the EDS document table DOM.
 *
 * @param {HTMLElement} block
 * @returns {{title: string, cta: Object, items: Array}}
 */
function extractData(block) {
  const rows = [...block.children];

  // Row 0: heading (single cell)
  const title = getCellText(getFirstCell(rows[0])) || '';

  // Partition remaining rows into CTA field rows (1 cell) and item rows (3+ cells)
  const ctaRows = [];
  const itemRows = [];
  let foundFirstItem = false;

  rows.slice(1).forEach((row) => {
    if (isItemRow(row)) {
      foundFirstItem = true;
      itemRows.push(row);
    } else if (!foundFirstItem) {
      ctaRows.push(row);
    }
  });

  const cta = ctaRows.length > 0 ? extractCTA(ctaRows) : { ctaType: 'none' };
  const items = itemRows.map(extractItemFromRow).filter(Boolean);

  return { title, cta, items };
}

// =============================================================================
// Render helpers
// =============================================================================

/**
 * Render a numbered step dot.
 * @param {number} index - Zero-based step index
 * @param {boolean} isActive
 * @returns {string}
 */
function renderDotHTML(index, isActive) {
  return `<button class="step-accordion-dot${isActive ? ' is-active' : ''}" type="button" aria-label="Go to step ${index + 1}" tabindex="-1">${index + 1}</button>`;
}

/**
 * Render the vertical connector line between dots. Omitted on the last step.
 * @param {boolean} isLast
 * @returns {string}
 */
function renderConnectorHTML(isLast) {
  if (isLast) return '';
  return '<span class="step-accordion-connector" aria-hidden="true"></span>';
}

/**
 * Render a single step LI. Text content is populated after insertion via
 * populateItems() so that UE instrumentation attributes are preserved.
 *
 * @param {Object} item    - Step item data object
 * @param {number} index   - Zero-based step index
 * @param {number} total   - Total step count
 * @param {string} blockId - Unique block ID for ARIA wiring
 * @param {boolean} ue     - Universal Editor authoring mode flag
 * @returns {string}
 */
function renderItemHTML(item, index, total, blockId, ue) {
  const isActive = ue || index === 0;
  const isLast = index === total - 1;
  const panelId = `${blockId}-panel-${index}`;
  const triggerId = `${blockId}-trigger-${index}`;

  return `
    <li class="step-accordion-item${isActive ? ' is-active' : ''}" data-index="${index}">
      <div class="step-accordion-dot-container">
        <span class="step-accordion-timeline" aria-hidden="true">
          ${renderDotHTML(index, isActive)}
          ${renderConnectorHTML(isLast)}
        </span>
        <div class="step-accordion-item-content">
          <button
            class="step-accordion-trigger"
            id="${triggerId}"
            type="button"
            aria-expanded="${isActive ? 'true' : 'false'}"
            aria-controls="${panelId}"
          >
            <span class="step-accordion-title-group">
              <span class="step-accordion-label"></span>
              <span class="step-accordion-subtitle"></span>
            </span>
            <i class="gel-icon gel-icon-expand-more step-accordion-chevron" aria-hidden="true"></i>
          </button>
          <div
            id="${panelId}"
            class="step-accordion-panel${isActive ? ' is-open' : ''}"
            role="region"
            aria-labelledby="${triggerId}"
            ${isActive ? '' : 'hidden'}
          >
            <div class="step-accordion-panel-inner">
              <div class="step-accordion-description"></div>
            </div>
          </div>
        </div>
      </div>
      <template class="step-accordion-image-template"></template>
    </li>`;
}

/**
 * Render the single-link CTA section.
 * @param {Object} cta
 * @returns {string}
 */
function renderSingleCTAHTML(cta) {
  if (!cta.singleLabel || !cta.singleUrl) return '';
  return `
    <div class="step-accordion-cta step-accordion-cta--single">
      <a class="button tertiary" href="${cta.singleUrl}">${cta.singleLabel}</a>
    </div>`;
}

/**
 * Render a single dual-CTA card link.
 * @param {string} icon        - GEL icon class suffix (e.g. "home-outlined"), or empty
 * @param {string} label       - Card label text
 * @param {string} description - Optional short description
 * @param {string} url         - Destination URL
 * @returns {string}
 */
function renderDualCTACardHTML(icon, label, description, url) {
  const iconHTML = icon
    ? `<i class="gel-icon gel-icon-${icon} gel-icon-lg" aria-hidden="true"></i>`
    : '';
  const descHTML = description
    ? `<span class="step-accordion-cta-card-desc">${description}</span>`
    : '';

  return `
    <a class="step-accordion-cta-card" href="${url || '#'}">
      ${iconHTML}
      <span class="step-accordion-cta-card-body">
        <span class="step-accordion-cta-card-label">${label}</span>
        ${descHTML}
      </span>
      <i class="gel-icon gel-icon-arrow-forward-circle-outlined gel-icon-lg" aria-hidden="true"></i>
    </a>`;
}

/**
 * Render the dual-card CTA section.
 * @param {Object} cta
 * @returns {string}
 */
function renderDualCTAHTML(cta) {
  const card1 = renderDualCTACardHTML(
    cta.dualIconOne, cta.dualLabelOne, cta.dualDescriptionOne, cta.dualUrlOne,
  );
  const card2 = renderDualCTACardHTML(
    cta.dualIconTwo, cta.dualLabelTwo, cta.dualDescriptionTwo, cta.dualUrlTwo,
  );
  return `
    <div class="step-accordion-cta step-accordion-cta--dual">
      ${card1}
      ${card2}
    </div>`;
}

/**
 * Select and render the correct CTA variant.
 * @param {Object} cta
 * @returns {string}
 */
function renderCTAHTML(cta) {
  if (cta.ctaType === 'single') return renderSingleCTAHTML(cta);
  if (cta.ctaType === 'dual') return renderDualCTAHTML(cta);
  return '';
}

/**
 * Render the complete block HTML string.
 * Rich text content is injected after insertion via populateItems().
 *
 * @param {{title, cta, items}} data
 * @param {string} blockId
 * @param {boolean} ue - Universal Editor authoring mode
 * @returns {string}
 */
function renderHTML(data, blockId, ue = false) {
  const { title, cta, items } = data;

  const headingHTML = renderBlockHeader({ heading: title, headingLevel: 'h2' });
  const listHTML = items
    .map((item, index) => renderItemHTML(item, index, items.length, blockId, ue))
    .join('');
  const ctaHTML = renderCTAHTML(cta);

  return `
    ${headingHTML}
    <div class="step-accordion-content">
      <ol class="step-accordion-list">${listHTML}</ol>
      <div class="step-accordion-image" aria-hidden="true" hidden></div>
    </div>
    ${ctaHTML}`;
}

// =============================================================================
// DOM population
// =============================================================================

/**
 * Populate text/HTML into the rendered DOM slots, and pre-fill each
 * item's <template> with its optional image.
 *
 * @param {HTMLElement} block
 * @param {Array} items
 */
function populateItems(block, items) {
  const listItems = [...block.querySelectorAll('.step-accordion-item')];
  listItems.forEach((li, index) => {
    const item = items[index];
    if (!item) return;

    const labelEl = li.querySelector('.step-accordion-label');
    if (labelEl) labelEl.textContent = item.label;

    const subtitleEl = li.querySelector('.step-accordion-subtitle');
    if (subtitleEl) {
      if (item.subtitle) {
        subtitleEl.textContent = item.subtitle;
      } else {
        subtitleEl.hidden = true;
      }
    }

    const descEl = li.querySelector('.step-accordion-description');
    if (descEl) descEl.innerHTML = item.description;

    // Pre-fill the hidden <template> with the item's image (if present)
    if (item.image) {
      const tmpl = li.querySelector('.step-accordion-image-template');
      if (tmpl) {
        const img = document.createElement('img');
        img.src = item.image.src;
        img.alt = item.image.alt || '';
        tmpl.content.appendChild(img);
      }
    }
  });
}

// =============================================================================
// Image area management
// =============================================================================

/**
 * Update the right-hand image panel to show the active step's image.
 * Hides the panel entirely when the active step has no image.
 *
 * @param {HTMLElement} block
 * @param {number} activeIndex
 */
function updateImageArea(block, activeIndex) {
  const imageArea = block.querySelector('.step-accordion-image');
  if (!imageArea) return;

  const activeItem = block.querySelectorAll('.step-accordion-item')[activeIndex];
  const tmpl = activeItem?.querySelector('.step-accordion-image-template');
  const hasImage = tmpl && tmpl.content.children.length > 0;

  imageArea.innerHTML = '';
  if (hasImage) {
    imageArea.appendChild(tmpl.content.cloneNode(true));
    imageArea.removeAttribute('hidden');
  } else {
    imageArea.setAttribute('hidden', '');
  }
}

// =============================================================================
// Interaction
// =============================================================================

/**
 * Expand the target step and collapse all others.
 * Updates dot highlight, aria-expanded, chevron rotation, and image area.
 *
 * @param {HTMLElement} block
 * @param {number} targetIndex
 */
function activateItem(block, targetIndex) {
  const listItems = [...block.querySelectorAll('.step-accordion-item')];
  listItems.forEach((li, index) => {
    const isActive = index === targetIndex;
    const wasActive = li.classList.contains('is-active');
    const trigger = li.querySelector('.step-accordion-trigger');
    const panel = li.querySelector('.step-accordion-panel');
    const dot = li.querySelector('.step-accordion-dot');

    li.classList.toggle('is-active', isActive);
    dot?.classList.toggle('is-active', isActive);
    if (trigger) trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');

    if (panel) {
      panel.classList.toggle('is-open', isActive);

      if (!wasActive && isActive) {
        // Opening — pin max-height at 0 first, remove hidden, then animate to scrollHeight
        panel.style.maxHeight = '0';
        panel.removeAttribute('hidden');
        /* eslint-disable-next-line no-unused-expressions */
        panel.offsetHeight; // force reflow so browser locks in max-height: 0 before transition
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        panel.addEventListener('transitionend', () => {
          panel.style.maxHeight = ''; // hand off to CSS natural height
        }, { once: true });
      } else if (wasActive && !isActive) {
        // Closing — pin current height, force reflow, then animate to 0 → add hidden
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        /* eslint-disable-next-line no-unused-expressions */
        panel.offsetHeight; // force reflow
        panel.style.maxHeight = '0';
        panel.addEventListener('transitionend', () => {
          panel.setAttribute('hidden', '');
          panel.style.maxHeight = '';
        }, { once: true });
      }
    }
  });

  updateImageArea(block, targetIndex);
}

/**
 * Bind a single delegated click listener on the block.
 * Re-click guard: clicking the already-active step trigger does nothing.
 *
 * @param {HTMLElement} block
 */
function bindEvents(block) {
  let activeIndex = 0;

  block.addEventListener('click', (e) => {
    const trigger = e.target.closest('.step-accordion-trigger');
    const dot = e.target.closest('.step-accordion-dot');
    const source = trigger || dot;
    if (!source) return;

    const li = source.closest('.step-accordion-item');
    if (!li) return;

    const index = parseInt(li.dataset.index, 10);
    if (Number.isNaN(index) || index === activeIndex) return;

    activeIndex = index;
    activateItem(block, activeIndex);
  });
}

// =============================================================================
// Universal Editor instrumentation
// =============================================================================

/**
 * Copy UE data-aue-* attributes from the original authored row elements
 * (now detached) to the new LI elements rendered by renderHTML().
 *
 * @param {HTMLElement} block
 * @param {Array} items - Items with .row holding detached original DOM rows
 */
function moveItemInstrumentation(block, items) {
  const listItems = [...block.querySelectorAll('.step-accordion-item')];
  listItems.forEach((li, index) => {
    const item = items[index];
    if (item?.row) moveInstrumentation(item.row, li);
  });
}

// =============================================================================
// Decorate
// =============================================================================

/**
 * Entrypoint called by EDS block loader.
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const ue = isUEMode();
  const data = extractData(block);
  const blockId = generateId();

  block.innerHTML = renderHTML(data, blockId, ue);
  populateItems(block, data.items);
  moveItemInstrumentation(block, data.items);

  if (ue) {
    // All panels already expanded in authoring mode — no interactive logic
    return;
  }

  updateImageArea(block, 0);
  bindEvents(block);
}
