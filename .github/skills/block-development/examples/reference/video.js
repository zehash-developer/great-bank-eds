/**
 * Video Block Component
 *
 * Displays single or multiple YouTube videos with optional captions and thumbnails.
 * Single video: Shows embedded player with optional caption.
 * Multiple videos: Shows carousel UI with thumbnails and main player.
 * Uses the standard EDS pattern: extractData → renderHTML → decorate
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  renderBlockHeader,
  getCellText,
  getCellHTML,
  getFirstCell,
} from '../../scripts/utility/shared.js';
import {
  initializeCarousel,
  renderCarouselContainer,
} from '../../scripts/utility/carousel.js';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract YouTube video ID from various URL formats or plain ID
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - Plain VIDEO_ID
 *
 * @param {string} input - YouTube URL or video ID
 * @returns {string} Extracted video ID or empty string
 */
function extractYouTubeVideoId(input) {
  console.log('extractYouTubeVideoId', 'line 35');
  console.log('input', input);

  if (!input) return '';

  const trimmed = input.trim();

  // Check if it's already a plain video ID (11 characters, alphanumeric with - and _)
  if (/^[\w-]{11}$/.test(trimmed)) {
    console.log('plain video ID detected', trimmed);
    return trimmed;
  }

  // Try to extract from youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    console.log('extracted from watch URL', watchMatch[1]);
    return watchMatch[1];
  }

  // Try to extract from youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    console.log('extracted from short URL', shortMatch[1]);
    return shortMatch[1];
  }

  // Try to extract from youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedMatch) {
    console.log('extracted from embed URL', embedMatch[1]);
    return embedMatch[1];
  }

  console.log('could not extract video ID, returning empty string');
  return '';
}

/**
 * Get YouTube thumbnail URL for a video ID
 * Uses YouTube's auto-generated thumbnail (maxresdefault or 0.jpg)
 *
 * @param {string} videoId - YouTube video ID
 * @returns {string} Thumbnail URL
 */
