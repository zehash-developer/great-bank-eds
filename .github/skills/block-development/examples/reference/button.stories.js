/**
 * Button Component Stories
 *
 * Demonstrates all button variants and sizes from the GEL Design System.
 * Buttons are rendered using the global button styles defined in styles/_components.scss
 * and styles/_mixins.scss.
 *
 * Variants: primary, secondary, tertiary
 * Sizes: sm, md, lg
 */



// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Creates a button element with specified variant and size
 * @param {Object} options - Button configuration
 * @param {string} options.text - Button text content
 * @param {string} options.variant - Button variant (primary, secondary, tertiary)
 * @param {string} options.size - Button size (sm, md, lg)
 * @param {string} options.href - Link URL
 * @param {boolean} options.isBlock - Whether button should be full width
 * @returns {HTMLElement} Button anchor element
 */
function createButton({ text, variant = 'primary', size = 'lg', href = '#', isBlock = false }) {
  const button = document.createElement('a');
  button.href = href;
  button.className = `button ${variant}`;
  
  // Add size class (only if not lg, since lg is default)
  if (size && size !== 'lg') {
    button.classList.add(`btn-${size}`);
  }
  
  // Add block class for full width
  if (isBlock) {
    button.classList.add('btn-block');
  }
  
  button.textContent = text;
  
  return button;
}

/**
 * Creates a button container with one or more buttons
 * @param {Array<Object>} buttons - Array of button configurations
 * @returns {HTMLElement} Button container div
 */
function createButtonContainer(buttons) {
  const container = document.createElement('div');
  container.className = 'button-container';
  
  buttons.forEach(buttonConfig => {
    container.appendChild(createButton(buttonConfig));
  });
  
  return container;
}

// =============================================================================
// Story Configuration
// =============================================================================

export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## GEL Button Component

Buttons provide users with clear calls-to-action and interactive elements.

### Variants

- **Primary**: High-emphasis actions with filled background
- **Secondary**: Medium-emphasis actions with outlined style
- **Tertiary**: Low-emphasis actions with text-only style
- **Hero**: High-emphasis actions with hero color background
- **Hero Soft**: Medium-emphasis actions with hero color outline
- **Faint**: Low-emphasis actions with light background
- **Faint Soft**: Low-emphasis actions with light background and border

### Sizes

- **Small (sm)**: Compact buttons for tight spaces
- **Medium (md)**: Standard button size
- **Large (lg)**: Prominent buttons for primary actions (default)
- **Extra Large (xl)**: Largest button size for hero sections

### Usage Notes

- Buttons are implemented as anchor tags with \`button\` class
- Buttons should be placed within a \`button-container\` div
- Add \`btn-block\` class for full-width buttons (responsive: full width on mobile, auto on desktop)
        `,
      },
    },
    controls: { disable: true },
  },
};

// =============================================================================
// STORIES
// =============================================================================

/**
 * Interactive button playground
 * Use controls to customize button properties
 */
export const Playground = {
  args: {
    text: 'Button Text',
    variant: 'primary',
    size: 'lg',
    href: '#',
    isBlock: false,
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Button text content',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'hero-standard', 'hero-soft', 'faint', 'faint-soft'],
      description: 'Button style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    isBlock: {
      control: 'boolean',
      description: 'Full width button (responsive)',
    },
    href: {
      control: 'text',
      description: 'Button link URL',
    },
  },
  parameters: {
    controls: { disable: false },
  },
  render: (args) => {
    return createButtonContainer([args]);
  },
};

/**
 * Primary button variant
 */
export const Primary = {
  render: () => {
    return createButtonContainer([
      { text: 'Primary Button', variant: 'primary', size: 'lg' },
    ]);
  },
};

/**
 * Secondary button variant
 */
export const Secondary = {
  render: () => {
    return createButtonContainer([
      { text: 'Secondary Button', variant: 'secondary', size: 'lg' },
    ]);
  },
};

/**
 * Tertiary button variant
 */
export const Tertiary = {
  render: () => {
    return createButtonContainer([
      { text: 'Tertiary Button', variant: 'tertiary', size: 'lg' },
    ]);
  },
};

/**
 * Hero button variant
 */
export const Hero = {
  render: () => {
    return createButtonContainer([
      { text: 'Hero Button', variant: 'hero-standard', size: 'lg' },
    ]);
  },
};

/**
 * Hero Soft button variant
 */
export const HeroSoft = {
  render: () => {
    return createButtonContainer([
      { text: 'Hero Soft Button', variant: 'hero-soft', size: 'lg' },
    ]);
  },
};

/**
 * Faint button variant
 */
