/**
 * Header Block Component
 *
 * Loads and decorates the global navigation header from a nav fragment document.
 * The nav document contains 4 sections: Logo, Nav Links, Quick Links, Sign In Links.
 *
 * Architecture:
 *   extractNavDataFromFragment() → builds data objects from the AEM-rendered nav sections
 *   renderHeaderHTML()           → builds the full nav HTML string from data
 *   decorate()                   → mutates DOM, binds all event handlers
 *
 * Breakpoints: MD (992px) separates desktop (≥992px) from mobile (<992px)
 */
import {
  getMetadata,
} from '../../scripts/aem.js';
import {
  loadFragment,
} from '../fragment/fragment.js';
import {
  moveInstrumentation,
} from '../../scripts/scripts.js';
// Desktop breakpoint: MD (992px) per design spec
const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Check if a pill should remain active based on URL context.
 *
 * @param {HTMLElement} pill - The pill element to check
 * @returns {boolean} True if pill is marked as URL-active
 */
function isPillURLActive(pill) {
  return pill.getAttribute('data-url-active') === 'true';
}

// =============================================================================
// Data Extraction
// =============================================================================
/**
 * Parse a nested <ul> element recursively into a nav item tree.
 * Text-only <li> = opens child drawer. <a> <li> = navigates.
 *
 * @param {HTMLCollection} liElements - Child <li> elements to parse
 * @returns {Array<{label: string, href: string|null, title: string, children: Array}>}
 */
function parseNavItemTree(liElements) {
  return [...liElements].map((li) => {
    const childUl = li.querySelector(':scope > ul');
    const link = li.querySelector(':scope > a');
    // Try multiple ways to extract label
    let label = '';
    if (link) {
      label = link.textContent.trim();
    } else {
      // Check if wrapped in <p> tag (EDS default for plain text)
      const pTag = li.querySelector(':scope > p');
      if (pTag) {
        label = pTag.textContent.trim();
      } else {
        // Try first text node (Storybook/raw text)
        const firstTextNode = [...li.childNodes].find((node) => node
          .nodeType === Node.TEXT_NODE);
        label = firstTextNode?.textContent?.trim() || '';
        // If still empty, try li.textContent but exclude nested ul text
        if (!label && childUl) {
          const clonedLi = li.cloneNode(true);
          const clonedUl = clonedLi.querySelector('ul');
          if (clonedUl) clonedUl.remove();
          label = clonedLi.textContent.trim();
        }
      }
    }
    const item = {
      label,
      href: link ? link.getAttribute('href') : null,
      title: link ? (link.getAttribute('title') || label) : label,
      children: childUl ? parseNavItemTree(childUl.children) : [],
    };
    // Only return items that have a label
    return item.label ? item : null;
  }).filter(Boolean); // Remove null items
}
/**
 * Extract all nav data from the loaded fragment's 3 sections.
 * Logo is hard-coded and not extracted from the fragment.
 *
 * @param {HTMLElement} fragment - The loaded nav fragment element
 * @returns {{navItems: Array, quickLinksEl: Element|null,
 *   signInSection: Element|null,
 *   navLinksSection: Element|null,
 *   quickLinksSection: Element|null}} Nav data object
 */
export function extractNavDataFromFragment(fragment) {
  const sections = [...fragment.querySelectorAll(':scope > .section')];

  // Section 0: Nav Links — RTE with nested <ul> (L0 → L1 → L2)
  const navLinksSection = sections[0] || null;
  const navUl = navLinksSection?.querySelector('ul') || null;
  const navItems = navUl ? parseNavItemTree(navUl.children) : [];

  // Section 1: Quick Links — feature-list block (already decorated by AEM)
  const quickLinksSection = sections[1] || null;
  const quickLinksEl = quickLinksSection?.querySelector('.feature-list')
    || null;

  // Section 2: Sign In Links — RTE (login URLs) + button + RTE (search icon)
  const signInSection = sections[2] || null;

  const result = {
    navItems,
    quickLinksEl,
    signInSection,
    navLinksSection,
    quickLinksSection,
  };
  return result;
}
// =============================================================================
// HTML Rendering
// =============================================================================
/**
 * Render L2 drawer items as <li> elements.
 *
 * @param {Array} children - L2 nav items
 * @returns {string} HTML string
 */
// eslint-disable-next-line no-unused-vars
function renderL2Items(children) {
  // Filter out items without labels
  return children
    .filter((item) => item.label && item.label.trim())
    .map(
      (item) => `
      <li class="nav-l2-item" role="none">
        ${item.href
    ? `<a class="nav-l2-link" href="${item.href}" title="${item.title}">${item.label}</a>`
    : `<span class="nav-l2-text">${item.label}</span>`
}
      </li>`,
    )
    .join('');
}
/**
 * Render L1 drawer items as <li> elements inside the L1 panel.
 * L1 items with children get a button to open the L2 drawer.
 *
 * @param {Array} children - L1 nav items
 * @param {number} l0Index - Parent L0 index for unique IDs
 * @param {string} l0Label - L0 label shown as heading in the L1 panel
 * @returns {string} HTML string for the L1 panel content
 */
function renderL1Panel(children, l0Index, l0Label) {
  // Filter out items without labels
  const validChildren = children.filter((item) => item.label && item.label
    .trim());
  const items = validChildren
    .map((item, l1Index) => {
      const panelId = `nav-l2-panel-${l0Index}-${l1Index}`;
      if (item.children.length > 0) {
        return `
        <li class="nav-l1-item nav-l1-item--has-children" role="none">
          <button
            class="nav-l1-button"
            type="button"
            aria-expanded="false"
            aria-controls="${panelId}"
          >
            ${item.label}
            <i class="gel-icon gel-icon-arrow-right" aria-hidden="true"></i>
          </button>
        </li>`;
      }
      const linkHTML = `
        <li class="nav-l1-item" role="none">
          ${item.href
    ? `<a class="nav-l1-link" href="${item.href}" title="${item.title || item.label}">${item.label}</a>`
    : `<span class="nav-l1-text">${item.label}</span>`
}
        </li>`;
      return linkHTML;
    })
    .join('');
  return `
    <h2 class="nav-l1-heading">${l0Label}</h2>
    <ul class="nav-l1-list" role="list" aria-label="${l0Label} links">
      ${items}
    </ul>
    <div class="nav-quick-links-container nav-l1-quick-links-slot"></div>`;
}
/**
 * Render all L2 panels (separate from L1 panels to avoid clipping issues)
 *
 * @param {Array} navItems - Parsed nav item tree
 * @returns {string} HTML string
 */
function renderL2Panels(navItems) {
  const panels = [];
  navItems.forEach((l0Item, l0Index) => {
    // Filter out L1 items without labels
    l0Item.children.filter((item) => item.label && item.label.trim()).forEach(
      (l1Item, l1Index) => {
        if (l1Item.children.length > 0) {
          const panelId = `nav-l2-panel-${l0Index}-${l1Index}`;
          panels.push(`
          <div id="${panelId}" class="nav-l2-panel" role="region" aria-label="${l1Item.label} submenu" hidden>
            <div class="nav-l2-top">
              <button class="nav-l2-back-button" type="button" aria-label="Back to ${l0Item.label}">
                <i class="gel-icon gel-icon-arrow-left" aria-hidden="true"></i>
              </button>
              <button class="nav-l2-close-button" type="button" aria-label="Close navigation">
                <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
              </button>
            </div>
            <h3 class="nav-l2-heading">${l1Item.label}</h3>
            <ul class="nav-l2-list" role="list" aria-label="${l1Item.label} links">
              ${renderL2Items(l1Item.children, l0Index, l1Index)}
            </ul>
          </div>`);
        }
      },
    );
  });

  return panels.join('');
}
/**
 * Render all L0 pill buttons and their associated L1 drawer panels.
 * Desktop version - includes L2 panels.
 *
 * @param {Array} navItems - Parsed nav item tree
 * @returns {string} HTML string
 */
