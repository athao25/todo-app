import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment-specific configuration
const environment = process.env.BASE_ENV || 'local';
const envFile = path.resolve(__dirname, 'config', `.env.${environment}`);

// Load the environment file
dotenv.config({ path: envFile });

console.log(`🎭 Playwright running against ${environment} environment`);
console.log(`📍 Base URL: ${process.env.BASE_URL}`);

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['github']] : [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 30000, // 30 second timeout for individual actions
  },
  timeout: 60000, // 1 minute timeout for entire test
  expect: {
    timeout: 10000, // 10 second timeout for assertions
  },

  projects: [
    {
      name: 'ui-smoke-tests',
      testMatch: '**/e2e/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api-tests',
      testMatch: '**/e2e/api/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'integration-tests',
      testMatch: '**/e2e/integration/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Additional browser testing (uncomment as needed)
    // {
    //   name: 'firefox-ui',
    //   testMatch: '**/e2e/ui/**/*.spec.ts',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // Mobile testing
    // {
    //   name: 'mobile-ui',
    //   testMatch: '**/e2e/ui/**/*.spec.ts',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});