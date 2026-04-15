/**
 * Mock implementations of scripts.js utilities for Storybook
 */

/**
 * Moves attributes from one element to another
 * @param {Element} from - Source element
 * @param {Element} to - Target element
 * @param {Array} attributes - Attributes to move (optional)
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from one element to another
 * In Storybook, this is a no-op since we don't have AEM instrumentation
 * @param {Element} from - Source element
 * @param {Element} to - Target element
 */
export function moveInstrumentation(from, to) {
  // In Storybook context, we can still move data attributes for testing
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * Decorates the main element (mock)
 * @param {Element} main - The main element
 */
export function decorateMain(main) {
  // Simplified decoration for Storybook
}

