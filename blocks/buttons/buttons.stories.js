/**
 * Buttons — Storybook Stories
 *
 * Buttons are a shared UI component, not an EDS block.
 * There is no decorate() — stories render HTML directly.
 * Styles are compiled into styles/dist/styles.min.css and loaded globally
 * via .storybook/preview.js.
 *
 * Figma references:
 *  - Light: docs/requirements/buttons/figma/node-5-3024-buttons-light.png  (node 5:3024)
 *  - Dark:  docs/requirements/buttons/figma/node-5-4803-buttons-dark.png   (node 5:4803)
 */

// =============================================================================
// Constants
// =============================================================================

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'tertiary'];
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const SIZE_LABELS = {
  xs: 'Extra Small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};

// Minimal inline SVG icons — stand-ins for GEL icons in stories
const ICON_HOME = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const ICON_ARROW = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
const ICON_SHIELD = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;

// =============================================================================
// Helpers
// =============================================================================

/**
 * Create a single .button element.
 * @param {Object} opts
 * @param {string}  opts.label
 * @param {string}  [opts.variant='primary']
 * @param {string}  [opts.size='lg']
 * @param {string}  [opts.iconLeading]   - SVG string
 * @param {string}  [opts.iconTrailing]  - SVG string
 * @param {boolean} [opts.disabled=false]
 * @param {boolean} [opts.block=false]   - Full-width btn-block
 * @param {string}  [opts.href='#']
 * @returns {HTMLAnchorElement}
 */
function createButton({
  label,
  variant = 'primary',
  size = 'lg',
  iconLeading = null,
  iconTrailing = null,
  disabled = false,
  block = false,
  href = '#',
} = {}) {
  const a = document.createElement('a');
  a.href = href;
  a.className = ['button', variant, size, block ? 'btn-block' : ''].filter(Boolean).join(' ');

  if (disabled) {
    a.setAttribute('aria-disabled', 'true');
    a.removeAttribute('href');
  }

  if (iconLeading) {
    const span = document.createElement('span');
    span.className = 'button-icon button-icon--leading';
    span.innerHTML = iconLeading;
    a.appendChild(span);
  }

  a.appendChild(document.createTextNode(label));

  if (iconTrailing) {
    const span = document.createElement('span');
    span.className = 'button-icon button-icon--trailing';
    span.innerHTML = iconTrailing;
    a.appendChild(span);
  }

  return a;
}

/**
 * Wrap elements in a .button-container.
 * @param {...HTMLElement} buttons
 * @returns {HTMLElement}
 */
function buttonContainer(...buttons) {
  const div = document.createElement('div');
  div.className = 'button-container';
  buttons.forEach((b) => div.appendChild(b));
  return div;
}

/**
 * Build a labelled section with a heading and content.
 * @param {string} heading
 * @param {HTMLElement} content
 * @param {boolean} [small=false] - Use h3 instead of h2
 * @returns {HTMLElement}
 */
function section(heading, content, small = false) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'margin-bottom: 2rem;';
  const h = document.createElement(small ? 'h3' : 'h2');
  h.style.cssText = 'font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem; color: inherit;';
  h.textContent = heading;
  wrap.appendChild(h);
  wrap.appendChild(content);
  return wrap;
}

/**
 * Build the full variants × sizes matrix for one theme.
 * @param {boolean} [dark=false]
 * @returns {HTMLElement}
 */
function buildMatrix(dark = false) {
  const wrap = document.createElement('div');
  wrap.style.cssText = `
    padding: 2rem;
    background: ${dark ? '#111827' : '#ffffff'};
    color: ${dark ? '#f1f5f9' : '#0f172a'};
    min-height: 100vh;
    box-sizing: border-box;
  `;
  if (dark) wrap.setAttribute('data-theme', 'dark');

  VARIANTS.forEach((variant) => {
    const row = document.createElement('div');
    row.style.cssText =
      'display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-bottom: 0.5rem;';

    SIZES.forEach((size) => {
      row.appendChild(createButton({ label: SIZE_LABELS[size], variant, size }));
    });

    wrap.appendChild(
      section(`${variant.charAt(0).toUpperCase() + variant.slice(1)} Variant`, row, false),
    );
  });

  return wrap;
}

// =============================================================================
// Meta
// =============================================================================

export default {
  title: 'Components/Buttons',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Buttons

Shared UI component used across all blocks. Applied via CSS classes on \`<a>\` or \`<button>\` elements — no EDS \`decorate()\` involved.

**Class pattern:** \`.button {variant} {size}\`

**Variants:** \`primary\` · \`secondary\` · \`outline\` · \`ghost\` · \`tertiary\`

**Sizes:** \`xs\` · \`sm\` · \`md\` · \`lg\` · \`xl\`

**Modifiers:** \`btn-block\` (full-width), \`aria-disabled="true"\` (disabled)

**Figma:** [Light node 5:3024](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-3024)
· [Dark node 5:4803](https://www.figma.com/design/WXBZsxyNrHkyGDg0FWIS1g/Great-Bank-Design-Files?node-id=5-4803)
        `,
      },
    },
  },
};