function renderNavSections(navItems) {
  // Filter out items without labels
  const validItems = navItems.filter((item) => item.label && item.label.trim());
  const pills = validItems
    .map(
      (item, i) => `
      <li class="nav-l0-item" role="none">
        <button
          class="nav-l0-pill"
          type="button"
          aria-expanded="false"
          aria-controls="nav-l1-panel-${i}"
          data-l0-index="${i}"
        >
          ${item.label}
        </button>
      </li>`,
    )
    .join('');
  const panels = validItems
    .map(
      (item, i) => `
      <div
        id="nav-l1-panel-${i}"
        class="nav-l1-panel"
        role="region"
        aria-label="${item.label}"
        hidden
      >
        <div class="nav-l1-close">
          <button class="nav-l1-close-button" type="button" aria-label="Close navigation">
            <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
          </button>
        </div>
        ${renderL1Panel(item.children, i, item.label)}
      </div>`,
    )
    .join('');

  return `
    <div class="nav-l0-pills-wrapper" role="tablist" aria-label="Main navigation">
      <ul class="nav-l0-pills" role="list">
        ${pills}
      </ul>
    </div>
    <div class="nav-l1-panels">
      ${panels}
    </div>
    <div class="nav-l2-panels">
      ${renderL2Panels(navItems)}
    </div>`;
}
/**
 * Render navigation for mobile drawer - WITHOUT L2 panels.
 * L2 panels are rendered separately outside nav-drawer-inner.
 *
 * @param {Array} navItems - Parsed nav item tree
 * @returns {string} HTML string
 */
function renderNavSectionsMobile(navItems) {
  // Filter out items without labels
  const validItems = navItems.filter((item) => item.label && item.label.trim());
  const pills = validItems
    .map(
      (item, i) => `
      <li class="nav-l0-item" role="none">
        <button
          class="nav-l0-pill ${i === 0 ? 'nav-l0-pill-active nav-l0-pill-default-open' : ''}"
          type="button"
          aria-expanded="${i === 0 ? 'true' : 'false'}"
          aria-controls="nav-l1-panel-${i}"
          data-l0-index="${i}"
        >
          ${item.label}
        </button>
      </li>`,
    )
    .join('');
  const panels = validItems
    .map(
      (item, i) => `
      <div
        id="nav-l1-panel-${i}"
        class="nav-l1-panel ${i === 0 ? 'nav-l1-panel-active nav-l1-panel-default-open' : ''}"
        role="region"
        aria-label="${item.label}"
        ${i === 0 ? '' : 'hidden'}
      >
        <div class="nav-l1-close">
          <button class="nav-l1-close-button" type="button" aria-label="Close navigation">
            <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
          </button>
        </div>
        ${renderL1Panel(item.children, i, item.label)}
      </div>`,
    )
    .join('');

  return `
    <div class="nav-l0-pills-wrapper" role="tablist" aria-label="Main navigation">
      <ul class="nav-l0-pills" role="list">
        ${pills}
      </ul>
    </div>
    <div class="nav-l1-panels">
      ${panels}
    </div>`;
}
/**
 * Render the full header nav HTML structure.
 *
 * @param {Object} data - Nav data from extractNavDataFromFragment
 * @returns {string} HTML string for the full nav
 */
export function renderHeaderHTML(data) {
  // Inline SVG logo (125x32 scaled from original 69x28)
  const logoHTML = `<svg width="125" height="32" viewBox="0 0 69 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g clip-path="url(#wbc-logo-clip)">
      <path d="M24.0303 25.0896L17.3333 4.1147C16.447 0.903226 14.7727 0 12.4091 0H0C0.984848 0.401434 1.57576 2.91039 1.57576 2.91039L7.58333 23.9857C8.27273 26.595 10.4394 28 12.9015 28H26C25.0152 27.8996 24.0303 25.0896 24.0303 25.0896Z" fill="#DA1710"/>
      <path d="M44.9697 25.0896L51.6667 4.1147C52.553 0.903226 54.2273 0 56.5909 0H69C68.0152 0.401434 67.4242 2.91039 67.4242 2.91039L61.4167 23.9857C60.7273 26.595 58.5606 28 56.0985 28H43C43.9848 27.8996 44.9697 25.0896 44.9697 25.0896Z" fill="#DA1710"/>
      <path d="M42 0H27V28H42V0Z" fill="#DA1710"/>
    </g>
    <defs>
      <clipPath id="wbc-logo-clip">
        <rect width="69" height="28" fill="white"/>
      </clipPath>
    </defs>
  </svg>`;

  const navSectionsHTML = renderNavSections(data
    .navItems); // Desktop - includes L2
  const navSectionsMobileHTML = renderNavSectionsMobile(data
    .navItems); // Mobile - no L2
  const l2PanelsHTML = renderL2Panels(data.navItems);
  // Check if sign-in links exist
  // Selector covers: AEM author (data-aue-type/data-richtext-model attrs) and aem.live (plain <ul>)
  const hasSignInLinks = data.signInSection?.querySelector(
    '[data-aue-type="richtext"] ul, ul[data-richtext-model], ul',
  );
  // Only render floating sign-in component if we have sign-in links
  const floatingSignInHTML = hasSignInLinks ? `
          <!-- Floating sign-in button (mobile-only, slides up from bottom when drawer opens) -->
          <div class="nav-drawer-signin-float" role="region" aria-label="Sign in options">
            <!-- Collapsed state: button -->
            <button 
              class="nav-drawer-signin-button" 
              type="button" 
              aria-label="Sign in - Show sign-in options" 
              aria-haspopup="menu" 
              aria-expanded="false"
            >
              <span class="nav-drawer-signin-label" aria-hidden="true">Sign in</span>
              <i class="gel-icon gel-icon-arrow-up-circle" aria-hidden="true"></i>
            </button>
            <!-- Expanded state: card with links -->
            <div 
              class="nav-drawer-signin-card" 
              role="menu"
              aria-label="Sign in menu"
              hidden
            >
              <div class="nav-drawer-signin-card-header">
                <span class="nav-drawer-signin-card-title" id="signin-card-title">Sign in</span>
                <button 
                  class="nav-drawer-signin-card-close" 
                  type="button" 
                  aria-label="Close sign in menu"
                >
                  <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
                </button>
              </div>
              <nav 
                class="nav-drawer-signin-card-links"
                aria-labelledby="signin-card-title"
              >
                <!-- Links will be populated dynamically from sign-in section data -->
              </nav>
            </div>
          </div>` : '';
  return `
    <div class="nav-wrapper">
      <nav id="nav" aria-label="Site navigation" aria-expanded="false">
        <!-- Skip navigation links for accessibility -->
        <a href="#main" class="skip-link" aria-label="Skip to main content">Skip to main content</a>
        <a href="#nav-search" class="skip-link skip-link-search" aria-label="Skip to search">Skip to search</a>

        <!-- Bar: logo + hamburger + sign-in (mobile top) -->
        <div class="nav-bar">
          <a class="nav-logo-link" href="/" aria-label="Great Bank home">
            <div class="nav-logo">${logoHTML}</div>
          </a>
          <div class="nav-bar-tools">
            <div class="nav-search-trigger-wrapper">
              <!-- Mobile search button (24px spacing from hamburger) -->
              <button class="nav-search-button nav-search-button-mobile" type="button" aria-label="Search">
                <i class="gel-icon gel-icon-search" aria-hidden="true"></i>
              </button>
            </div>
            <button
              class="nav-hamburger"
              type="button"
              aria-controls="nav"
              aria-expanded="false"
              aria-label="Open navigation menu"
            >
              <span class="nav-hamburger-icon" aria-hidden="true"></span>
            </button>
          </div>
        </div>

        <!-- Desktop pill row (L0 links) - includes L2 panels -->
        <div class="nav-sections">
          ${navSectionsHTML}
        </div>

        <!-- Desktop tools: dropdown + sign-in + search -->
        <div class="nav-tools"></div>

        <!-- Overlay (dims background when drawer or L1 panel is open) -->
        <div class="nav-overlay" aria-hidden="true" tabindex="-1"></div>

        <!-- Search overlay (dims entire viewport including header when search is open) -->
        <div class="nav-search-overlay" aria-hidden="true" tabindex="-1"></div>

        <!-- Desktop search panel (slides in from right) -->
        <div class="nav-search-panel" aria-hidden="true" role="dialog" aria-label="Search">
          <div class="nav-search-panel-header">
            <button class="nav-search-close-button" type="button" aria-label="Close search">
              <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
            </button>
          </div>
          <div class="nav-search-panel-content">
            <div class="nav-search-input-wrapper">
              <i class="gel-icon gel-icon-search nav-search-icon-left" aria-hidden="true"></i>
              <input 
                type="search" 
                class="nav-search-input" 
                placeholder="Search Great Bank"
                aria-label="Search Great Bank"
              />
              <button class="nav-search-mic-button" type="button" aria-label="Voice search">
                <i class="gel-icon gel-icon-voice" aria-hidden="true"></i>
              </button>
              <button class="nav-search-clear-button" type="button" aria-label="Clear search" hidden>
                <i class="gel-icon gel-icon-clear" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile drawer (slides in from right) -->
        <div class="nav-drawer" aria-hidden="true">
          <!-- Floating gradient overlay: back button (hidden at L1) + close button -->
          <!-- Figma: h-[72px], bg-gradient from #f3f4f6 to transparent, justify-between -->
          <div class="nav-drawer-top">
            <button
              class="nav-drawer-close-button"
              type="button"
              aria-controls="nav"
              aria-label="Close navigation menu"
            >
              <i class="gel-icon gel-icon-close" aria-hidden="true"></i>
            </button>
          </div>
          <!-- Scrollable content area — starts below the 72px gradient overlay -->
          <div class="nav-drawer-inner">
            ${navSectionsMobileHTML}
            <div class="nav-quick-links-container nav-quick-links-slot"></div>
            <div class="nav-sign-in-slot"></div>
          </div>
          <!-- L2 panels positioned outside nav-drawer-inner to avoid parent transform -->
          ${l2PanelsHTML}
          ${floatingSignInHTML}
        </div>

      </nav>
    </div>`;
}
// =============================================================================
// Interaction Handlers
// =============================================================================
/**
 * Close every open L1 panel and deactivate all L0 pills.
 *
 * @param {HTMLElement} nav - The root nav element
 */
