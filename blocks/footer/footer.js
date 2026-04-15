/**
 * Footer Block
 *
 * Authored table shape (rows):
 *   1-cell row [img]     → Logo
 *   1-cell row [text]    → Tagline (before nav)
 *   1-cell row [links]   → Social links (before nav)
 *   3-cell row           → Nav columns (heading + links per cell)
 *   1-cell row [links]   → Legal links (after nav)
 *   1-cell row [text]    → Copyright (after nav)
 *
 * Figma references:
 *   Light: docs/requirements/footer/figma/node-4-2395-footer-light.png
 *   Dark:  docs/requirements/footer/figma/node-5-4263-footer-dark.png
 */

// Map link text slugs to GEL icon class names
const SOCIAL_ICON_MAP = {
  facebook: 'gel-icon-facebook',
  twitter: 'gel-icon-twitter',
  instagram: 'gel-icon-instagram',
  linkedin: 'gel-icon-linkedin',
  youtube: 'gel-icon-youtube',
};

/**
 * Derive a GEL social icon class from a link's text label.
 * @param {string} text - Link text or aria-label
 * @returns {string|null} GEL icon class or null if no match
 */
function socialIconClass(text) {
  const slug = text.toLowerCase().trim();
  const match = Object.entries(SOCIAL_ICON_MAP).find(([key]) => slug.includes(key));
  return match ? match[1] : null;
}

/**
 * Parse the authored block DOM into a structured data object.
 * Scans rows, identifies the 3-cell nav row as the pivot point, then
 * classifies single-cell rows by position and content type.
 *
 * @param {HTMLElement} block - The raw block element
 * @returns {{ logo, tagline, socialLinks, navColumns, legalLinks, copyright }}
 */
function extractData(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = {
    logo: null,
    tagline: '',
    socialLinks: [],
    navColumns: [],
    legalLinks: [],
    copyright: '',
  };

  const navRowIdx = rows.findIndex((row) => row.children.length === 3);
  if (navRowIdx === -1) return data;

  const navRow = rows[navRowIdx];

  // Parse 3-cell nav columns
  data.navColumns = [...navRow.children].map((cell) => {
    const firstP = cell.querySelector('p');
    const heading = firstP && !firstP.querySelector('a') ? firstP.textContent.trim() : '';
    const links = [...cell.querySelectorAll('a')].map((a) => ({
      href: a.getAttribute('href') || '#',
      label: a.textContent.trim(),
    }));
    return { heading, links };
  });

  // Rows before nav: logo, tagline, social links
  rows.slice(0, navRowIdx).forEach((row) => {
    const cell = row.children[0];
    if (!cell) return;
    const img = cell.querySelector('img');
    const anchors = [...cell.querySelectorAll('a')];
    if (img && !data.logo) {
      data.logo = { src: img.src, alt: img.alt || 'Great Bank' };
    } else if (anchors.length > 0) {
      data.socialLinks = anchors.map((a) => ({
        href: a.getAttribute('href') || '#',
        label: a.getAttribute('aria-label') || a.textContent.trim(),
        text: a.textContent.trim(),
      }));
    } else {
      const text = cell.textContent.trim();
      if (text && !data.tagline) data.tagline = text;
    }
  });

  // Rows after nav: legal links, copyright
  rows.slice(navRowIdx + 1).forEach((row) => {
    const cell = row.children[0];
    if (!cell) return;
    const anchors = [...cell.querySelectorAll('a')];
    if (anchors.length > 0) {
      data.legalLinks = anchors.map((a) => ({
        href: a.getAttribute('href') || '#',
        label: a.textContent.trim(),
      }));
    } else {
      const text = cell.textContent.trim();
      if (text && !data.copyright) data.copyright = text;
    }
  });

  return data;
}

/**
 * Render the social icons row.
 * @param {Array} links - Social link objects
 * @returns {string} HTML string
 */
function renderSocialHTML(links) {
  if (!links.length) return '';
  const items = links
    .map(({ href, label, text }) => {
      const iconCls = socialIconClass(text || label);
      const icon = iconCls ? `<i class="gel-icon ${iconCls}" aria-hidden="true"></i>` : '';
      return `<a href="${href}" class="footer-social-link" aria-label="${label}" rel="noopener noreferrer" target="_blank">${icon}</a>`;
    })
    .join('');
  return `<div class="footer-social">${items}</div>`;
}

/**
 * Render the footer navigation columns.
 * @param {Array} columns - Nav column objects
 * @returns {string} HTML string
 */
function renderNavHTML(columns) {
  if (!columns.length) return '';
  const navItems = columns
    .map(({ heading, links }) => {
      const linkItems = links
        .map(({ href, label }) => `<li><a href="${href}">${label}</a></li>`)
        .join('');
      return `<nav aria-label="${heading}">
        <p class="footer-nav-heading">${heading}</p>
        <ul class="footer-nav-list">${linkItems}</ul>
      </nav>`;
    })
    .join('');
  return `<div class="footer-nav">${navItems}</div>`;
}

/**
 * Assemble the full footer inner HTML from structured data.
 * @param {{ logo, tagline, socialLinks, navColumns, legalLinks, copyright }} data
 * @returns {string} HTML string
 */
function renderHTML(data) {
  const logoHTML = data.logo
    ? `<img src="${data.logo.src}" alt="${data.logo.alt}" class="footer-logo-img">`
    : '';
  const taglineHTML = data.tagline
    ? `<p class="footer-tagline">${data.tagline}</p>`
    : '';
  const legalLinksHTML = data.legalLinks
    .map(({ href, label }) => `<a href="${href}">${label}</a>`)
    .join('');
  const copyright = data.copyright
    || `© ${new Date().getFullYear()} Great Bank. All rights reserved.`;

  return `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">${logoHTML}</div>
        ${taglineHTML}
        ${renderSocialHTML(data.socialLinks)}
      </div>
      ${renderNavHTML(data.navColumns)}
    </div>
    <div class="footer-legal-bar">
      <div class="footer-legal-inner">
        <nav class="footer-legal-links" aria-label="Legal">${legalLinksHTML}</nav>
        <p class="footer-copyright">${copyright}</p>
      </div>
    </div>`;
}

/**
 * Decorate the footer block.
 * Replaces the raw authored table rows with rendered semantic footer markup.
 * @param {HTMLElement} block - The block element (.footer.block)
 */
export default function decorate(block) {
  const data = extractData(block);
  block.innerHTML = renderHTML(data);
}
