import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  getCellHTML,
  getCellImage,
  getCellText,
  getCellUrl,
  getFirstCell,
  renderBlockHeader,
} from '../../scripts/utility/shared.js';

function getUrlFromCell(cell) {
  const anchor = cell?.querySelector('a');
  if (anchor?.href) return anchor.href;
  return getCellUrl(cell);
}

/**
 * Check if a row is a step-accordion-item (has multiple cells for label, description, image)
 * vs a block-level field row (single cell with a value).
 * Item rows have 3 cells (label, description, image) or 2+ cells with HTML content.
 */
function isItemRow(row) {
  const cells = row.children;

  // Item rows have 3 cells: label, description, image
  if (cells.length >= 3) {
    return true;
  }

  // Item rows with 2 cells: check if second cell has HTML content (description)
  if (cells.length === 2) {
    const secondCellContent = cells[1]?.innerHTML?.trim() || '';
    // If second cell has HTML tags (not just plain text), it's likely an item row
    if (secondCellContent.length > 0 && secondCellContent !== cells[1]?.textContent?.trim()) {
      return true;
    }
  }

  return false;
}

function extractItemData(row) {
  const cells = [...row.children];

  return {
    label: getCellText(cells[0]) || '',
    description: getCellHTML(cells[1]) || '',
    image: getCellImage(cells[2]),
    row,
    cells,
  };
}

/**
 * Extract CTA from block-level rows.
 * In EDS/UE, block-level fields are serialized as separate rows (one per field).
 * Expected row order after heading:
 *   [0] heading, [1] ctaType, [2] singleLabel, [3] singleUrl,
 *   [4] dualIconOne, [5] dualLabelOne, [6] dualDescriptionOne, [7] dualUrlOne,
 *   [8] dualIconTwo, [9] dualLabelTwo, [10] dualDescriptionTwo, [11] dualUrlTwo
 */
function extractCTAFromBlockRows(rows) {
  // Each block-level field is a separate row with a single cell
  const getRowText = (rowIndex) => getCellText(getFirstCell(rows[rowIndex])) || '';
  const getRowUrl = (rowIndex) => getUrlFromCell(getFirstCell(rows[rowIndex])) || '';

  const ctaType = getRowText(1).toLowerCase();

  // If ctaType is not single/dual, no CTA configured at block level
  if (ctaType !== 'single' && ctaType !== 'dual') {
    return { ctaType: 'none' };
  }

  return {
    ctaType,
    singleLabel: getRowText(2),
    singleUrl: getRowUrl(3),
    dualIconOne: getRowText(4),
    dualLabelOne: getRowText(5),
    dualDescriptionOne: getRowText(6),
    dualUrlOne: getRowUrl(7),
    dualIconTwo: getRowText(8),
    dualLabelTwo: getRowText(9),
    dualDescriptionTwo: getRowText(10),
    dualUrlTwo: getRowUrl(11),
  };
}

function extractData(block) {
  const rows = [...block.children];

  // Row 0 is always the heading
  const heading = getCellText(getFirstCell(rows[0])) || '';

  // Find where item rows start (they have 3+ cells or 2 cells with HTML content)
  // Block-level field rows come first (each is a single-cell row)
  let itemStartIndex = 1;
  for (let i = 1; i < rows.length; i += 1) {
    if (isItemRow(rows[i])) {
      itemStartIndex = i;
      break;
    }
  }

  // Extract CTA from block-level rows (rows 1 to itemStartIndex-1)
  // If itemStartIndex is 1, there are no block-level CTA rows
  let cta = { ctaType: 'none' };
  if (itemStartIndex > 1) {
    cta = extractCTAFromBlockRows(rows);
  }

  // Extract item data from item rows
  const itemRows = rows.slice(itemStartIndex);
  const items = itemRows.map(extractItemData).filter((item) => item.label);

  // Check for dark mode class on the block
  const isDarkMode = block.classList.contains('dark');

  return {
    heading,
    cta,
    items,
    isDarkMode,
  };
}

function renderSingleCTA(cta) {
  if (cta.ctaType !== 'single' || !cta.singleLabel || !cta.singleUrl) {
    return '';
  }

  return `
    <div class="step-accordion-cta step-accordion-cta-single">
      <a class="button tertiary" href="${cta.singleUrl}">${cta.singleLabel}</a>
    </div>
  `;
}

