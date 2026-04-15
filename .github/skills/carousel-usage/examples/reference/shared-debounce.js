/**
 * Minimal debounce helper — vendored beside carousel.js for portable skill bundles.
 * In the Westpac app repo, carousel imports from scripts/utility/shared.js instead.
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
