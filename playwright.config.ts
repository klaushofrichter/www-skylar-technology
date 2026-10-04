import { defineConfig } from '@playwright/test';

// PORT is what the server listens on (src/server.ts), so the two always agree.
const baseURL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL },
  // With no BASE_URL, Playwright starts the built server itself, waits for
  // /health and stops it afterwards. That replaced a hand-written start, poll
  // and kill loop in CI. Setting BASE_URL points the suite at something
  // already running (a dev server, a container) and starts nothing. Locally
  // an existing server on that port is reused; in CI one is always started fresh.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm start',
        url: `${baseURL}/health`,
        reuseExistingServer: !process.env.CI,
      },
});
