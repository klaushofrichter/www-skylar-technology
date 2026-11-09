/**
 * The public site, walked as a visitor walks it, in four browsers. There is no
 * sign-in and nothing to POST. Tests tagged @live are read-only and run twice:
 * before a release against the image the release will ship
 * (production-checks.yml), and after it against https://www.skylar.technology
 * (live-check.yml).
 */
import { test, expect, Page, Locator } from '@playwright/test';
import { watchProblems, reportCspViolations, scrollThrough, expectAllPicturesLoaded } from './helpers';
import { contact, projects, links } from '../src/content';

/** Set by the workflows to the version the server must report. */
const EXPECT_VERSION = process.env.EXPECT_VERSION;

const HOME_H1 = 'Welcome to Skylar Technology LLC';

async function press(page: Page, isMobile: boolean, locator: Locator) {
  if (isMobile) await locator.tap();
  else await locator.click();
}

test('@live /health is ok and names the release the footer shows', async ({ page, request }) => {
  const res = await request.get('/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe('ok');
  expect(body.service).toBe('www-skylar-technology');
  expect(typeof body.version).toBe('string');
  if (EXPECT_VERSION) expect(body.version).toBe(EXPECT_VERSION);
  await page.goto('/');
  await expect(page.locator('footer a.version')).toHaveText(`v${body.version}`);
});

test('@live the home page loads completely, the logo included', async ({ page }) => {
  const problems = watchProblems(page);
  await reportCspViolations(page);
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('Skylar Technology LLC');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(HOME_H1);
  await expect(page.locator('img[alt="Skylar Technology LLC logo"]')).toBeVisible();
  for (const h2 of ['About', 'Services', 'Engagement', 'Open Source Projects, built with AI', 'Contact']) {
    await expect(page.getByRole('heading', { level: 2, name: h2 })).toBeVisible();
  }
  await scrollThrough(page);
  await expectAllPicturesLoaded(page);
  expect(problems).toEqual([]);
});

test('@live home page exposes Open Graph tags', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://www.skylar.technology/assets/skylar-256x256.png'
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Skylar Technology LLC');
});

test('@live every link on every page goes somewhere that works', async ({ context, request, baseURL }) => {
  // Starts at the home page and follows every same-site link it finds, on
  // every page it reaches, so a page added later is covered without touching
  // this test. Third-party targets are not ours to test (and some, LinkedIn
  // for one, refuse robots), so they are only checked for shape.
  const origin = new URL(baseURL!).origin;
  const pages = ['/'];
  const visited = new Set<string>();
  const checked = new Set<string>();

  while (pages.length) {
    const path = pages.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    // A fresh tab per page, so each page's problems are its own.
    const page = await context.newPage();
    const problems = watchProblems(page);
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.getByRole('heading', { level: 1 }), path).toBeVisible();
    await scrollThrough(page);
    await expectAllPicturesLoaded(page);
    expect(problems, path).toEqual([]);

    const anchors = await page.locator('a[href]').evaluateAll((as) =>
      as.map((a) => ({ href: a.getAttribute('href')!, target: a.getAttribute('target'), rel: a.getAttribute('rel') ?? '' })),
    );
    expect(anchors.length, path).toBeGreaterThan(0);
    for (const { href, target, rel } of anchors) {
      if (href.startsWith('#')) {
        await expect(page.locator(href), `anchor ${href} on ${path}`).toHaveCount(1);
        continue;
      }
      if (href.startsWith('mailto:')) {
        expect(href, path).toBe(`mailto:${contact.email}`);
        continue;
      }
      const url = new URL(href, origin + path);
      if (url.origin !== origin) {
        if (checked.has(url.href)) continue;
        checked.add(url.href);
        expect(url.protocol, href).toBe('https:');
        // A link that opens a new tab must not hand it a window.opener.
        if (target === '_blank') expect(rel, href).toContain('noopener');
        continue;
      }
      if (/\.(png|webp|jpe?g|svg|ico)$/.test(url.pathname)) {
        if (checked.has(url.pathname)) continue;
        checked.add(url.pathname);
        const img = await request.get(url.href);
        expect(img.status(), url.pathname).toBe(200);
        expect(img.headers()['content-type'], url.pathname).toMatch(/^image\//);
        continue;
      }
      if (!visited.has(url.pathname)) pages.push(url.pathname);
    }
    await page.close();
  }
  // Today: the home page and the two legal pages.
  expect([...visited].sort()).toEqual(['/', '/privacy', '/terms']);
});

