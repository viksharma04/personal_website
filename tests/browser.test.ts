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

test('entering the room plays a plain fade (no CRT line) then navigates', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /enter the room/i }).click();
  await expect(page.getByTestId('enter-transition')).toBeVisible();
  await expect(page.getByTestId('crt-line')).toHaveCount(0); // the line is the terminal's now
  await expect(page).toHaveURL(/\/room$/);
});

test('the room shows the retro loading bar while the scene loads', async ({ page }) => {
  await page.goto('/room');
  await expect(page.getByTestId('room-loader')).toBeVisible();
});

test('navigating to the terminal plays the CRT transition then lands there', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Terminal' }).click();
  await expect(page.getByTestId('enter-transition')).toBeVisible();
  await expect(page.getByTestId('crt-line')).toBeVisible();
  await expect(page).toHaveURL(/\/terminal$/);
});

test('reduced motion still enters the room', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: /enter the room/i }).click();
  await expect(page).toHaveURL(/\/room$/);
});

test('terminal close button returns to the previous page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Terminal' }).click();
  await expect(page).toHaveURL(/\/terminal$/);
  await page.getByRole('button', { name: 'Close terminal' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: /hello, i'm vik\./i })).toBeVisible();
});

test('terminal close button falls back to /room when opened directly', async ({ page }) => {
  await page.goto('/terminal');
  await page.getByRole('button', { name: 'Close terminal' }).click();
  await expect(page).toHaveURL(/\/room$/);
});