/**
 * Close an L1 panel with animation (desktop only).
 *
 * @param {HTMLElement} panel - The L1 panel to close
 */
function closeL1PanelWithAnimation(panel) {
  // Add closing class to ensure animation happens
  panel.classList.add('nav-l1-panel-closing');

  // Use requestAnimationFrame to ensure the browser registers the closing state
  requestAnimationFrame(() => {
    // Remove active class to trigger slide-out animation
    panel.classList.remove('nav-l1-panel-active');

    // After animation completes (300ms), hide the panel
    setTimeout(() => {
      // Only hide if panel is still inactive (not reopened during animation)
      if (!panel.classList.contains('nav-l1-panel-active')) {
        panel.hidden = true;
        panel.classList.remove('nav-l1-panel-closing');
      }
    }, 300); // Match CSS transition duration
  });
}
/**
 * Close every open L1 panel and deactivate all L0 pills.
 *
 * @param {HTMLElement} nav - The root nav element
 * @param {HTMLElement} returnFocusToPill - Optional pill to return focus to after closing
 */
function closeAllL1Panels(nav, returnFocusToPill = null) {
  // First, close all L2 panels
  nav.querySelectorAll('.nav-l2-panel').forEach((panel) => {
    panel.classList.remove('nav-l2-panel-active');
    panel.hidden = true;
  });
  // Reset all L1 buttons
  nav.querySelectorAll('.nav-l1-button').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
  // Close all L1 panels
  nav.querySelectorAll('.nav-l1-panel').forEach((panel) => {
    // Remove closing class if present
    panel.classList.remove('nav-l1-panel-closing');
    // Remove has-active-l2 class to restore close button visibility
    panel.classList.remove('has-active-l2');
    if (panel.classList.contains('nav-l1-panel-active')) {
      if (isDesktop.matches) {
        // Desktop: animate out
        closeL1PanelWithAnimation(panel);
      } else {
        // Mobile: fade out (100ms)
        panel.classList.remove('nav-l1-panel-active');
        setTimeout(() => {
          panel.hidden = true;
        }, 100); // Wait for 100ms fade
      }
    } else {
      // Not active: instant hide
      panel.hidden = true;
    }
  });
  // Reset all pills
  nav.querySelectorAll('.nav-l0-pill').forEach((pill) => {
    pill.setAttribute('aria-expanded', 'false');
    // Only remove active class if pill is not URL-active
    if (!isPillURLActive(pill)) {
      pill.classList.remove('nav-l0-pill-active');
    }
  });
  // Return focus to the pill that opened the panel (accessibility)
  if (returnFocusToPill) {
    setTimeout(() => {
      returnFocusToPill.focus();
    }, isDesktop.matches ? 300
      : 0); // Wait for 300ms animation on desktop (Apple iOS timing)
  }
}
/**
 * Close an L2 panel with animation (desktop only).
 *
 * @param {HTMLElement} panel - The L2 panel to close
 */
// function closeL2PanelWithAnimation(panel) {
//   // Remove active class to trigger fade-out animation
//   panel.classList.remove('nav-l2-panel-active');
//   // After animation completes, hide the panel
//   const onTransitionEnd = () => {
//     panel.hidden = true;
//     panel.removeEventListener('transitionend', onTransitionEnd);
//   };
//   panel.addEventListener('transitionend', onTransitionEnd);
// }

/**
 * Close every open L2 panel within a given L1 panel.
 *
 * @param {HTMLElement} l1Panel - The L1 panel element
 */
function closeAllL2Panels(l1Panel) {
  const nav = l1Panel.closest('nav');
  return new Promise((resolve) => {
    let hasActiveL2 = false;
    // L2 panels are now siblings, so search all L2 panels associated with this L1
    // We close all L2 panels that belong to this L1's buttons
    nav.querySelectorAll('.nav-l2-panel').forEach((panel) => {
      // Check if this L2 belongs to this L1 by checking if button exists in this L1
      const panelId = panel.id;
      const btn = l1Panel.querySelector(`[aria-controls="${panelId}"]`);
      if (btn) {
        if (!panel.hidden) {
          hasActiveL2 = true;
          // Both desktop and mobile: animate out (300ms)
          panel.classList.remove('nav-l2-panel-active');
          setTimeout(() => {
            // Desktop: set hidden after animation
            // Mobile: leave off-screen with transform for future animations
            if (isDesktop.matches) {
              panel.hidden = true;
            }
          }, 300);
        } else {
          // Already hidden: ensure class is removed
          panel.classList.remove('nav-l2-panel-active');
        }
      }
    });
    l1Panel.querySelectorAll('.nav-l1-button').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
    });
    // Remove class from L1 panel to show its close button
    l1Panel.classList.remove('has-active-l2');
    // Resolve after L2 animation completes (300ms) or immediately if no active L2
    setTimeout(() => resolve(), hasActiveL2 ? 300 : 0);
  });
}
/**
 * Open an L1 panel on mobile (extracted for reuse).
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {HTMLElement} panel - The panel to open
 * @param {HTMLElement} pill - The pill that controls this panel
 * @param {boolean} skipAnimation - If true, show instantly without animation
 * @param {boolean} skipPillActivation - If true, don't activate pill (already done)
 */
