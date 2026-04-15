/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: [
    '../blocks/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: [
    '../fonts',
    '../icons',
  ],
  viteFinal: async (config) => {
    // Add SCSS support
    config.css = {
      preprocessorOptions: {
        scss: {
          includePaths: ['styles'],
        },
      },
    };

    // Alias for AEM mocks
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '../../scripts/aem.js': new URL('./mocks/aem.js', import.meta.url).pathname,
      '../../scripts/scripts.js': new URL('./mocks/scripts.js', import.meta.url).pathname,
    };

    return config;
  },
};

export default config;