function renderDualCTAItem(icon, label, description, url) {
  if (!label || !url) return '';

  const iconMarkup = icon
    ? `<span class="gel-icon gel-icon-${icon} gel-icon-md" aria-hidden="true"></span>`
    : '';

  return `
    <a class="step-accordion-cta-card" href="${url}">
      <span class="step-accordion-cta-card-main">
        ${iconMarkup}
        <span class="step-accordion-cta-card-copy">
          <span class="step-accordion-cta-card-label">${label}</span>
          ${description ? `<span class="step-accordion-cta-card-description">${description}</span>` : ''}
        </span>
      </span>
      <span class="gel-icon gel-icon-arrow-forward-circle-outlined gel-icon-md" aria-hidden="true"></span>
    </a>
  `;
}

function renderDualCTA(cta) {
  if (cta.ctaType !== 'dual') return '';

  const cardOne = renderDualCTAItem(
    cta.dualIconOne,
    cta.dualLabelOne,
    cta.dualDescriptionOne,
    cta.dualUrlOne,
  );
  const cardTwo = renderDualCTAItem(
    cta.dualIconTwo,
    cta.dualLabelTwo,
    cta.dualDescriptionTwo,
    cta.dualUrlTwo,
  );

  if (!cardOne && !cardTwo) return '';

  return `
    <div class="step-accordion-cta step-accordion-cta-dual">
      ${cardOne}
      ${cardTwo}
    </div>
  `;
}

function renderHTML(data) {
  const darkModeClass = data.isDarkMode ? ' dark' : '';

  const headerHTML = renderBlockHeader({
    heading: data.heading,
    headingLevel: 'h2',
    customClass: 'step-accordion-header',
  });

  // CTA is now at the block level, not per-item
  const ctaSectionHTML = (data.cta.ctaType === 'dual' || data.cta.ctaType === 'single')
    ? `<div class="step-accordion-cta-section">${renderSingleCTA(data.cta)}${renderDualCTA(data.cta)}</div>`
    : '';

  const itemsHTML = data.items
    .map((item, index) => {
      const stepId = `step-accordion-step-${index}`;
      const panelId = `step-accordion-panel-${index}`;
      const isActive = index === 0;
      const imageHTML = item.image ? `<img src="${item.image.src}" alt="" loading="lazy">` : '';

      return `
        <li class="step-accordion-item ${isActive ? 'is-active' : ''}" data-index="${index}">
          <div class="step-accordion-dot-container">
            <span class="step-accordion-timeline" aria-hidden="true">
              <span class="step-accordion-dot"></span>
              <span class="step-accordion-connector"></span>
            </span>
            <div class="step-accordion-item-content">
              <button
                class="step-accordion-trigger"
                id="${stepId}"
                type="button"
                aria-expanded="${isActive ? 'true' : 'false'}"
                aria-controls="${panelId}"
              >
                <span class="step-accordion-label">${item.label}</span>
              </button>
              <div
                id="${panelId}"
                class="step-accordion-panel${isActive ? ' is-open' : ''}"
                role="region"
                aria-labelledby="${stepId}"
                ${isActive ? '' : 'hidden'}
              >
                <div class="step-accordion-panel-inner">
                  <div class="step-accordion-description">${item.description}</div>
                </div>
              </div>
            </div>
          </div>
          <template class="step-accordion-image-template">${imageHTML}</template>
        </li>
      `;
    })
    .join('');

  return `
    <div class="step-accordion-root${darkModeClass}">
      ${headerHTML}
      <div class="step-accordion-content">
        <ol class="step-accordion-list">${itemsHTML}</ol>
        <div class="step-accordion-image" aria-hidden="true"></div>
      </div>
      ${ctaSectionHTML}
    </div>
  `;
}

function openPanel(panel) {
  panel.removeAttribute('hidden');
  panel.classList.add('is-open');
}

function closePanel(panel) {
  panel.classList.remove('is-open');
  panel.setAttribute('hidden', '');
}

function activateItem(block, itemIndex) {
  const items = [...block.querySelectorAll('.step-accordion-item')];
  const imageContainer = block.querySelector('.step-accordion-content > .step-accordion-image');

  const activeImageTemplate = items[itemIndex]?.querySelector('.step-accordion-image-template');
  const imageMarkup = activeImageTemplate?.innerHTML?.trim() || '';

  if (imageContainer) imageContainer.innerHTML = imageMarkup;

  items.forEach((item, index) => {
    const trigger = item.querySelector('.step-accordion-trigger');
    const panel = item.querySelector('.step-accordion-panel');
    const isActive = index === itemIndex;

    item.classList.toggle('is-active', isActive);
    trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');

    if (isActive) {
      openPanel(panel);
    } else {
      closePanel(panel);
    }
  });
}

