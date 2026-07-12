import { test, expect } from '@playwright/test';

test('room route renders the 3D canvas', async ({ page }) => {
  await page.goto('/room');
  await expect(page).toHaveURL(/\/room$/);
  await expect(page.locator('canvas')).toBeAttached();
});

test('landing hub renders identity, nav, and CTA at /', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /hello, i'm vik\./i })).toBeVisible();
  await expect(page.getByText('Welcome', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Terminal' })).toHaveAttribute('href', '/terminal');
  await expect(page.getByRole('link', { name: 'Quotes' })).toHaveAttribute('href', '/quotes');
  await expect(page.getByRole('button', { name: /enter the room/i })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0); // no 3D on the landing
});

test('landing footer has the correct contact links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:me@vik-sharma.com');
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://linkedin.com/in/vik-sharma-04');
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/viksharma04');
});

test('clicking Enter the room navigates to /room', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /enter the room/i }).click();
  await expect(page).toHaveURL(/\/room$/);
});
