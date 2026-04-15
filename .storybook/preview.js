/** @type { import('@storybook/html').Preview } */

// Import global styles first, then block styles (block values should follow Figma; extend SCSS when needed)
import '../styles/dist/style-config.compiled.min.css';
import '../styles/dist/styles.min.css';
import '../styles/dist/gel-icons.min.css';
/**
 * Brand labels for Storybook toolbar (`data-brand` / theme switching).
 * **Visual design tokens for blocks come from Figma** — implement in SCSS/JS; this map is for tooling only.
 */
const BRANDS = {
  wbc: { name: 'Great Bank', color: '#DA1710' },
  stg: { name: 'St.George', color: '#008739' },
  bom: { name: 'Bank of Melbourne', color: '#534891' },
  bsa: { name: 'BankSA', color: '#002F6C' },
  rams: { name: 'RAMS', color: '#047DBC' },
  wbg: { name: 'Great Bank Group', color: '#DA1710' },
};

/**
 * Theme modes (light/dark)
 */
const MODES = {
  light: { name: 'Light', icon: '☀️' },
  dark: { name: 'Dark', icon: '🌙' },
};

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Default background options
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#131313' },
        { name: 'highlight', value: '#f8f8f8' },
      ],
    },
    // Accessibility configuration - WCAG AAA standards for banking compliance
    a11y: {
      config: {
        rules: [
          // Ensure all rules are enabled for strictest testing
          { id: 'color-contrast-enhanced', enabled: true }, // AAA contrast
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: [
            'wcag2a',       // WCAG 2.0 Level A
            'wcag2aa',      // WCAG 2.0 Level AA
            'wcag2aaa',     // WCAG 2.0 Level AAA (strictest)
            'wcag21a',      // WCAG 2.1 Level A
            'wcag21aa',     // WCAG 2.1 Level AA
            'wcag21aaa',    // WCAG 2.1 Level AAA (strictest)
            'wcag22aa',     // WCAG 2.2 Level AA
            'best-practice', // Additional accessibility best practices
          ],
        },
      },
    },
  },
  
  // Global toolbar for brand and theme mode switching
  // globalTypes: {
  //   brand: {
  //     name: 'Brand',
  //     description: 'Brand theme (toolbar)',
  //     defaultValue: 'wbc',
  //     toolbar: {
  //       icon: 'paintbrush',
  //       title: 'Brand Theme',
  //       items: Object.entries(BRANDS).map(([id, { name, color }]) => ({
  //         value: id,
  //         title: name,
  //         left: `<span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:${color};margin-right:8px;"></span>`,
  //       })),
  //       dynamicTitle: true,
  //     },
  //   },
  //   mode: {
  //     name: 'Mode',
  //     description: 'Light or dark theme mode',
  //     defaultValue: 'light',
  //     toolbar: {
  //       icon: 'sun',
  //       title: 'Theme Mode',
  //       items: Object.entries(MODES).map(([id, { name, icon }]) => ({
  //         value: id,
  //         title: `${icon} ${name}`,
  //       })),
  //       dynamicTitle: true,
  //     },
  //   },
  // },

  decorators: [
    // Global theme decorator
    // style-config: data-brand="wbc", data-theme="dark" for dark mode
    // Legacy gel: data-theme (brand), data-mode (dark)
    (Story, context) => {
      const brand = context.globals.brand || 'wbc';
      const mode = context.globals.mode || 'light';
      // Dark mode: toolbar, story backgrounds, or story id contains "dark"
      const storyBg = context.parameters.backgrounds?.default;
      const globalsBg = context.globals?.backgrounds;
      const isDarkBg = globalsBg?.value === '#131313' || globalsBg?.name === 'dark';
      const isDarkStory = /-dark(-|$)/i.test(context.id || '');
      const isDark = mode === 'dark' || storyBg === 'dark' || isDarkBg || isDarkStory;
      
      document.documentElement.setAttribute('data-brand', brand);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : brand);
      document.documentElement.setAttribute('data-mode', mode);
      document.body.setAttribute('data-brand', brand);
      document.body.setAttribute('data-theme', isDark ? 'dark' : brand);
      document.body.setAttribute('data-mode', mode);
      
      document.body.style.backgroundColor = 'var(--background-white-pale)';
      document.body.style.color = 'var(--text-body)';
      
      return Story();
    },
    
    // Container decorator - mimics AEM page structure
    (Story) => {
      const main = document.createElement('main');
      const container = document.createElement('div');
      container.className = 'section';
      const wrapper = document.createElement('div');
      wrapper.className = 'block-wrapper';
      container.appendChild(wrapper);
      document.body.classList.add('appear');

      const storyContent = Story();
      if (typeof storyContent === 'string') {
        wrapper.innerHTML = storyContent;
      } else if (storyContent instanceof Node) {
        wrapper.appendChild(storyContent);
      }

      main.appendChild(container);
      return main;
    },
  ],
};

export default preview;