function bindEvents(block) {
  const list = block.querySelector('.step-accordion-list');
  if (!list) return;

  list.addEventListener('click', (event) => {
    const trigger = event.target.closest('.step-accordion-trigger');
    if (!trigger) return;

    // Don't re-animate the already-active item
    if (trigger.getAttribute('aria-expanded') === 'true') return;

    const item = trigger.closest('.step-accordion-item');
    const itemIndex = Number(item?.dataset.index ?? 0);
    activateItem(block, itemIndex);
  });

  list.addEventListener('keydown', (event) => {
    const trigger = event.target.closest('.step-accordion-trigger');
    if (!trigger) return;

    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    trigger.click();
  });
}

/**
 * Check if we're in UE authoring mode.
 * @returns {boolean}
 */
function isAuthoringMode() {
  return document.documentElement.classList.contains('adobe-ue-edit');
}

/**
 * Expand all panels when in UE authoring mode so content is editable.
 * @param {HTMLElement} block - The step-accordion block
 */
function expandAllPanelsInAuthoring(block) {
  if (!isAuthoringMode()) return;

  const items = block.querySelectorAll('.step-accordion-item');
  items.forEach((item) => {
    const panel = item.querySelector('.step-accordion-panel');
    const trigger = item.querySelector('.step-accordion-trigger');
    if (panel && trigger) {
      panel.removeAttribute('hidden');
      panel.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      item.classList.add('is-active');
    }
  });
}