function openL1PanelMobile(nav, panel, pill, skipAnimation, skipPillActivation =
false) {
  if (skipAnimation) {
    // Instant show without animation
    panel.hidden = false;
    panel.classList.add('nav-l1-panel-active');
    // Move focus immediately
    const firstFocusable = panel.querySelector(
      '.nav-l1-list a, .nav-l1-list button',
    )
      || panel.querySelector('.nav-l1-close-button');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  } else {
    // Fade in (250ms)
    panel.hidden = false;
    // Force reflow
    const width = panel.offsetWidth; // eslint-disable-line no-unused-vars
    // Trigger fade by adding active class
    requestAnimationFrame(() => {
      panel.classList.add('nav-l1-panel-active');
      // Move focus after fade completes
      setTimeout(() => {
        const firstFocusable = panel.querySelector(
          '.nav-l1-list a, .nav-l1-list button',
        )
          || panel.querySelector('.nav-l1-close-button');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 100); // Wait for 100ms fade
    });
  }
  // Activate pill (unless already done)
  if (!skipPillActivation) {
    pill.setAttribute('aria-expanded', 'true');
    pill.classList.add('nav-l0-pill-active');
  }
}
/**
 * Toggle visibility of mic vs clear button based on input content.
 *
 * @param {HTMLElement} nav - Root nav element
 */
function toggleSearchButtons(nav) {
  const searchInput = nav.querySelector('.nav-search-input');
  const micBtn = nav.querySelector('.nav-search-mic-button');
  const clearBtn = nav.querySelector('.nav-search-clear-button');

  if (!searchInput || !micBtn || !clearBtn) return;

  const hasContent = searchInput.value.trim().length > 0;

  if (hasContent) {
    // Show clear button, hide mic button
    micBtn.hidden = true;
    clearBtn.hidden = false;
  } else {
    // Show mic button, hide clear button
    micBtn.hidden = false;
    clearBtn.hidden = true;
  }
}
/**
 * Open the desktop search panel (slides in from right).
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {boolean} shouldFocusInput - If true, focus the search input after opening
 */
function openSearchPanel(nav, shouldFocusInput = false) {
  const searchPanel = nav.querySelector('.nav-search-panel');
  const searchOverlay = nav.querySelector('.nav-search-overlay');
  const searchInput = searchPanel?.querySelector('.nav-search-input');

  if (!searchPanel) return;

  // Close all L1 and L2 panels before opening search
  closeAllL1Panels(nav);

  // Reset button visibility based on current input state
  toggleSearchButtons(nav);

  // Show search overlay
  if (searchOverlay) {
    searchOverlay.setAttribute('aria-hidden', 'false');
  }

  // Show panel first (but still off-screen due to transform)
  searchPanel.setAttribute('aria-hidden', 'false');

  // Force reflow to ensure display change takes effect before animation
  searchPanel.offsetHeight; // eslint-disable-line no-unused-expressions

  // Trigger slide-in animation
  searchPanel.classList.add('nav-search-panel-active');

  // Focus the search input after animation starts (only if keyboard activated)
  if (shouldFocusInput && searchInput) {
    setTimeout(() => {
      searchInput.focus();
    }, 100); // Small delay to ensure panel is visible
  }
}

/**
 * Close the search panel (slides out to right).
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {boolean} returnFocusToButton - Whether to return focus to search button
 */
function closeSearchPanel(nav, returnFocusToButton = false) {
  const searchPanel = nav.querySelector('.nav-search-panel');
  const searchOverlay = nav.querySelector('.nav-search-overlay');
  const searchInput = searchPanel?.querySelector('.nav-search-input');

  if (!searchPanel) return;

  // Stop any active voice recognition and clear silence timeout
  if (nav.activeRecognition) {
    nav.activeRecognition.stop();
    nav.activeRecognition = null;
  }
  if (nav.silenceTimeout) {
    clearTimeout(nav.silenceTimeout);
    nav.silenceTimeout = null;
  }

  // Deactivate search panel
  searchPanel.classList.remove('nav-search-panel-active');

  // Hide search overlay
  if (searchOverlay) {
    searchOverlay.setAttribute('aria-hidden', 'true');
  }

  // After animation, hide panel and clear input
  setTimeout(() => {
    searchPanel.setAttribute('aria-hidden', 'true');
    if (searchInput) {
      searchInput.value = '';
    }
    // Reset button visibility
    toggleSearchButtons(nav);

    // Return focus to search button if requested
    if (returnFocusToButton) {
      // Select appropriate search button based on viewport
      const searchButton = isDesktop.matches
        ? nav.querySelector('.nav-search-button:not(.nav-search-button-mobile)')
        : nav.querySelector('.nav-search-button-mobile');
      if (searchButton) {
        searchButton.focus();
      }
    }
  }, 300); // Match CSS transition duration
}

/**
 * Toggle a specific L1 panel open or closed, closing all others first.
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {HTMLElement} pill - The L0 pill button that was clicked
 * @param {boolean} skipAnimation - If true, show/hide instantly without animation (mobile only)
 */
function toggleL1Panel(nav, pill, skipAnimation = false) {
  const panelId = pill.getAttribute('aria-controls');
  // On mobile, target panels inside the drawer. On desktop, target panels in nav-sections
  const panelContainer = isDesktop.matches
    ? nav.querySelector('.nav-sections')
    : nav.querySelector('.nav-drawer');
  const panel = panelContainer?.querySelector(`#${panelId}`);
  const isExpanded = pill.getAttribute('aria-expanded') === 'true';

  // Close search panel if open (desktop only)
  const searchPanel = nav.querySelector('.nav-search-panel.nav-search-panel-active');
  if (searchPanel && isDesktop.matches) {
    closeSearchPanel(nav, false); // Close without returning focus (we're opening L1)
  }

  // Mobile: clicking active pill does nothing (stays active, no toggling)
  // Desktop: clicking active pill closes it
  if (isExpanded) {
    if (isDesktop.matches) {
      closeAllL1Panels(nav, pill); // Return focus to this pill when closing
    }
    // On mobile, do nothing - pills stay active (one-way activation, no toggling)
    return;
  }
  // Mobile panel switching: fade out current panel first (250ms), then fade in new panel
  if (!isDesktop.matches) {
    const currentPanel = panelContainer?.querySelector(
      '.nav-l1-panel.nav-l1-panel-active:not([hidden])',
    );
    if (currentPanel && currentPanel.id !== panelId) {
      // Deactivate all pills immediately (visual feedback)
      nav.querySelectorAll('.nav-l0-pill').forEach((p) => {
        p.setAttribute('aria-expanded', 'false');
        // Only remove active class if pill is not URL-active
        if (!isPillURLActive(p)) {
          p.classList.remove('nav-l0-pill-active');
        }
      });
      // Activate the new pill immediately
      pill.setAttribute('aria-expanded', 'true');
      pill.classList.add('nav-l0-pill-active');
      // Fade out current panel
      currentPanel.classList.remove('nav-l1-panel-active');
      // After fade completes (100ms), switch panels
      setTimeout(() => {
        currentPanel.hidden = true;
        openL1PanelMobile(
          nav,
          panel,
          pill,
          false,
          true,
        ); // Fade in new panel (pill already activated above)
      }, 100);
      return;
    }
  }
  // Desktop or no current panel: proceed normally
  closeAllL1Panels(nav);
  if (!panel) {
    console.error('toggleL1Panel: panel not found for id', panelId);
    return;
  }
  // Activate the pill
  pill.setAttribute('aria-expanded', 'true');
  pill.classList.add('nav-l0-pill-active');
  // Desktop: animate in
  if (isDesktop.matches) {
    // Step 1: Show panel (display: block)
    panel.hidden = false;
    // Step 2: Force reflow to ensure display change is registered
    const height = panel.offsetHeight; // eslint-disable-line no-unused-vars
    // Step 3: Add active class to trigger animation
    requestAnimationFrame(() => {
      panel.classList.add('nav-l1-panel-active');
      // Step 4: Move focus to first focusable element after animation starts
      // Wait for animation to complete (350ms) before shifting focus
      setTimeout(() => {
        // Priority: first link/button in nav-l1-list, fallback to close button
        const firstFocusable = panel.querySelector(
          '.nav-l1-list a, .nav-l1-list button',
        )
          || panel.querySelector('.nav-l1-close-button');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 350);
    });
  } else if (skipAnimation) {
    // Instant show without animation
    panel.hidden = false;
    panel.classList.add('nav-l1-panel-active');
    // Move focus immediately
    const firstFocusable = panel.querySelector(
      '.nav-l1-list a, .nav-l1-list button',
    )
        || panel.querySelector('.nav-l1-close-button');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  } else {
    // Step 1: Show panel (unhide) but keep it off-screen right
    panel.hidden = false;
    // Step 2: Force reflow
    const width = panel.offsetWidth; // eslint-disable-line no-unused-vars
    // Step 3: Trigger slide animation by adding active class (600ms total)
    requestAnimationFrame(() => {
      panel.classList.add('nav-l1-panel-active');
      // Step 4: Move focus after animation completes
      setTimeout(
        () => {
          const firstFocusable = panel.querySelector(
            '.nav-l1-list a, .nav-l1-list button',
          )
            || panel.querySelector('.nav-l1-close-button');
          if (firstFocusable) {
            firstFocusable.focus();
          }
        },
        600,
      ); // Wait for both animations: 300ms height + 300ms slide = 600ms total (Apple iOS timing)
    });
  }
}
/**
 * Toggle a specific L2 panel from an L1 button click.
 *
 * @param {HTMLElement} l1Panel - The containing L1 panel
 * @param {HTMLElement} btn - The L1 item button that was clicked
 */
function toggleL2Panel(l1Panel, btn) {
  const panelId = btn.getAttribute('aria-controls');
  // L2 panels are siblings of L1 - scope search based on viewport
  const nav = l1Panel.closest('nav');
  const panelContainer = isDesktop.matches
    ? nav.querySelector('.nav-sections')
    : nav.querySelector('.nav-drawer');
  const panel = panelContainer?.querySelector(`#${panelId}`);
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    if (isDesktop.matches) {
      // Desktop: animate out
      panel.classList.remove('nav-l2-panel-active');
      // Remove class from L1 panel to show its close button
      l1Panel.classList.remove('has-active-l2');
      // Wait for animation, then hide
      setTimeout(() => {
        panel.hidden = true;
      }, 350);
    } else {
      // Mobile: slide out to right (300ms) and slide L1 back in
      const drawerInner = nav.querySelector('.nav-drawer-inner');
      if (drawerInner) {
        drawerInner.classList.remove('nav-drawer-l2-active');
      }
      panel.classList.remove('nav-l2-panel-active');
      // Don't set hidden on mobile - let it stay off-screen with translateX(100%)
      // This allows the opening animation to work properly
    }
    btn.setAttribute('aria-expanded', 'false');
    // Return focus to the button that opened the panel
    btn.focus();
    return;
  }
  closeAllL2Panels(l1Panel);
  if (!panel) {
    console.error('toggleL2Panel: panel not found for id', panelId);
    return;
  }
  // Desktop: animate in
  if (isDesktop.matches) {
    // Step 1: Show panel
    panel.hidden = false;
    // Step 2: Force reflow to ensure hidden removal is registered
    const height = panel.offsetHeight; // eslint-disable-line no-unused-vars
    // Step 3: Add active class in next frame to trigger animation
    requestAnimationFrame(() => {
      panel.classList.add('nav-l2-panel-active');
      // Add class to L1 panel to hide its close button
      l1Panel.classList.add('has-active-l2');
      // Step 4: Move focus to first link in L2 panel (after animation starts)
      const firstLink = panel.querySelector('.nav-l2-list a');
      if (firstLink) {
        firstLink.focus();
      }
    });
  } else {
    // Mobile: slide in from right (300ms)
    // Push L1 content left while L2 slides in
    const drawerInner = nav.querySelector('.nav-drawer-inner');
    if (drawerInner) {
      drawerInner.classList.add('nav-drawer-l2-active');
    }
    // Check if this is the first time opening (panel has hidden attribute)
    const isFirstOpen = panel.hidden === true;
    // Remove hidden to make panel part of layout
    panel.hidden = false;
    if (isFirstOpen) {
      // First open: panel needs to be positioned off-screen first
      // Force a reflow so browser renders it at translateX(100%)
      const height = panel.offsetHeight; // eslint-disable-line no-unused-vars
      // Use setTimeout to let browser paint the off-screen position
      setTimeout(() => {
        panel.classList.add('nav-l2-panel-active');
        setTimeout(() => {
          const firstLink = panel.querySelector('.nav-l2-list a');
          if (firstLink) firstLink.focus();
        }, 50);
      }, 10);
    } else {
      // Subsequent opens: panel is already off-screen at translateX(100%)
      // Can add active class immediately to trigger animation
      panel.classList.add('nav-l2-panel-active');
      setTimeout(() => {
        const firstLink = panel.querySelector('.nav-l2-list a');
        if (firstLink) firstLink.focus();
      }, 50);
    }
  }
  btn.setAttribute('aria-expanded', 'true');
}

/**
 * Find which L0 pill should be active based on URL or default to first.
 * Matches URL keywords against first L1 link in each pill's panel.
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {string} [customURL] - Optional URL for testing (defaults to window.location.href)
 * @returns {HTMLElement|null} The pill that should be active, or null
 */
function findActivePillFromURL(nav, customURL) {
  // Check for stored simulated URL first (used in Storybook stories)
  const simulatedURL = nav?.getAttribute('data-simulated-url');
  const currentURL = (customURL || simulatedURL || window.location.href).toLowerCase();
  const sectionKeywords = ['personal-banking', 'business-banking', 'corporate-banking'];

  // Find which section keyword exists in the URL
  const matchedKeyword = sectionKeywords.find((keyword) => currentURL.includes(keyword));

  const pills = nav.querySelectorAll('.nav-l0-pill');

  // If URL matches a keyword, find the matching pill
  if (matchedKeyword) {
    const matchingPill = Array.from(pills).find((pill) => {
      const panelId = pill.getAttribute('aria-controls');
      // Find the corresponding L1 panel
      const panelContainer = nav.querySelector('.nav-sections') || nav.querySelector('.nav-drawer');
      const panel = panelContainer?.querySelector(`#${panelId}`);
      // Get the first nav-l1-link href in this panel
      const firstLink = panel?.querySelector('.nav-l1-link');
      if (firstLink) {
        const linkHref = firstLink.getAttribute('href')?.toLowerCase() || '';
        // Check if the matched keyword exists in this link's href
        return linkHref.includes(matchedKeyword);
      }
      return false;
    });

    if (matchingPill) {
      return matchingPill; // Found URL match
    }
  }

  // No URL match - return first pill as default
  return pills[0] || null;
}
/**
 * Open or close the mobile nav drawer.
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {boolean} [forceOpen] - Force open (true) or close (false); toggles if omitted
 */
function toggleMobileDrawer(nav, forceOpen) {
  const drawer = nav.querySelector('.nav-drawer');
  const hamburger = nav.querySelector('.nav-hamburger');
  const isOpen = nav.getAttribute('aria-expanded') === 'true';
  const open = forceOpen !== undefined ? forceOpen : !isOpen;
  nav.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden', String(!open));
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close navigation menu'
    : 'Open navigation menu');
  document.body.style.overflowY = open ? 'hidden' : '';
  if (!open) {
    closeAllL1Panels(nav);
    // eslint-disable-next-line no-use-before-define
    toggleSignIn(nav, false);
    // Reset floating signin button auto-expansion when drawer closes
    const floatContainer = nav.querySelector('.nav-drawer-signin-float');
    if (floatContainer) {
      floatContainer.classList.remove('nav-drawer-auto-expanded');
    }
  } else if (!isDesktop.matches) {
    const drawerMobile = nav.querySelector('.nav-drawer');

    // FIRST: Close all panels to ensure clean state
    const allMobilePills = drawerMobile.querySelectorAll('.nav-l0-pill');
    const allMobilePanels = drawerMobile.querySelectorAll('.nav-l1-panel');

    allMobilePills.forEach((p) => {
      p.setAttribute('aria-expanded', 'false');
      p.classList.remove('nav-l0-pill-active');
    });

    allMobilePanels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove('nav-l1-panel-active');
    });

    // Find which pill should be active based on URL match or default to first
    const activePill = findActivePillFromURL(nav);

    // Get the mobile version of this pill (findActivePillFromURL might return desktop pill)
    // Pills have the same aria-controls value in both mobile and desktop
    const pillId = activePill?.getAttribute('aria-controls');

    const mobilePill = pillId ? drawerMobile.querySelector(`[aria-controls="${pillId}"]`) : null;

    if (mobilePill) {
      const panelId = mobilePill.getAttribute('aria-controls');
      const activePanel = drawerMobile.querySelector(`#${panelId}`);

      if (activePanel) {
        // Activate the URL-matched or default pill/panel
        mobilePill.setAttribute('aria-expanded', 'true');
        mobilePill.classList.add('nav-l0-pill-active');
        activePanel.hidden = false;
        activePanel.classList.add('nav-l1-panel-active');
      }
    }

    // Add class after auto-expansion animation completes (1600ms total)
    // Timeline: 300ms drawer + 600ms bubble + 100ms pause + 600ms expansion = 1600ms
    const floatContainer = drawerMobile.querySelector('.nav-drawer-signin-float');
    if (floatContainer) {
      setTimeout(() => {
        floatContainer.classList.add('nav-drawer-auto-expanded');
      }, 1600);
    }
  }
}

