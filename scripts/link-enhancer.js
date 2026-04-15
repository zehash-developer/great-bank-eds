/**
 * Format bytes to human-readable size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size (e.g., "245KB", "1.2MB")
 */
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)}KB`;
  }

  const mb = kb / 1024;
  return `${mb.toFixed(1)}MB`;
}

/**
 * Get file size from URL using HEAD request
 * @param {string} url - The file URL
 * @returns {Promise<string|null>} - Formatted file size (e.g., "245KB") or null
 */
async function getFileSize(url) {
  try {
    // Try HEAD request first (doesn't download the file)
    const response = await fetch(url, { method: 'HEAD' });

    if (!response.ok) {
      // Fallback to GET if HEAD not allowed
      const getResponse = await fetch(url);
      const blob = await getResponse.blob();
      const bytes = blob.size;
      return formatFileSize(bytes);
    }

    const contentLength = response.headers.get('Content-Length');

    if (contentLength) {
      const bytes = parseInt(contentLength, 10);
      return formatFileSize(bytes);
    }

    return null;
  } catch (error) {
    console.error('getFileSize()', 5, 'Error fetching file size:', error);
    return null;
  }
}

/**
 * Enhance links with file type icons and sizes
 * @param {HTMLElement} element - The container element to scan for links
 */
export default async function enhanceFileLinks(element) {
  const links = element.querySelectorAll('a[href]');

  const fileTypeConfig = {
    pdf: {
      extensions: ['.pdf'],
      iconClass: 'gel-icon-pdf-file-outlined',
      label: 'PDF',
    },
    doc: {
      extensions: ['.doc', '.docx'],
      iconClass: 'gel-icon-word-file-outlined',
      label: 'DOC',
    },
    xls: {
      extensions: ['.xls', '.xlsx'],
      iconClass: 'gel-icon-excel-file-outlined',
      label: 'XLS',
    },
  };

  const promises = Array.from(links).map(async (link) => {
    const href = link.getAttribute('href');
    const url = href.toLowerCase();

    // Check if link is a file we want to enhance
    const fileTypeEntry = Object.entries(fileTypeConfig)
      .find(([, config]) => config.extensions.some((ext) => url.endsWith(ext)));

    if (!fileTypeEntry) {
      return;
    }

    const [type, config] = fileTypeEntry;
    const fileType = { type, ...config };

    // Check if already enhanced (avoid duplicate processing)
    if (link.querySelector('.file-icon')) {
      return;
    }

    // Get file size
    const fileSize = await getFileSize(href);

    // Create icon element
    const icon = document.createElement('i');
    icon.className = `gel-icon ${fileType.iconClass} file-icon`;
    icon.setAttribute('aria-hidden', 'true');

    // Get original link text
    const originalText = link.textContent.trim();

    // Create text with file size
    const sizeText = fileSize
      ? ` (${fileType.label} ${fileSize})`
      : '';

    // Update link content
    link.textContent = originalText + sizeText;

    // Prepend icon to link
    link.insertBefore(icon, link.firstChild);
  });

  await Promise.all(promises);
}

document.addEventListener('DOMContentLoaded', async () => {
  // Hide body initially to prevent flash of unenhanced content
  document.body.style.visibility = 'hidden';

  try {
    // Wait for link enhancement to complete
    await enhanceFileLinks(document.body);
  } catch (error) {
    console.error('enhanceFileLinks failed:', error);
  } finally {
    // Show body after enhancement is complete
    document.body.style.visibility = 'visible';
  }
});
