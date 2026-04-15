/**
 * Breadcrumbs Block Component
 *
 * Implements a two-level breadcrumb navigation:
 * - Parent page > Current page
 * - Current page title from og:title meta property
 * - Parent page derived from URL structure
 * - Visibility controlled via showBreadcrumb page property
 * - Full accessibility support with ARIA navigation landmark
 *
 * Auto-injected via autoLoadBreadcrumbs() in scripts.js
 * @see blocks/breadcrumbs/breadcrumbs.md
 */

import { getMetadata } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Fetch metadata for a page path.
 * @param {string} path - Page path (e.g. /personal-banking)
 * @returns {Promise<{title: string|null, ogTitle: string|null}|null>} Metadata or null on failure
 */
async function getPageMetadata(path) {
  try {
    const res = await fetch(path, { credentials: 'same-origin' });
    if (!res.ok) return null;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const getMeta = (name) => doc
      .querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      ?.getAttribute('content')
      ?.trim() || null;

    return {
      title: doc.querySelector('title')?.textContent?.trim() || null,
      ogTitle: getMeta('og:title'),
    };
  } catch {
    return null;
  }
}

/**
 * Extract parent page path information from URL
 * @param {string} url - Current page URL
 * @returns {{path: string, metadataPath: string, fallbackName: string}|null} Parent page path data or null if no parent
 */
function extractParentFromUrl(url) {
  try {
    const urlObj = new URL(url);

    // Get path from query parameter if exists (Storybook), otherwise use pathname
    const path = urlObj.searchParams.get('path') || urlObj.pathname;
    const pathSegments = path.split('/').filter((segment) => segment !== '');

    // If at root or only one segment, no parent
    if (pathSegments.length <= 1) {
      return null;
    }

    // Check if last segment has an extension (e.g., .html)
    const lastSegment = pathSegments[pathSegments.length - 1];
    const extensionMatch = lastSegment.match(/\.[^.]+$/);
    const extension = extensionMatch ? extensionMatch[0] : '';

    // Get parent path (all segments except the last one)
    const parentSegments = pathSegments.slice(0, -1);
    const parentPath = `/${parentSegments.join('/')}${extension}`;

    // Build full parent URL with origin and query parameters
    const parentUrl = `${urlObj.origin}${parentPath}${urlObj.search}`;

    // Convert last parent segment to readable text
    // e.g., "personal-banking" -> "Personal Banking"
    // Remove extension if present for display name
    const parentSegmentName = parentSegments[parentSegments.length - 1]
      .replace(/\.[^.]+$/, '');
    const parentName = parentSegmentName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      path: parentUrl,
      metadataPath: parentPath,
      fallbackName: parentName,
    };
  } catch (error) {
    console.error('[breadcrumbs.js:extractParentFromUrl] Error parsing URL:', error);
    return null;
  }
}

/**
 * Extract breadcrumbs data from block attributes and metadata
 * @returns {Promise<Object>} Extracted data object
 */
async function extractData() {
  const currentUrl = window.location.href;

  let currentPath;
  try {
    const urlObj = new URL(currentUrl);
    currentPath = urlObj.searchParams.get('path') || urlObj.pathname;
  } catch {
    currentPath = window.location.pathname;
  }

  // Get current page title from og:title metadata, or extract from URL
  let currentPageTitle = getMetadata('og:title');

  if (!currentPageTitle) {
    const currentMetadata = await getPageMetadata(currentPath);
    currentPageTitle = currentMetadata?.ogTitle || currentMetadata?.title;
  }

  if (!currentPageTitle) {
    // No og:title, extract from URL
    try {
      const urlObj = new URL(currentUrl);

      // Get path from query parameter if exists (Storybook), otherwise use pathname
      const path = urlObj.searchParams.get('path') || urlObj.pathname;
      const segments = path.split('/').filter((segment) => segment !== '');
      const lastSegment = segments[segments.length - 1] || document.title;

      // Format last segment to readable text
      // e.g., "blocks-breadcrumbs--business-banking" -> "Business Banking"
      // or "personal-banking" -> "Personal Banking"
      currentPageTitle = lastSegment
        .replace(/^.*--/, '') // Remove everything before -- (for Storybook story names)
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch (error) {
      console.error('[breadcrumbs.js:extractData] Error extracting title from URL:', error);
      currentPageTitle = document.title;
    }
  }

  // Resolve parent page path from URL and fetch parent title metadata.
  const parentPathData = extractParentFromUrl(currentUrl);
  let parent = null;
  if (parentPathData) {
    const parentMetadata = await getPageMetadata(parentPathData.metadataPath);
    const parentTitle = parentMetadata?.ogTitle || parentMetadata?.title || parentPathData.fallbackName;

    parent = {
      path: parentPathData.path,
      name: parentTitle,
    };
  }

  const data = {
    currentPageTitle,
    parent,
  };
  return data;
}

// =============================================================================
// HTML Rendering
// =============================================================================

/**
 * Render breadcrumbs HTML
 * @param {Object} data - Extracted breadcrumbs data
 * @returns {string} HTML string for breadcrumbs
 */
function renderHTML(data) {
  if (!data.parent) {
    return '';
  }

  return `
    <div class="breadcrumbs-nav" role="navigation" aria-label="Breadcrumb">
      <ol class="breadcrumbs-list">
        <li class="breadcrumbs-item">
          <a href="${data.parent.path}">
            ${data.parent.name}
          </a>
        </li>
        <li class="breadcrumbs-item" aria-hidden="true">
          <i class="gel-icon gel-icon-arrow-right"></i>
        </li>
        <li class="breadcrumbs-item" aria-current="page">
          <span class="breadcrumbs-text">${data.currentPageTitle}</span>
        </li>
      </ol>
    </div>
  `;
}

// =============================================================================
// DOM Decoration
// =============================================================================

/**
 * Initialize and inject the breadcrumbs autoblock if enabled
 * @param {HTMLElement} main - The main element
 */
export function autoLoadBreadcrumbs(main) {
  const showBreadcrumb = getMetadata('showBreadcrumb') === 'true';

  if (!showBreadcrumb) {
    return;
  }

  // Create breadcrumb block element
  const breadcrumbBlock = document.createElement('div');
  breadcrumbBlock.className = 'block breadcrumbs';

  // Create a section wrapper for the block
  const section = document.createElement('div');
  section.className = 'section';
  section.appendChild(breadcrumbBlock);

  // Insert at the top of main, before existing sections
  const firstSection = main.querySelector('.section');
  if (firstSection) {
    firstSection.parentNode.insertBefore(section, firstSection);
  } else {
    main.insertBefore(section, main.firstChild);
  }
}

/**
 * Decorate the breadcrumbs block
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  const showBreadcrumbs = getMetadata('showBreadcrumb') === 'true';
  if (!showBreadcrumbs) {
    block.innerHTML = '';
    return;
  }

  // Extract data
  const data = await extractData();

  // Render HTML
  const html = renderHTML(data);

  // If no HTML (hidden or no parent), clear block
  if (!html) {
    block.innerHTML = '';
    return;
  }

  // Store original content for Universal Editor
  const originalContent = block.innerHTML;

  // Replace block content
  block.innerHTML = html;

  // Move Universal Editor instrumentation if it exists
  if (originalContent.includes('data-')) {
    moveInstrumentation(block, block.querySelector('.breadcrumbs-nav'));
  }
}