export default function decorate(block) {
  // Preserve dark mode class from block before any modifications
  const isDarkMode = block.classList.contains('dark');

  // Check if already decorated
  const existingRoot = block.querySelector('.step-accordion-root');
  const isAlreadyDecorated = existingRoot !== null;

  // In authoring mode, check for raw/undecorated items mixed in
  // Raw items are divs without .step-accordion-item class (UE inserts raw table rows)
  // This only happens during UE authoring, not on published pages
  const inAuthoring = isAuthoringMode();
  let hasRawItems = false;

  if (inAuthoring && isAlreadyDecorated) {
    // Look for raw divs (not .step-accordion-item) that have item-like structure (2+ cells)
    const stepAccordionList = block.querySelector('.step-accordion-list');
    const rawDivsInList = stepAccordionList?.querySelectorAll('div:not(.step-accordion-item)') || [];
    hasRawItems = [...rawDivsInList].some((div) => div.children.length >= 2);
  }

  // If already decorated AND no raw items, just rebind events
  if (isAlreadyDecorated && !hasRawItems) {
    if (existingRoot && isDarkMode) {
      existingRoot.classList.add('dark');
    }
    bindEvents(block);
    expandAllPanelsInAuthoring(block);
    return;
  }

  // If already decorated BUT has raw items (authoring mode only), re-extract from mixed state
  if (isAlreadyDecorated && hasRawItems) {
    // Gather all item data from both decorated items and raw divs in the list
    const stepAccordionList = block.querySelector('.step-accordion-list');
    const decoratedItems = stepAccordionList?.querySelectorAll('.step-accordion-item') || [];
    const rawDivs = stepAccordionList?.querySelectorAll('div:not(.step-accordion-item)') || [];

    // Combine decorated items and raw divs that look like items (2+ cells)
    const allItemElements = [
      ...decoratedItems,
      ...[...rawDivs].filter((div) => div.children.length >= 2),
    ];

    const items = [...allItemElements].map((el) => {
      // Check if this is a decorated item or raw item
      const isDecorated = el.classList.contains('step-accordion-item');

      if (isDecorated) {
        // Extract from decorated structure
        const label = el.querySelector('.step-accordion-label')?.textContent || '';
        const description = el.querySelector('.step-accordion-description')?.innerHTML || '';
        const imageTemplate = el.querySelector('.step-accordion-image-template');
        const imgEl = imageTemplate?.content?.querySelector('img')
          || imageTemplate?.querySelector('img');
        const image = imgEl ? { src: imgEl.src } : null;
        return {
          label,
          description,
          image,
          row: el,
          cells: [],
        };
      }
      // Extract from raw item structure (div with 2+ cells)
      const cells = [...el.children];
      const label = cells[0]?.textContent?.trim() || '';
      const description = cells[1]?.innerHTML || '';
      const imgEl = cells[2]?.querySelector('img');
      const image = imgEl ? { src: imgEl.src } : null;
      return {
        label,
        description,
        image,
        row: el,
        cells,
      };
    }).filter((item) => item.label);

    // Get heading from existing root
    const heading = existingRoot.querySelector('.block-heading')?.textContent || '';

    // Get CTA from existing root
    const ctaSection = existingRoot.querySelector('.step-accordion-cta-section');
    const hasDualCta = ctaSection?.querySelector('.step-accordion-cta-dual') !== null;
    const hasSingleCta = ctaSection?.querySelector('.step-accordion-cta-single') !== null;

    let cta = { ctaType: 'none' };
    if (hasDualCta) {
      const cards = ctaSection.querySelectorAll('.step-accordion-cta-card');
      const iconClassOne = cards[0]?.querySelector('.gel-icon')?.className || '';
      const iconClassTwo = cards[1]?.querySelector('.gel-icon')?.className || '';
      cta = {
        ctaType: 'dual',
        dualIconOne: iconClassOne.match(/gel-icon-(\S+)/)?.[1] || '',
        dualLabelOne: cards[0]?.querySelector('.step-accordion-cta-card-label')?.textContent || '',
        dualDescriptionOne: cards[0]?.querySelector('.step-accordion-cta-card-description')
          ?.textContent || '',
        dualUrlOne: cards[0]?.href || '',
        dualIconTwo: iconClassTwo.match(/gel-icon-(\S+)/)?.[1] || '',
        dualLabelTwo: cards[1]?.querySelector('.step-accordion-cta-card-label')?.textContent || '',
        dualDescriptionTwo: cards[1]?.querySelector('.step-accordion-cta-card-description')
          ?.textContent || '',
        dualUrlTwo: cards[1]?.href || '',
      };
    } else if (hasSingleCta) {
      const link = ctaSection.querySelector('.step-accordion-cta-single a');
      cta = {
        ctaType: 'single',
        singleLabel: link?.textContent || '',
        singleUrl: link?.href || '',
      };
    }

    const data = {
      heading,
      cta,
      items,
      isDarkMode,
    };

    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderHTML(data);
    const root = wrapper.firstElementChild;

    // Move UE instrumentation from block to root
    moveInstrumentation(block, root);

    // Move UE instrumentation from item elements to rendered items
    const renderedItems = [...root.querySelectorAll('.step-accordion-item')];
    renderedItems.forEach((renderedItem, idx) => {
      const originalItem = items[idx];
      if (originalItem?.row) {
        moveInstrumentation(originalItem.row, renderedItem);
      }
    });

    block.replaceChildren(root);

    // Re-apply dark mode class to block element after replacing children
    if (isDarkMode) {
      block.classList.add('dark');
    }

    activateItem(block, 0);
    bindEvents(block);
    expandAllPanelsInAuthoring(block);
    return;
  }

  // Normal first-time decoration from raw EDS table structure
  const rows = [...block.children];
  const hasRawStructure = rows.length > 0 && rows[0].tagName === 'DIV';
  if (!hasRawStructure) {
    return;
  }

  const data = extractData(block);
  // Override isDarkMode from block class (more reliable than extraction)
  data.isDarkMode = isDarkMode;

  // Keep reference to authored rows for UE instrumentation
  const authoredItems = data.items;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderHTML(data);
  const root = wrapper.firstElementChild;

  // Move UE instrumentation from block to root container
  moveInstrumentation(block, root);

  // Move UE instrumentation from authored rows to rendered items
  const renderedItems = [...root.querySelectorAll('.step-accordion-item')];
  renderedItems.forEach((renderedItem, index) => {
    const authoredItem = authoredItems[index];
    if (!authoredItem?.row) {
      return;
    }

    // Move UE component instrumentation from the original row onto the new item
    moveInstrumentation(authoredItem.row, renderedItem);

    // In authoring mode, preserve authored content with UE instrumentation
    if (isAuthoringMode()) {
      // Preserve authored label content with UE instrumentation
      const labelCell = authoredItem.cells[0];
      const labelTarget = renderedItem.querySelector('.step-accordion-label');
      if (labelCell && labelTarget) {
        // Clear rendered content and move authored nodes
        labelTarget.textContent = '';
        labelTarget.append(...labelCell.childNodes);
        moveInstrumentation(labelCell, labelTarget);
      }

      // Preserve authored description content with UE instrumentation
      const descriptionCell = authoredItem.cells[1];
      const descriptionTarget = renderedItem.querySelector('.step-accordion-description');
      if (descriptionCell && descriptionTarget) {
        // Clear rendered content and move authored nodes
        descriptionTarget.innerHTML = '';
        descriptionTarget.append(...descriptionCell.childNodes);
        moveInstrumentation(descriptionCell, descriptionTarget);
      }
    }
  });

  block.replaceChildren(root);

  // Re-apply dark mode class to block element after replacing children
  // This ensures CSS selectors like .step-accordion.dark work during authoring
  if (isDarkMode) {
    block.classList.add('dark');
  }

  activateItem(block, 0);
  bindEvents(block);
  expandAllPanelsInAuthoring(block);
}
