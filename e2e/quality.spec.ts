/**
 * Qualities that are easy to lose without noticing: the page does not jump
 * while loading, the logo holds its place before it arrives, a phone fetches
 * little, nothing errors along the way, and the page is complete without
 * JavaScript (it uses none today).
 */
import { test, expect } from '@playwright/test';
import { watchProblems, reportCspViolations, scrollThrough, expectAllPicturesLoaded } from './helpers';

const PAGES = ['/', '/terms', '/privacy'];

test('@live nothing jumps while the page loads (layout shift)', async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
        if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/');
  await scrollThrough(page);
  await expectAllPicturesLoaded(page);
  // Only Chromium reports layout shifts; elsewhere this reads 0, which is why
  // the next test exists.
  const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  expect(cls).toBeLessThan(0.02);
});

test('the logo holds its place before it arrives', async ({ page }) => {
  // Hold back the logo, as a slow network would. It must already take the
  // 96px box it will fill, or the heading moves down when it lands.
  await page.route('**/assets/skylar-*', () => {});
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const box = await page.locator('header.hero img').evaluate((img) => img.getBoundingClientRect());
  expect(box.width).toBe(96);
  expect(box.height).toBe(96);
});

test('a phone fetches little text and a logo no larger than it needs', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone projects only');
  await page.goto('/', { waitUntil: 'load' });
  await scrollThrough(page);
  await expectAllPicturesLoaded(page);
  const entries = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .concat(performance.getEntriesByType('navigation'))
      .map((e) => ({ url: e.name.replace(location.origin, ''), bytes: (e as PerformanceResourceTiming).encodedBodySize })),
  );
  // The budget for THIS site, measured 2026-11-09: the home page with its
  // inline style, compressed, is about 3 KB, and the only picture is the
  // 96px logo, an 8.5 KB WebP (16.7 KB PNG where WebP is not taken). About
  // twice today's figures, so an added picture or a stylesheet that balloons
  // has to be a decision rather than an accident.
  const text = entries.filter((e) => !/\.(webp|png|svg|ico|jpe?g)$/.test(e.url));
  expect(text.reduce((n, e) => n + e.bytes, 0)).toBeLessThan(8_000);
  const pictures = entries.filter((e) => /\.(webp|png|jpe?g|svg)$/.test(e.url));
  expect(pictures.reduce((n, e) => n + e.bytes, 0)).toBeLessThan(40_000);

  // The logo at the size the screen needs, never more than about twice that:
  // drawn width times the pixel ratio, against the file chosen.
  const logo = await page.locator('header.hero img').evaluate((img) => ({
    url: (img as HTMLImageElement).currentSrc,
    file: (img as HTMLImageElement).naturalWidth,
    need: img.getBoundingClientRect().width * devicePixelRatio,
  }));
  expect(logo.file, `${logo.url} for ${Math.round(logo.need)}px`).toBeLessThanOrEqual(logo.need * 2);
});

test('@live no console errors or CSP violations through a full visit', async ({ page }) => {
  const problems = watchProblems(page);
  await reportCspViolations(page);
  for (const path of PAGES) {
    await page.goto(path);
    await scrollThrough(page);
  }
  expect(problems).toEqual([]);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every page and the logo are still there', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 }), path).toBeVisible();
    }
    await page.goto('/');
    await expect(page.locator('header.hero img')).toBeVisible();
    await expect(page.locator('section.projects .card')).toHaveCount(3);
  });
});