export const Faint = {
  render: () => {
    return createButtonContainer([
      { text: 'Faint Button', variant: 'faint', size: 'lg' },
    ]);
  },
};

/**
 * Faint Soft button variant
 */
export const FaintSoft = {
  render: () => {
    return createButtonContainer([
      { text: 'Faint Soft Button', variant: 'faint-soft', size: 'lg' },
    ]);
  },
};

/**
 * Block buttons (full width)
 * Demonstrates full-width primary button
 */
export const BlockButtons = {
  render: () => {
    return createButtonContainer([
      { text: 'Primary Block Button', variant: 'primary', size: 'lg', isBlock: true },
    ]);
  },
};

/**
 * All button variants and sizes
 */
export const AllVariantsAndSizes = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; flex-direction: column; gap: 24px;';
    
    // Primary variant - all sizes
    const primaryContainer = createButtonContainer([
      { text: 'Primary XL', variant: 'primary', size: 'xl' },
      { text: 'Primary Large', variant: 'primary', size: 'lg' },
      { text: 'Primary Medium', variant: 'primary', size: 'md' },
      { text: 'Primary Small', variant: 'primary', size: 'sm' },
    ]);
    
    // Secondary variant - all sizes
    const secondaryContainer = createButtonContainer([
      { text: 'Secondary XL', variant: 'secondary', size: 'xl' },
      { text: 'Secondary Large', variant: 'secondary', size: 'lg' },
      { text: 'Secondary Medium', variant: 'secondary', size: 'md' },
      { text: 'Secondary Small', variant: 'secondary', size: 'sm' },
    ]);
    
    // Tertiary variant - all sizes
    const tertiaryContainer = createButtonContainer([
      { text: 'Tertiary XL', variant: 'tertiary', size: 'xl' },
      { text: 'Tertiary Large', variant: 'tertiary', size: 'lg' },
      { text: 'Tertiary Medium', variant: 'tertiary', size: 'md' },
      { text: 'Tertiary Small', variant: 'tertiary', size: 'sm' },
    ]);
    
    // Hero variant - all sizes
    const heroContainer = createButtonContainer([
      { text: 'Hero XL', variant: 'hero-standard', size: 'xl' },
      { text: 'Hero Large', variant: 'hero-standard', size: 'lg' },
      { text: 'Hero Medium', variant: 'hero-standard', size: 'md' },
      { text: 'Hero Small', variant: 'hero-standard', size: 'sm' },
    ]);
    
    // Hero Soft variant - all sizes
    const heroSoftContainer = createButtonContainer([
      { text: 'Hero Soft XL', variant: 'hero-soft', size: 'xl' },
      { text: 'Hero Soft Large', variant: 'hero-soft', size: 'lg' },
      { text: 'Hero Soft Medium', variant: 'hero-soft', size: 'md' },
      { text: 'Hero Soft Small', variant: 'hero-soft', size: 'sm' },
    ]);
    
    // Faint variant - all sizes
    const faintContainer = createButtonContainer([
      { text: 'Faint XL', variant: 'faint', size: 'xl' },
      { text: 'Faint Large', variant: 'faint', size: 'lg' },
      { text: 'Faint Medium', variant: 'faint', size: 'md' },
      { text: 'Faint Small', variant: 'faint', size: 'sm' },
    ]);
    
    // Faint Soft variant - all sizes
    const faintSoftContainer = createButtonContainer([
      { text: 'Faint Soft XL', variant: 'faint-soft', size: 'xl' },
      { text: 'Faint Soft Large', variant: 'faint-soft', size: 'lg' },
      { text: 'Faint Soft Medium', variant: 'faint-soft', size: 'md' },
      { text: 'Faint Soft Small', variant: 'faint-soft', size: 'sm' },
    ]);
    
    wrapper.appendChild(primaryContainer);
    wrapper.appendChild(secondaryContainer);
    wrapper.appendChild(tertiaryContainer);
    wrapper.appendChild(heroContainer);
    wrapper.appendChild(heroSoftContainer);
    wrapper.appendChild(faintContainer);
    wrapper.appendChild(faintSoftContainer);
    
    // Add section title for block buttons
    const blockTitle = document.createElement('h3');
    blockTitle.textContent = 'Block Buttons (Full Width)';
    blockTitle.style.cssText = 'margin-top: 32px; margin-bottom: 16px;';
    wrapper.appendChild(blockTitle);
    
    // Primary block button
    const primaryBlockContainer = createButtonContainer([
      { text: 'Primary Block Button', variant: 'primary', size: 'lg', isBlock: true },
    ]);
    wrapper.appendChild(primaryBlockContainer);
    
    return wrapper;
  },
};
