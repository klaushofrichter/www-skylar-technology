/**
 * Accessibility: WCAG 2.2 level A and AA, checked by axe-core in a real
 * browser, on every public page. Zero violations is the bar, plus the
 * contrast passes in helpers.ts `audit()` that axe leaves undecided.
 *
 * The site has one design, dark, and no prefers-color-scheme rules, so it is
 * audited once, with the dark scheme the design is written for. If a light
 * theme is ever added, audit it here too.
 */
import { test, expect } from '@playwright/test';
import { audit, scrollThrough } from './helpers';

for (const path of ['/', '/terms', '/privacy']) {
  test(`@live ${path} meets WCAG 2.2 AA`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.goto(path);
    await scrollThrough(page);
    await audit(page);
  });
}

test('@live every picture has a text alternative and every link a name', async ({ page }) => {
  for (const path of ['/', '/terms', '/privacy']) {
    await page.goto(path);
    const missing = await page.evaluate(() => [
      ...Array.from(document.images)
        .filter((i) => i.getAttribute('alt') === null)
        .map((i) => `img ${i.currentSrc || i.src}`),
      ...Array.from(document.querySelectorAll('a, button'))
        .filter((el) => !(el.getAttribute('aria-label') || (el as HTMLElement).innerText || '').trim())
        .map((el) => `${el.tagName.toLowerCase()} ${el.outerHTML.slice(0, 80)}`),
    ]);
    expect(missing, path).toEqual([]);
  }
});
