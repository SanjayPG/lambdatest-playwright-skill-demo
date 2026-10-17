/**
 * playwright.config.ts — Unified local + TestMu AI cloud configuration.
 *
 * Local:   npx playwright test --project=chromium
 * Cloud:   npx playwright test --project="chrome:latest:Windows 11@lambdatest"
 * All:     npx playwright test
 *
 * Cloud projects require LT_USERNAME and LT_ACCESS_KEY (see .env.example).
 * Cloud project naming convention: browserName:version:platform@lambdatest
 * Parsed automatically by src/fixtures/lambdatest-setup.ts.
 */

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },

  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 4 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    // Use data-test attribute (SauceDemo) so getByTestId() resolves correctly
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    // Skill §16: trace/video on-first-retry (not retain-on-failure)
    trace: 'on-first-retry',
    video: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // ── Local browsers ─────────────────────────────────────────────────────
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },

    // ── TestMu AI Cloud ────────────────────────────────────────────────────
    // Format: browserName:version:platform@lambdatest
    // Handled by src/fixtures/lambdatest-setup.ts fixture.
    {
      name: 'chrome:latest:Windows 11@lambdatest',
      use: { viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'MicrosoftEdge:latest:Windows 10@lambdatest',
      use: { viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'pw-webkit:latest:macOS Sonoma@lambdatest',
      use: { viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'pw-firefox:latest:macOS Ventura@lambdatest',
      use: { viewport: { width: 1920, height: 1080 } },
    },
  ],

  outputDir: 'test-results/',
});