function getYouTubeThumbnailUrl(videoId) {
  console.log('getYouTubeThumbnailUrl', 'line 80');
  console.log('videoId', videoId);

  if (!videoId) return '';

  // Use maxresdefault for highest quality, fallback to 0.jpg
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// =============================================================================
// Data Extraction
// =============================================================================

/**
 * Extract video-item data from a DOM row.
 * Based on video block model:
 * - Single video: video-id(0) | caption(1)
 * - Multiple videos: video-id(0) | title(1) | thumbnail(2)
 *
 * @param {HTMLElement} row - The row element
 * @returns {Object|null} Extracted video-item data or null if invalid
 */
function extractVideoItemFromRow(row) {
  const cells = [...row.children];

  // Must have 2 cells for video-item structure
  if (cells.length < 2) {
    return null;
  }

  // Cell 0: video-id (required)
  const videoId = extractYouTubeVideoId(getCellText(cells[0])) || '';

  // Cell 1: title (required)
  const title = getCellText(cells[1]) || '';

  const thumbnailUrl = getYouTubeThumbnailUrl(videoId);
  const thumbnailAlt = title;

  return {
    videoId,
    title,
    thumbnail: {
      src: thumbnailUrl,
      alt: thumbnailAlt,
    },
    row, // Keep reference for moveInstrumentation
  };
}

/**
 * Extract block-level data from HTML structure.
 * Handles both Universal Editor (UE) and published modes:
 * - In UE: block-level fields (heading, info-text) may be stored as block properties
 *   and video-item components appear as rows
 * - In published/authored mode: heading(row 0) | info-text(row 1) | video items (rows 2+)
 *
 * @param {HTMLElement} block - The block element
 * @returns {Object} Extracted block data with videos array
 */
function extractData(block) {
  console.log('extractData', 'line 93');
  const rows = [...block.children];
  console.log('totalRows', rows.length);

  const data = {
    heading: getCellText(getFirstCell(rows[0])) || '',
    infoText: getCellText(getFirstCell(rows[1])) || '',
    caption: getCellHTML(getFirstCell(rows[2])) || '',
    videos: [],
    headingRow: rows[0], // Keep reference for moveInstrumentation
    infoTextRow: rows[1], // Keep reference for moveInstrumentation,
    captionRow: rows[2], // Keep reference for moveInstrumentation
  };

  // Extract video items from remaining rows (starting at row 3)
  data.videos = rows
    .slice(3)
    .map(extractVideoItemFromRow)
    .filter(Boolean);

  console.log('extractedData', data);
  return data;
}

// =============================================================================
// Render
// =============================================================================

/**
 * Render YouTube iframe embed (with native lazy loading)
 *
 * @param {string} videoId - YouTube video ID
 * @param {string} title - Video title for accessibility
 * @returns {string} HTML string for iframe
 */
function renderYouTubeEmbed(videoId, title = 'YouTube video') {
  if (!videoId) return '';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return `
    <div class="video-embed-container">
      <iframe
        src="${embedUrl}"
        title="${title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
        class="video-iframe"
      ></iframe>
    </div>
  `.trim();
}

/**
 * Render single video HTML
 *
 * @param {Object} videos - Videos data object
 * @returns {string} HTML string
 */
function renderSingleVideo(videos) {
  if (!videos || videos.length === 0) {
    return '';
  }
  const embedHTML = renderYouTubeEmbed(videos[0].videoId, 'YouTube video');
  return `
    <div class="video-content single">
      ${embedHTML}
    </div>
  `.trim();
}

/**
 * Render multiple videos with carousel
 *
 * @param {Array} videos - Array of video data objects
 * @returns {string} HTML string
 */
function renderMultipleVideos(videos) {
  const firstVideo = videos[0];
  const mainPlayerHTML = renderYouTubeEmbed(
    firstVideo.videoId,
    firstVideo.title || 'YouTube video',
  );

  // Render thumbnail items for carousel
  const thumbnailsHTML = videos
    .map(
      (video, index) => `
    <li class="carousel-item video-thumbnail-item" data-video-index="${index}">
      <button
        class="video-thumbnail-button"
        data-video-id="${video.videoId}"
        aria-label="Play video: ${video.title}"
        ${index === 0 ? 'aria-current="true"' : ''}
      >
        <div class="video-thumbnail-image-container">
          <img
            src="${video.thumbnail.src}"
            alt="${video.thumbnail.alt}"
            class="video-thumbnail-image"
            loading="lazy"
          />
        </div>
        <span class="video-thumbnail-title">${video.title}</span>
      </button>
    </li>
  `,
    )
    .join('');

  return `
    <div class="video-content multiple">
      <div class="video-main-player" data-current-video-index="0">
        ${mainPlayerHTML}
      </div>
      <div class="video-thumbnails-container">
        ${renderCarouselContainer('video-thumbnail', thumbnailsHTML)}
      </div>
    </div>
  `.trim();
}

/**
 * Render video block HTML using template literals.
 *
 * @param {Object} data - Data from extractData
 * @returns {string} HTML string
 */
function renderHTML(data) {
  const {
    heading, infoText, caption, videos,
  } = data;

  // Render block header (empty placeholders if no content - allows UE editing)
  const headingHTML = (heading || infoText) ? renderBlockHeader({
    heading: heading || 'Video Block',
    infoText: infoText || '',
    headingLevel: 'h2',
  }) : '';

  const videoContentHTML = videos?.length > 1
    ? renderMultipleVideos(videos)
    : renderSingleVideo(videos, caption);

  const videoCaptionHTML = caption && videos?.length === 1
    ? `<div class="video-caption">${caption}</div>`
    : '';

  const html = `
    ${headingHTML}
    ${videoContentHTML}
    ${videoCaptionHTML}
  `.trim();

  console.log('renderedHTML', html);
  return html;
}

// =============================================================================
// Main Decorate Function
// =============================================================================

/**
 * Handle thumbnail click to switch videos
 *
 * @param {HTMLElement} block - The block element
 * @param {Array} videos - Array of video data objects
 */
function bindThumbnailClickHandlers(block, videos) {
  console.log('bindThumbnailClickHandlers', 'line 349');

  const mainPlayerContainer = block.querySelector('.video-main-player');
  const thumbnailButtons = block.querySelectorAll('.video-thumbnail-button');

  console.log('mainPlayerContainer', mainPlayerContainer);
  console.log('thumbnailButtons', thumbnailButtons);

  if (!mainPlayerContainer || !thumbnailButtons.length) {
    console.log('no player or thumbnails found, skipping event binding');
    return;
  }

  thumbnailButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      console.log('thumbnail clicked', index);

      const video = videos[index];
      if (!video) return;

      // Update aria-current on all buttons
      thumbnailButtons.forEach((btn, btnIndex) => {
        if (btnIndex === index) {
          btn.setAttribute('aria-current', 'true');
        } else {
          btn.removeAttribute('aria-current');
        }
      });

      // Replace iframe with new video
      const newEmbedHTML = renderYouTubeEmbed(video.videoId, video.title);
      mainPlayerContainer.innerHTML = newEmbedHTML;
      mainPlayerContainer.setAttribute('data-current-video-index', index);

      console.log('video switched to index', index);
    });
  });
}

