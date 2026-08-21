import { test, expect } from '@playwright/test';

test('home page loads with the welcome message', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Welcome to Skylar Technology LLC');
  await expect(page.locator('img[alt="Skylar Technology LLC logo"]')).toBeVisible();
});

test('/health reports ok', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok', service: 'www-skylar-technology' });
});
