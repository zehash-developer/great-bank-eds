/** @type { import('@storybook/test-runner').TestRunnerConfig } */
const config = {
  // Hook to run before each story is rendered
  async preVisit(page) {
    // Add any global setup here
  },

  // Hook to run after each story is rendered
  async postVisit(page, context) {
    // You can add custom assertions here that run for every story
    // For example, check for console errors:
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    if (errors.length > 0) {
      throw new Error(`Console errors found:\n${errors.join('\n')}`);
    }
  },

  // Increase timeout for slower tests
  testTimeout: 15000,

  // Run tests in parallel
  workers: 4,
};

export default config;

