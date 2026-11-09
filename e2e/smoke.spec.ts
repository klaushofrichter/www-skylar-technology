import { test, expect } from '@playwright/test';

test('home page loads with the welcome message', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Welcome to Skylar Technology LLC');
  await expect(page.locator('img[alt="Skylar Technology LLC logo"]')).toBeVisible();
});

test('home page exposes Open Graph tags', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://www.skylar.technology/assets/skylar-256x256.png'
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Skylar Technology LLC'
  );
});

test('footer links to the Terms of Service and Privacy Policy pages', async ({ page }) => {
  await page.goto('/');
  await page.click('footer a[href="/terms"]');
  await expect(page.locator('h1')).toHaveText('Terms of Service');

  const backToHome = page.locator('a.back-link');
  await backToHome.click();
  // Without this, a broken back link still passes: the Terms page has the same
  // footer, so the Privacy click below would succeed from there too.
  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toHaveText('Welcome to Skylar Technology LLC');

  await page.click('footer a[href="/privacy"]');
  await expect(page.locator('h1')).toHaveText('Privacy Policy');
});

test('Open Source Projects, built with AI shows three cards with GitHub and site links', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section.projects');
  await expect(section.locator('h2')).toHaveText('Open Source Projects, built with AI');
  await expect(section.locator('.card h3')).toHaveText(['Games', 'Cams', 'Art']);

  const projects = [
    ['Games', 'https://github.com/klaushofrichter/games-service', 'https://games.skylar.technology'],
    ['Cams', 'https://github.com/klaushofrichter/cams', 'https://cams.skylar.technology'],
    ['Art', 'https://github.com/klaushofrichter/art', 'https://art.klaushofrichter.net'],
  ];
  for (const [title, repo, site] of projects) {
    const repoLink = section.getByRole('link', { name: `GitHub: ${title} source` });
    await expect(repoLink).toBeVisible();
    await expect(repoLink).toHaveAttribute('href', repo);
    const siteLink = section.getByRole('link', { name: new URL(site).host, exact: true });
    await expect(siteLink).toBeVisible();
    await expect(siteLink).toHaveAttribute('href', site);
  }
  await expect(section.locator('a')).toHaveCount(6);
  for (const a of await section.locator('a').all()) {
    await expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(a).toHaveAttribute('target', '_blank');
  }
});

test('/health reports ok', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe('ok');
  expect(body.service).toBe('www-skylar-technology');
  expect(typeof body.version).toBe('string');
});

test('on a phone, Engagement cards are only as tall as their text', async ({ page }) => {
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