/**
 * Start voice search using Web Speech API.
 *
 * @param {HTMLElement} nav - Root nav element
 */
function startVoiceSearch(nav) {
  const searchInput = nav.querySelector('.nav-search-input');
  const micBtn = nav.querySelector('.nav-search-mic-button');

  if (!searchInput || !micBtn) return;

  // Check for Web Speech API support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('[Header] Web Speech API not supported in this browser');
    alert('Voice search is not supported in your browser. Please try Chrome, Edge, or Safari.');
    return;
  }

  // If already recording, stop it
  if (nav.activeRecognition) {
    nav.activeRecognition.stop();
    nav.activeRecognition = null;
    if (nav.silenceTimeout) {
      clearTimeout(nav.silenceTimeout);
      nav.silenceTimeout = null;
    }
    micBtn.classList.remove('nav-search-mic-active');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-AU'; // Australian English
  recognition.interimResults = true; // Enable interim results for silence detection
  recognition.maxAlternatives = 1;
  recognition.continuous = true; // Keep listening for multiple phrases

  let silenceTimeout = null;
  let finalTranscript = '';

  // Visual feedback: mic is active
  micBtn.classList.add('nav-search-mic-active');

  // Function to reset silence timeout
  const resetSilenceTimeout = () => {
    if (silenceTimeout) {
      clearTimeout(silenceTimeout);
    }
    // Stop after 3 seconds of silence
    silenceTimeout = setTimeout(() => {
      recognition.stop();
    }, 3000);
    nav.silenceTimeout = silenceTimeout;
  };

  // Start initial silence timeout
  resetSilenceTimeout();

  recognition.onresult = (event) => {
    let interimTranscript = '';

    // Process all results
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const { transcript } = event.results[i][0];
      if (event.results[i].isFinal) {
        finalTranscript += `${transcript} `;
      } else {
        interimTranscript += transcript;
      }
    }

    // Update input with final + interim text
    searchInput.value = (finalTranscript + interimTranscript).trim();

    // Toggle mic/clear button visibility based on content
    toggleSearchButtons(nav);

    // Reset silence timeout on any speech detected
    resetSilenceTimeout();
  };

  recognition.onerror = (event) => {
    console.error('[Header] Voice recognition error:', event.error);
    micBtn.classList.remove('nav-search-mic-active');

    // Clear silence timeout
    if (silenceTimeout) {
      clearTimeout(silenceTimeout);
      nav.silenceTimeout = null;
    }

    // User-friendly error messages
    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      alert('Microphone access was denied. Please enable microphone permissions in your browser settings.');
    } else if (event.error === 'no-speech') {
      // Silent error - just stop
    } else if (event.error === 'aborted') {
      // Normal stop - don't show error
    } else {
      alert(`Voice search error: ${event.error}`);
    }

    nav.activeRecognition = null;
  };

  recognition.onend = () => {
    micBtn.classList.remove('nav-search-mic-active');

    // Clear silence timeout
    if (silenceTimeout) {
      clearTimeout(silenceTimeout);
      nav.silenceTimeout = null;
    }

    // Clean up final transcript
    if (searchInput.value) {
      searchInput.value = searchInput.value.trim();
    }

    nav.activeRecognition = null;
  };

  // Start recognition
  try {
    recognition.start();
    nav.activeRecognition = recognition;
  } catch (error) {
    console.error('[Header] Failed to start voice recognition:', error);
    micBtn.classList.remove('nav-search-mic-active');
    if (silenceTimeout) {
      clearTimeout(silenceTimeout);
      nav.silenceTimeout = null;
    }
  }
}