test('@live footer links lead to the legal pages, and their back links lead home', async ({ page, isMobile }) => {
  const problems = watchProblems(page);
  await page.goto('/');
  for (const [href, title] of [
    ['/terms', 'Terms of Service'],
    ['/privacy', 'Privacy Policy'],
  ]) {
    await press(page, isMobile, page.locator(`footer a[href="${href}"]`));
    await expect(page).toHaveURL(href);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator(`a.contact-email[href="mailto:${contact.email}"]`)).toBeVisible();
    // Without this, a broken back link still passes: the legal pages share
    // the footer, so the next click would succeed from there too.
    await press(page, isMobile, page.locator('a.back-link'));
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(HOME_H1);
  }
  expect(problems).toEqual([]);
});

test('@live an unknown page is a 404 in the site\'s style, with a way home', async ({ page, isMobile }) => {
  const problems = watchProblems(page);
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Skylar Technology LLC');
  expect(await page.locator('html').getAttribute('lang')).toBe('en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
  await press(page, isMobile, page.getByRole('link', { name: /Back to Skylar Technology LLC/ }));
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(HOME_H1);
  // The 404 itself is expected: watchProblems skips its response, and
  // Chromium also logs it to the console. Anything else is a real problem.
  // At most that one line: a second would be a missing resource.
  expect(problems.filter((p) => !/status of 404/.test(p))).toEqual([]);
  expect(problems.length).toBeLessThanOrEqual(1);
});

test('@live Open Source Projects, built with AI shows three cards with GitHub and site links', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section.projects');
  await expect(section.locator('h2')).toHaveText('Open Source Projects, built with AI');
  await expect(section.locator('.card h3')).toHaveText(projects.map((p) => p.title));

  for (const { title, repoUrl, siteUrl } of projects) {
    const repoLink = section.getByRole('link', { name: `GitHub: ${title} source` });
    await expect(repoLink).toBeVisible();
    await expect(repoLink).toHaveAttribute('href', repoUrl);
    const siteLink = section.getByRole('link', { name: new URL(siteUrl).host, exact: true });
    await expect(siteLink).toBeVisible();
    await expect(siteLink).toHaveAttribute('href', siteUrl);
  }
  await expect(section.locator('a')).toHaveCount(projects.length * 2);
  for (const a of await section.locator('a').all()) {
    await expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(a).toHaveAttribute('target', '_blank');
  }
});

test('@live a project link opens its site in a new tab', async ({ page, context, isMobile }) => {
  // Answered locally: the click is what is under test, not the third party.
  await context.route(/^https:\/\/(?!www\.skylar\.technology)/, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' }),
  );
  await page.goto('/');
  const first = projects[0];
  for (const href of [first.repoUrl, first.siteUrl]) {
    const link = page.locator(`section.projects a[href="${href}"]`);
    const [popup] = await Promise.all([page.waitForEvent('popup'), press(page, isMobile, link)]);
    // A bare host gains a trailing slash in the address bar.
    await expect.poll(() => popup.url().replace(/\/$/, '')).toBe(href);
    await popup.close();
  }
});

test.describe('keyboard', () => {
  test('Tab reaches every link in order, each with a visible focus ring', async ({ page, isMobile }) => {
    test.skip(isMobile, 'no keyboard on a phone');
    await page.goto('/');
    const expected = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
    const order: string[] = [];
    for (let i = 0; i < expected.length; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const s = getComputedStyle(el);
        return { href: el.getAttribute('href') ?? el.tagName, ring: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 };
      });
      expect(focused.ring, `focus ring on ${focused.href}`).toBe(true);
      order.push(focused.href);
    }
    expect(order).toEqual(expected);
    expect(order).toContain(links[0].url);
  });
});

test.describe('on a phone', () => {
  test('@live fits without sideways scrolling, on every page', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phone projects only');
    for (const path of ['/', '/terms', '/privacy']) {
      await page.goto(path);
      await scrollThrough(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});

test('@live on a phone-sized screen, Engagement cards are only as tall as their text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const pills = page.locator('.engagement .pill');
  await expect(pills).toHaveCount(3);
  // The stacked column once turned the 160px flex-basis into each card's
  // height, leaving several empty lines under one line of text.
  for (const pill of await pills.all()) {
    const height = (await pill.boundingBox())?.height ?? 0;
    expect(height).toBeGreaterThan(0);
    expect(height).toBeLessThan(110);
  }
});