/**
 * Decorate video block.
 * Follows EDS pattern: extractData → renderHTML → bindEvents.
 * Preserves Universal Editor instrumentation for authoring mode.
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  // 1. Extract data from DOM structure (do this first to check item count)
  const data = extractData(block);
  console.log('extractedData', data);

  // Check if already decorated
  if (block.querySelector('.video-content')) {
    console.log('Block already decorated, skipping');
    bindThumbnailClickHandlers(block, data.videos);
    return;
  }

  // 2. Render HTML using template
  const renderedHTML = renderHTML(data);
  console.log('renderedHTML', renderedHTML);

  block.innerHTML = renderedHTML;

  // 3a. Move Universal Editor instrumentation for block-level fields (heading, info-text)
  // If heading/info-text exist as rows (published/authored mode), preserve their instrumentation
  if (data.headingRow || data.infoTextRow) {
    const headingTarget = block.querySelector('.block-heading');
    const infoTextTarget = block.querySelector('.block-info-text');

    if (data.headingRow && headingTarget) {
      console.log('moving heading instrumentation');
      const headingCell = data.headingRow.children[0];
      if (headingCell && headingCell.childNodes[0]) {
        const headingSource = headingCell.childNodes[0];
        // Only move instrumentation if source is an element node (nodeType === 1)
        if (headingSource.nodeType === 1) {
          headingTarget.innerHTML = headingSource.innerHTML;
          moveInstrumentation(headingSource, headingTarget);
        }
      }
    }

    if (data.infoTextRow && infoTextTarget) {
      console.log('moving info-text instrumentation');
      const infoTextCell = data.infoTextRow.children[0];
      if (infoTextCell && infoTextCell.childNodes[0]) {
        const infoTextSource = infoTextCell.childNodes[0];
        // Only move instrumentation if source is an element node (nodeType === 1)
        if (infoTextSource.nodeType === 1) {
          infoTextTarget.innerHTML = infoTextSource.innerHTML;
          moveInstrumentation(infoTextSource, infoTextTarget);
        }
      }
    }
  }

  // 3b. Move Universal Editor instrumentation for video items (only if videos exist)
  if (data.videos?.length === 1) {
    // For single video, move instrumentation from row to video content container
    const videoContent = block.querySelector('.video-content');
    const video = data.videos[0];

    if (videoContent && video.row) {
      console.log('moving instrumentation for single video');
      moveInstrumentation(video.row, videoContent);

      // Get the authored cells from the row
      const captionCell = data.captionRow?.children?.[0];

      // Move caption content and instrumentation if caption exists
      if (captionCell && captionCell.childNodes[0]) {
        const captionTarget = videoContent.querySelector('.video-caption');
        if (captionTarget) {
          const captionSource = captionCell.childNodes[0];
          // Only move instrumentation if source is an element node (nodeType === 1)
          if (captionSource.nodeType === 1) {
            captionTarget.innerHTML = captionSource.innerHTML;
            moveInstrumentation(captionSource, captionTarget);
          }
        }
      }
    }
  } else if (data.videos?.length > 1) {
    // For multiple videos, move instrumentation to thumbnail items
    const thumbnailItems = block.querySelectorAll('.video-thumbnail-item');
    console.log('thumbnailItems', thumbnailItems);

    data.videos.forEach((video, index) => {
      const thumbnailItem = thumbnailItems[index];
      if (!thumbnailItem || !video.row) return;

      console.log(`moving instrumentation for video ${index}`);

      // Move row-level instrumentation to thumbnail item
      moveInstrumentation(video.row, thumbnailItem);

      // Get the authored cells from the row
      const [, titleCell] = video.row.children || [];

      // Move title content and instrumentation to thumbnail title span
      if (titleCell && titleCell.childNodes[0]) {
        const titleTarget = thumbnailItem.querySelector('.video-thumbnail-title');
        if (titleTarget) {
          const titleSource = titleCell.childNodes[0];
          // Only move instrumentation if source is an element node (nodeType === 1)
          if (titleSource.nodeType === 1) {
            titleTarget.innerHTML = titleSource.innerHTML;
            moveInstrumentation(titleSource, titleTarget);
          }
        }
      }
    });
    bindThumbnailClickHandlers(block, data.videos);
    requestAnimationFrame(() => {
      console.log('initializing carousel');
      initializeCarousel(block, data.videos.length, { equalizeHeights: false });
    });
  }

  console.log('video decoration complete', 'line 463');
}