/**
 * Toggle the sign-in panel (State 3 animation: expands, replaces sign-in button).
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {boolean} [forceOpen] - Force open or close; toggles if omitted
 */
function toggleSignIn(nav, forceOpen) {
  const signInSlot = nav.querySelector('.nav-sign-in-slot');
  if (!signInSlot) return;
  const isOpen = signInSlot.getAttribute('aria-expanded') === 'true';
  const open = forceOpen !== undefined ? forceOpen : !isOpen;
  signInSlot.setAttribute('aria-expanded', String(open));
  signInSlot.classList.toggle('nav-sign-in-slot-expanded', open);
  const trigger = signInSlot.querySelector('.nav-sign-in-button');
  if (trigger) {
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Close sign in options' : trigger
      .dataset.label || 'Sign In');
  }
}
/**
 * Expand floating sign-in button to show card with links
 *
 * @param {HTMLElement} nav - Root nav element
 */
function expandSignInFloat(nav) {
  const floatContainer = nav.querySelector('.nav-drawer-signin-float');
  const button = nav.querySelector('.nav-drawer-signin-button');
  const card = nav.querySelector('.nav-drawer-signin-card');
  if (!floatContainer || !button || !card) return;
  // Update aria attributes
  button.setAttribute('aria-expanded', 'true');
  // Show card with animation
  floatContainer.classList.add('nav-drawer-signin-expanded');
  card.removeAttribute('hidden');
  // Focus management: move focus to first link after animation
  setTimeout(() => {
    const firstLink = card.querySelector('.nav-drawer-signin-card-link');
    const closeButton = card.querySelector('.nav-drawer-signin-card-close');
    // Focus first link if available, otherwise close button
    if (firstLink) {
      firstLink.focus();
    } else if (closeButton) {
      closeButton.focus();
    }
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Sign in menu opened. Use tab to navigate options.';
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }, 100);
}
/**
 * Collapse floating sign-in card back to button
 *
 * @param {HTMLElement} nav - Root nav element
 */
function collapseSignInFloat(nav) {
  const floatContainer = nav.querySelector('.nav-drawer-signin-float');
  const button = nav.querySelector('.nav-drawer-signin-button');
  const card = nav.querySelector('.nav-drawer-signin-card');
  if (!floatContainer || !button || !card) return;
  // Update aria attributes
  button.setAttribute('aria-expanded', 'false');
  // Add collapsing class to trigger animations
  floatContainer.classList.remove('nav-drawer-signin-expanded');
  floatContainer.classList.add('nav-drawer-signin-collapsing');
  // Return focus to button
  button.focus();
  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = 'Sign in menu closed.';
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
  // After animation completes (300ms), clean up
  setTimeout(() => {
    floatContainer.classList.remove('nav-drawer-signin-collapsing');
    card.setAttribute('hidden', '');
  }, 300);
  // Return focus to button
  button.focus();
}
/**
 * Move the sign-in content into the nav, preserving UE instrumentation.
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {HTMLElement|null} signInSection - The sign-in section from the fragment
 */
export function populateSignInSlot(nav, signInSection) {
  const desktopSlot = nav.querySelector('.nav-tools');
  // Extract sign-in data if available
  const signInButton = signInSection?.querySelector('.button.primary');
  // Selector covers: AEM author (data-aue-type/data-richtext-model attrs) and aem.live (plain <ul>)
  const loginLinks = signInSection?.querySelector(
    '[data-aue-type="richtext"] ul, ul[data-richtext-model], ul',
  );
  const buttonLabel = signInButton ? signInButton.textContent.trim()
    : 'Sign In';
  const buttonHref = signInButton ? signInButton.getAttribute('href') : '#';
  // Build mobile sign-in slot (only if we have signInSection data)
  if (signInSection) {
    const mobileSignIn = document.createElement('div');
    mobileSignIn.className = 'nav-sign-in-slot';
    mobileSignIn.setAttribute('aria-expanded', 'false');
    const loginLinksHTML = loginLinks ? loginLinks.outerHTML : '';
    mobileSignIn.innerHTML = `
      <button
        class="nav-sign-in-button"
        type="button"
        aria-expanded="false"
        data-label="${buttonLabel}"
      >
        ${buttonLabel}
        <span class="nav-sign-in-icon" aria-hidden="true"></span>
      </button>
      <div class="nav-sign-in-panel" hidden>
        ${loginLinksHTML}
      </div>`;
    // Replace placeholder slot in mobile drawer
    const existingMobileSlot = nav.querySelector(
      '.nav-drawer .nav-sign-in-slot',
    );
    if (existingMobileSlot) {
      moveInstrumentation(signInSection, mobileSignIn);
      existingMobileSlot.replaceWith(mobileSignIn);
    }
    // Populate floating signin card with login links (if it exists)
    const floatingCard = nav.querySelector('.nav-drawer-signin-card-links');
    if (floatingCard && loginLinks) {
      // Extract links from the loginLinks ul element
      const links = Array.from(loginLinks.querySelectorAll('a'));
      if (links.length > 0) {
        floatingCard.innerHTML = links.map((link) => {
          const href = link.getAttribute('href') || '#';
          const text = link.textContent.trim();
          return `<a href="${href}" class="nav-drawer-signin-card-link">${text}</a>`;
        }).join('');
      }
    }
  }
  // Build desktop tools: dropdown + sign-in button + search icon
  // Only create if we have sign-in links
  if (desktopSlot && loginLinks) {
    // Extract links from loginLinks to build dropdown options
    const links = Array.from(loginLinks.querySelectorAll('a'));
    if (links.length > 0) {
      // Wrapper for dropdown + sign-in button
      const actionsWrapper = document.createElement('div');
      actionsWrapper.className = 'nav-actions-wrapper';
      // 1. Banking dropdown selector (native select element)
      const selectWrapper = document.createElement('div');
      selectWrapper.className = 'nav-banking-dropdown-wrapper';
      const select = document.createElement('select');
      select.className = 'nav-banking-dropdown';
      select.setAttribute('aria-label', 'Select banking type');
      select.innerHTML = links.map((link, index) => {
        const text = link.textContent.trim();
        const href = link.getAttribute('href') || '#';
        return `<option value="${index}" data-href="${href}">${text}</option>`;
      }).join('');
      selectWrapper.append(select);
      actionsWrapper.append(selectWrapper);
      // 2. Sign in button
      const desktopButton = document.createElement('a');
      desktopButton.className = 'nav-sign-in-button button primary';
      desktopButton.href = buttonHref || '#';
      desktopButton.textContent = buttonLabel;
      desktopButton.setAttribute(
        'aria-label',
        `${buttonLabel} - Access your account`,
      );
      actionsWrapper.append(desktopButton);
      desktopSlot.append(actionsWrapper);
    }
    // 3. Search icon button (always create, independent of sign-in links)
    const searchButton = document.createElement('button');
    searchButton.id = 'nav-search';
    searchButton.className = 'nav-search-button';
    searchButton.type = 'button';
    searchButton.setAttribute('aria-label', 'Search');
    searchButton.innerHTML = '<i class="gel-icon gel-icon-search" aria-hidden="true"></i>';
    desktopSlot.append(searchButton);
  } else if (desktopSlot) {
    // No sign-in links, but still add search button
    const searchButton = document.createElement('button');
    searchButton.id = 'nav-search';
    searchButton.className = 'nav-search-button';
    searchButton.type = 'button';
    searchButton.setAttribute('aria-label', 'Search');
    searchButton.innerHTML = '<i class="gel-icon gel-icon-search" aria-hidden="true"></i>';
    desktopSlot.append(searchButton);
  }
}
/**
 * Convert feature-list icons to outlined variants for header usage.
 * Adds "-outlined" suffix to gel-icon class names if not already present.
 *
 * @param {HTMLElement} quickLinksEl - The feature-list element containing icons
 */
