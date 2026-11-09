import { defineConfig, devices } from '@playwright/test';

/**
 * Where the suite points:
 *  - nothing set: Playwright starts the built server itself (`npm run build`
 *    first), waits for /health and stops it afterwards;
 *  - BASE_URL=http://localhost:8080: a server somebody else started, which in
 *    production-checks.yml is the Docker image the release will ship;
 *  - BASE_URL=https://www.skylar.technology with --grep @live: the live site,
 *    after a release (live-check.yml). Only read-only tests carry @live:
 *    nothing tagged @live may POST (the site has no sign-in at all).
 *
 * kube-setup's "public web pages" baseline
 * (docs/cluster-deployment-requirements.md, §4), adapted from
 * klaushofrichter/christina.art and klaushofrichter/www-klaushofrichter.
 */
const BASE_URL = process.env.BASE_URL;
const LIVE = BASE_URL?.startsWith('https://');
const PORT = process.env.PORT || '8080';

// For machines with a Chromium outside Playwright's cache. Unset in CI, which
// installs its own browsers.
const chromiumLaunch = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // One retry absorbs a runner hiccup, but a test that needed it fails the
  // run anyway: in christina.art a "passed on retry" in Firefox and WebKit was
  // a real layout bug, not noise (kube-setup vault, Gotchas).
  retries: process.env.CI ? 1 : 0,
  failOnFlakyTests: !!process.env.CI,
  forbidOnly: !!process.env.CI,
  timeout: LIVE ? 60_000 : 30_000,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL || `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Desktop Chrome, an Android phone, an iPhone (WebKit is Safari's engine)
  // and desktop Firefox: the four a visitor arrives on. Every page here is
  // public and nothing changes server data, so every test runs in all four.
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], launchOptions: chromiumLaunch } },
    { name: 'phone-chromium', use: { ...devices['Pixel 7'], launchOptions: chromiumLaunch } },
    { name: 'phone-webkit', use: { ...devices['iPhone 13'] } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: BASE_URL
    ? undefined
    : {
        command: 'npm start',
        url: `http://localhost:${PORT}/health`,
        reuseExistingServer: !process.env.CI,
      },
});
