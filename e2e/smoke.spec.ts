import { test, expect } from '@playwright/test';

test('home page loads with the welcome message', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Welcome to Skylar Technology LLC');
  await expect(page.locator('img[alt="Skylar Technology LLC logo"]')).toBeVisible();
});

test('footer links to the Terms of Service and Privacy Policy pages', async ({ page }) => {
  await page.goto('/');
  await page.click('footer a[href="/terms"]');
  await expect(page.locator('h1')).toHaveText('Terms of Service');

  const backToHome = page.locator('a.back-link');
  await backToHome.click();

  await page.click('footer a[href="/privacy"]');
  await expect(page.locator('h1')).toHaveText('Privacy Policy');
});

test('/health reports ok', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe('ok');
  expect(body.service).toBe('www-skylar-technology');
  expect(typeof body.version).toBe('string');
});