function convertIconsToOutlined(quickLinksEl) {
  const icons = quickLinksEl.querySelectorAll('.feature-list-icon-wrapper i.gel-icon');
  icons.forEach((icon) => {
    // Get all classes from the icon
    const classes = Array.from(icon.classList);

    // Find the gel-icon-* class (e.g., "gel-icon-gift")
    const iconClass = classes.find((cls) => cls.startsWith('gel-icon-') && cls !== 'gel-icon');

    if (iconClass && !iconClass.endsWith('-outlined')) {
      // Remove the old icon class
      icon.classList.remove(iconClass);
      // Add the new outlined variant
      icon.classList.add(`${iconClass}-outlined`);
    }
  });
}

/**
 * Move quick links content into the mobile drawer slot.
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {HTMLElement|null} quickLinksEl - The feature-list element from the fragment
 * @param {HTMLElement|null} quickLinksSection - Original section for UE instrumentation
 */
export function populateQuickLinksSlot(nav, quickLinksEl, quickLinksSection) {
  const slot = nav.querySelector('.nav-drawer .nav-quick-links-slot');
  if (!slot) return;
  // If no quick links, hide the slot to avoid showing empty spacing
  if (!quickLinksEl) {
    slot.style.display = 'none';
    return;
  }
  // Convert icons to outlined variants
  convertIconsToOutlined(quickLinksEl);
  moveInstrumentation(quickLinksSection || quickLinksEl, quickLinksEl);
  slot.append(quickLinksEl);
  slot.style.display = ''; // Ensure it's visible
}
/**
 * Clone and inject quick links into all L1 panels (desktop only)
 *
 * @param {HTMLElement} nav - Root nav element
 * @param {HTMLElement|null} quickLinksEl - The feature-list element from the fragment
 */
export function populateL1QuickLinks(nav, quickLinksEl) {
  const l1Slots = nav.querySelectorAll(
    '.nav-l1-panel .nav-l1-quick-links-slot',
  );
  // If no quick links, hide all slots to avoid showing empty borders/spacing
  if (!quickLinksEl) {
    l1Slots.forEach((slot) => {
      slot.style.display = 'none';
    });
    return;
  }
  l1Slots.forEach((slot) => {
    const clone = quickLinksEl.cloneNode(true);
    // Convert icons to outlined variants
    convertIconsToOutlined(clone);
    slot.append(clone);
    slot.style.display = ''; // Ensure it's visible
  });
}
// =============================================================================
// Event Binding
// =============================================================================
/**
 * Show/hide the mobile back button depending on whether an L2 panel is open.
 * Figma: back button has opacity-0 at L1 level, visible when L2 is open.
 */
/**
 * Initialize all keyboard and click event handlers for the nav element.
 *
 * @param {HTMLElement} nav - Root nav element
 */