// =============================================================================
// Stories
// =============================================================================

/** All variants × all sizes — light theme. Matches Figma node 5:3024. */
export const AllVariantsLight = {
  name: 'All Variants — Light',
  render: () => buildMatrix(false),
};

/** All variants × all sizes — dark theme. Matches Figma node 5:4803. */
export const AllVariantsDark = {
  name: 'All Variants — Dark',
  render: () => buildMatrix(true),
};

/** Primary buttons at every size. */
export const Primary = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach((size) => {
      wrap.appendChild(createButton({ label: SIZE_LABELS[size], variant: 'primary', size }));
    });
    return wrap;
  },
};

/** Secondary buttons at every size. */
export const Secondary = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach((size) => {
      wrap.appendChild(createButton({ label: SIZE_LABELS[size], variant: 'secondary', size }));
    });
    return wrap;
  },
};

/** Outline buttons at every size. */
export const Outline = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach((size) => {
      wrap.appendChild(createButton({ label: SIZE_LABELS[size], variant: 'outline', size }));
    });
    return wrap;
  },
};

/** Ghost buttons at every size. */
export const Ghost = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach((size) => {
      wrap.appendChild(createButton({ label: SIZE_LABELS[size], variant: 'ghost', size }));
    });
    return wrap;
  },
};

/** Tertiary (link-style) buttons at every size. */
export const Tertiary = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'padding: 2rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';
    SIZES.forEach((size) => {
      wrap.appendChild(createButton({ label: SIZE_LABELS[size], variant: 'tertiary', size }));
    });
    return wrap;
  },
};

/**
 * Buttons with leading and trailing icons.
 * Matches the "With Icons" section in Figma (both light and dark).
 */
export const WithIcons = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem;';

    wrap.appendChild(
      section(
        'Light — Leading icon',
        buttonContainer(
          createButton({
            label: 'Home Loans',
            variant: 'primary',
            size: 'md',
            iconLeading: ICON_HOME,
          }),
          createButton({
            label: 'Apply Now',
            variant: 'primary',
            size: 'md',
            iconTrailing: ICON_ARROW,
          }),
          createButton({
            label: 'Insurance',
            variant: 'outline',
            size: 'md',
            iconLeading: ICON_SHIELD,
          }),
        ),
      ),
    );

    const darkSection = section(
      'Dark — Icons',
      buttonContainer(
        createButton({
          label: 'Home Loans',
          variant: 'primary',
          size: 'md',
          iconLeading: ICON_HOME,
        }),
        createButton({
          label: 'Apply Now',
          variant: 'primary',
          size: 'md',
          iconTrailing: ICON_ARROW,
        }),
        createButton({
          label: 'Insurance',
          variant: 'outline',
          size: 'md',
          iconLeading: ICON_SHIELD,
        }),
      ),
    );
    darkSection.style.cssText =
      'margin-top: 0; padding: 1.5rem; background: #111827; color: #f1f5f9;';
    darkSection.setAttribute('data-theme', 'dark');

    wrap.appendChild(darkSection);
    return wrap;
  },
};

/** Full-width btn-block modifier. Shrinks to auto-width at the sm breakpoint. */
export const FullWidth = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem; max-width: 400px;';

    wrap.appendChild(
      section(
        'Primary — btn-block',
        (() => {
          const div = document.createElement('div');
          div.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem;';
          div.appendChild(
            createButton({
              label: 'Full-Width Primary',
              variant: 'primary',
              size: 'lg',
              block: true,
            }),
          );
          div.appendChild(
            createButton({
              label: 'Full-Width Outline',
              variant: 'outline',
              size: 'lg',
              block: true,
            }),
          );
          return div;
        })(),
      ),
    );

    return wrap;
  },
};

/** Disabled state — aria-disabled applied, pointer-events removed. */
export const Disabled = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem;';

    const row = document.createElement('div');
    row.style.cssText = 'display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;';

    ['primary', 'secondary', 'outline', 'ghost'].forEach((variant) => {
      row.appendChild(
        createButton({
          label: `${variant.charAt(0).toUpperCase() + variant.slice(1)} (disabled)`,
          variant,
          size: 'md',
          disabled: true,
        }),
      );
    });

    wrap.appendChild(section('Disabled (aria-disabled)', row));
    return wrap;
  },
};

/** button-container — horizontal grouping with wrapping. */
export const GroupedContainer = {
  name: 'Grouped — button-container',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 2rem;';

    wrap.appendChild(
      section(
        'Primary + Outline group (md)',
        buttonContainer(
          createButton({ label: 'Apply Now', variant: 'primary', size: 'md' }),
          createButton({ label: 'Learn More', variant: 'outline', size: 'md' }),
        ),
      ),
    );

    wrap.appendChild(
      section(
        'Three-button group (lg)',
        buttonContainer(
          createButton({ label: 'Home Loans', variant: 'primary', size: 'lg' }),
          createButton({ label: 'Compare', variant: 'outline', size: 'lg' }),
          createButton({ label: 'See all products', variant: 'tertiary', size: 'lg' }),
        ),
      ),
    );

    return wrap;
  },
};
