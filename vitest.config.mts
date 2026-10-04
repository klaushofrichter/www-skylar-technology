import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Say what the unit suite is rather than listing what it is not; e2e/ is
    // Playwright's and must never be collected here.
    include: ['test/**/*.test.ts'],
  },
});