function initEventHandlers(nav) {
  // Skip to search link: prevent default and focus search button
  nav.querySelector('.skip-link-search')?.addEventListener('click', (e) => {
    e.preventDefault();
    const searchButton = document.getElementById('nav-search');
    if (searchButton) {
      searchButton.focus();
    }
  });

  // Hamburger: open/close mobile drawer
  nav.querySelector('.nav-hamburger')?.addEventListener('click', () => {
    toggleMobileDrawer(nav);
  });
  // Drawer close button: close drawer
  nav.querySelector('.nav-drawer-close-button')?.addEventListener('click', () => {
    closeAllL1Panels(nav);
    toggleMobileDrawer(nav, false);
  });
  // Back button: close L2 and return to L1 on mobile
  nav.querySelector('.nav-back-button')?.addEventListener('click', () => {
    const openL2 = nav.querySelector('.nav-l2-panel:not([hidden])');
    if (openL2) {
      openL2.hidden = true;
      const l1Btn = nav.querySelector(
        '.nav-l1-button[aria-expanded="true"]',
      );
      if (l1Btn) l1Btn.setAttribute('aria-expanded', 'false');
    }
  });
  // Overlay: click to close drawer or L1 panels
  nav.querySelector('.nav-overlay')?.addEventListener('click', async (e) => {
    e.stopPropagation(); // Prevent event bubbling

    // Find the active panel and its pill to return focus
    const activeL1 = nav.querySelector('.nav-l1-panel:not([hidden])');
    if (activeL1) {
      // Close any open L2 panels first (150ms animation)
      await closeAllL2Panels(activeL1);
      // Then close L1 panel (150ms animation)
      const pill = nav.querySelector(`[aria-controls="${activeL1.id}"]`);
      closeAllL1Panels(nav, pill); // Return focus to the pill
    } else {
      closeAllL1Panels(nav);
    }
    toggleMobileDrawer(nav, false);
  });

  // Search overlay: click to close search panel
  nav.querySelector('.nav-search-overlay')?.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    closeSearchPanel(nav, true); // Close and return focus to search button
  });
  // L0 pills: open/close L1 panels
  nav.addEventListener('click', (e) => {
    const pill = e.target.closest('.nav-l0-pill');
    if (!pill) return;
    toggleL1Panel(nav, pill);
  });
  // L1 close buttons: close panel (and drawer on mobile)
  nav.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.nav-l1-close-button');
    if (!closeBtn) return;
    // Find which panel this close button belongs to, then find its pill
    const panel = closeBtn.closest('.nav-l1-panel');
    if (panel) {
      const panelId = panel.id;
      const pill = nav.querySelector(`[aria-controls="${panelId}"]`);
      closeAllL1Panels(nav, pill); // Return focus to the pill
    } else {
      closeAllL1Panels(nav);
    }
    if (!isDesktop.matches) toggleMobileDrawer(nav, false);
  });
  // L1 item buttons: open/close L2 panels
  nav.addEventListener('click', (e) => {
    const l1Btn = e.target.closest('.nav-l1-button');
    if (!l1Btn) return;
    const l1Panel = l1Btn.closest('.nav-l1-panel');
    if (!l1Panel) return;
    toggleL2Panel(l1Panel, l1Btn);
  });
  // L2 back buttons: close L2 panel
  nav.addEventListener('click', (e) => {
    const backBtn = e.target.closest('.nav-l2-back-button');
    if (!backBtn) return;
    const l2Panel = backBtn.closest('.nav-l2-panel');
    // Scope L1 button search by viewport (mobile = drawer, desktop = nav-sections)
    const panelContainer = isDesktop.matches
      ? nav.querySelector('.nav-sections')
      : nav.querySelector('.nav-drawer');
    const l1Btn = panelContainer?.querySelector(
      `[aria-controls="${l2Panel?.id}"]`,
    );
    // Update aria-expanded IMMEDIATELY to rotate chevron back
    if (l1Btn) {
      l1Btn.setAttribute('aria-expanded', 'false');
    }
    if (l2Panel) {
      if (!isDesktop.matches) {
        // Mobile: animate slide out to right (300ms) while L1 slides back in
        const drawerInner = nav.querySelector('.nav-drawer-inner');
        if (drawerInner) {
          drawerInner.classList.remove('nav-drawer-l2-active');
        }
        l2Panel.classList.remove('nav-l2-panel-active');
        // Don't set hidden - let it stay off-screen with translateX(100%)
        // Focus L1 button after animation completes
        setTimeout(() => {
          if (l1Btn) l1Btn.focus();
        }, 300);
      } else {
        // Desktop: instant (back button shouldn't show on desktop, but handle it)
        l2Panel.hidden = true;
        if (l1Btn) l1Btn.focus();
      }
    }
  });
  // L2 close buttons: close L2, L1, and entire drawer
  nav.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.nav-l2-close-button');
    if (!closeBtn) return;
    const l2Panel = closeBtn.closest('.nav-l2-panel');
    // Find the L1 panel and button
    const panelContainer = isDesktop.matches
      ? nav.querySelector('.nav-sections')
      : nav.querySelector('.nav-drawer');
    const l1Btn = panelContainer?.querySelector(
      `[aria-controls="${l2Panel?.id}"]`,
    );
    const l1Panel = l1Btn?.closest('.nav-l1-panel');
    // Close L2 panel first
    if (l2Panel && !isDesktop.matches) {
      const drawerInner = nav.querySelector('.nav-drawer-inner');
      if (drawerInner) {
        drawerInner.classList.remove('nav-drawer-l2-active');
      }
      l2Panel.classList.remove('nav-l2-panel-active');
      if (l1Btn) l1Btn.setAttribute('aria-expanded', 'false');
    }
    // Then close L1 panels
    if (l1Panel) {
      const panelId = l1Panel.id;
      const pill = nav.querySelector(`[aria-controls="${panelId}"]`);
      closeAllL1Panels(nav, pill);
    } else {
      closeAllL1Panels(nav);
    }
    // Finally close the entire mobile drawer
    if (!isDesktop.matches) toggleMobileDrawer(nav, false);
  });
  // Sign-in button: toggle sign-in panel (mobile)
  nav.addEventListener('click', (e) => {
    const signInBtn = e.target.closest('.nav-sign-in-button');
    if (!signInBtn) return;
    toggleSignIn(nav);
  });
  // Floating sign-in button: expand to show card
  nav.addEventListener('click', (e) => {
    const floatingSignInBtn = e.target.closest('.nav-drawer-signin-button');
    if (!floatingSignInBtn) return;
    expandSignInFloat(nav);
  });
  // Sign-in card close button: collapse back to button
  nav.addEventListener('click', (e) => {
    const cardCloseBtn = e.target.closest('.nav-drawer-signin-card-close');
    if (!cardCloseBtn) return;
    collapseSignInFloat(nav);
  });
  // Banking dropdown: handle native select change
  // nav.addEventListener('change', (e) => {
  //   const select = e.target.closest('.nav-banking-dropdown');
  //   if (!select) return;
  //   // Value change is automatic with native select
  //   // Could trigger navigation or other actions here if needed
  // });

  // Search button (desktop and mobile): toggle search panel
  nav.addEventListener('click', (e) => {
    const searchBtn = e.target.closest('.nav-search-button');
    if (!searchBtn) return;

    // Desktop button
    if (searchBtn.classList.contains('nav-search-button-mobile') === false && isDesktop.matches) {
      const searchPanel = nav.querySelector('.nav-search-panel.nav-search-panel-active');
      if (searchPanel) {
        closeSearchPanel(nav);
      } else {
        // Only focus input if activated via keyboard (Enter/Space), not mouse click
        const isKeyboardActivation = e.detail === 0;
        openSearchPanel(nav, isKeyboardActivation);
      }
    }

    // Mobile button
    if (searchBtn.classList.contains('nav-search-button-mobile') && !isDesktop.matches) {
      const searchPanel = nav.querySelector('.nav-search-panel.nav-search-panel-active');
      if (searchPanel) {
        closeSearchPanel(nav);
      } else {
        // Only focus input if activated via keyboard (Enter/Space), not mouse click
        const isKeyboardActivation = e.detail === 0;
        openSearchPanel(nav, isKeyboardActivation);
      }
    }
  });

  // Search panel close button: close search panel
  nav.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.nav-search-close-button');
    if (!closeBtn) return;
    closeSearchPanel(nav);
  });

  // Search panel mic button: start voice recognition
  nav.addEventListener('click', (e) => {
    const micBtn = e.target.closest('.nav-search-mic-button');
    if (!micBtn) return;
    startVoiceSearch(nav);
  });

  // Search panel clear button: clear input text
  nav.addEventListener('click', (e) => {
    const clearBtn = e.target.closest('.nav-search-clear-button');
    if (!clearBtn) return;
    const searchInput = nav.querySelector('.nav-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
      toggleSearchButtons(nav); // Update button visibility
    }
  });

  // Search input: toggle mic/clear button based on content
  nav.addEventListener('input', (e) => {
    const searchInput = e.target.closest('.nav-search-input');
    if (!searchInput) return;
    toggleSearchButtons(nav);
  });

  // Search panel mic button: remove input focus when tabbed to
  nav.addEventListener('focusin', (e) => {
    const micBtn = e.target.closest('.nav-search-mic-button');
    if (!micBtn) return;
    const searchInput = nav.querySelector('.nav-search-input');
    if (searchInput && document.activeElement === micBtn) {
      searchInput.blur();
    }
  });

  // Search panel clear button: remove input focus when tabbed to
  nav.addEventListener('focusin', (e) => {
    const clearBtn = e.target.closest('.nav-search-clear-button');
    if (!clearBtn) return;
    const searchInput = nav.querySelector('.nav-search-input');
    if (searchInput && document.activeElement === clearBtn) {
      searchInput.blur();
    }
  });

  // Escape key: close active panel or entire drawer
  nav.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;

    // Check if search panel is open (desktop and mobile)
    const searchPanel = nav.querySelector('.nav-search-panel.nav-search-panel-active');
    if (searchPanel) {
      closeSearchPanel(nav, true); // Close and return focus to search button
      if (isDesktop.matches) {
        closeAllL1Panels(nav); // Also close any L1/L2 panels on desktop
      }
      return;
    }

    // Check if floating sign-in card is open (mobile only)
    const signinCard = nav.querySelector(
      '.nav-drawer-signin-card:not([hidden])',
    );
    if (signinCard && !isDesktop.matches) {
      collapseSignInFloat(nav);
      return;
    }
    // Mobile: Escape always closes the entire drawer (since first panel is always active)
    if (!isDesktop.matches) {
      toggleMobileDrawer(nav, false);
      nav.querySelector('.nav-hamburger')?.focus();
      return;
    }
    // Desktop only: hierarchical panel closing
    // Close L2 panel first if open
    const activeL2 = nav.querySelector('.nav-l2-panel:not([hidden])');
    if (activeL2) {
      const l1Btn = nav.querySelector(`[aria-controls="${activeL2.id}"]`);
      activeL2.hidden = true;
      if (l1Btn) {
        l1Btn.setAttribute('aria-expanded', 'false');
        l1Btn.focus();
      }
      return;
    }
    // Close L1 panel if open (with focus return)
    const activeL1 = nav.querySelector('.nav-l1-panel:not([hidden])');
    if (activeL1) {
      const pill = nav.querySelector(`[aria-controls="${activeL1.id}"]`);
      closeAllL1Panels(
        nav,
        pill,
      ); // Use the new closeAllL1Panels with focus return
    }
  });
  // Respond to viewport resize
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      toggleMobileDrawer(nav, false);
    }
  });
}
/**
 * Initialize header interaction handlers for an already-rendered nav element.
 * Useful for Storybook scenarios that bypass decorate().
 *
 * @param {HTMLElement} nav - Root nav element (#nav)
 */
export function initializeHeaderInteractions(nav) {
  if (!nav) return;
  initEventHandlers(nav);
}

/**
 * Set active state for L0 pill based on current URL.
 * Checks if URL contains banking section keywords and matches against
 * the first L1 link href in each section.
 *
 * @param {HTMLElement} nav - Root nav element (#nav)
 * @param {string} [customURL] - Optional URL for testing (defaults to window.location.href)
 */
export function setActivePillFromURL(nav, customURL) {
  // Store simulated URL on nav for later use (e.g., when mobile drawer opens)
  if (customURL) {
    nav.setAttribute('data-simulated-url', customURL);
  }

  const activePill = findActivePillFromURL(nav, customURL);

  if (activePill) {
    // Mark this pill as contextually active
    activePill.classList.add('nav-l0-pill-active');
    // Add data attribute to mark it as URL-based active
    activePill.setAttribute('data-url-active', 'true');
  }
}

// =============================================================================
// Decorate
// =============================================================================
/**
 * Load the nav fragment and decorate the header block.
 * This is the only function that mutates the DOM.
 *
 * @param {HTMLElement} block - The header block element
 */
export default async function decorate(block) {
  try {
    // Load nav fragment
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname
      : '/nav';

    const fragment = await loadFragment(navPath);

    if (!fragment) {
      return;
    }

    const data = extractNavDataFromFragment(fragment);

    // Build nav HTML
    block.innerHTML = renderHeaderHTML(data);

    const nav = block.querySelector('#nav');

    if (!nav) {
      return;
    }

    // Logo is now hard-coded, no need to populate from fragment
    // Inject quick links into mobile drawer
    populateQuickLinksSlot(nav, data.quickLinksEl, data.quickLinksSection);
    // Inject quick links into L1 panels (desktop)
    populateL1QuickLinks(nav, data.quickLinksEl);
    // Inject sign-in links into desktop tools + mobile drawer sign-in slot
    populateSignInSlot(nav, data.signInSection);
    // Bind all interaction events
    initializeHeaderInteractions(nav);
    // Set active pill based on current URL
    setActivePillFromURL(nav);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error decorating header:', error);
  }
}
