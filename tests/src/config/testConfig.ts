/**
 * Test Configuration
 * Contains timeout, retry, and delay configurations for tests
 */

export const TestConfig = {
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
    extraLong: 30000,
  },
  retries: {
    api: 3,
    ui: 2,
    flaky: 1,
  },
  delays: {
    animation: 300,
    typing: 100,
    network: 500,
    pageLoad: 1000,
  },
  viewport: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1440, height: 900 },
  },
};