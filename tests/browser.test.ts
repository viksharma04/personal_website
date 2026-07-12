import { test, expect } from '@playwright/test';

test('room route renders the 3D canvas', async ({ page }) => {
  await page.goto('/room');
  await expect(page).toHaveURL(/\/room$/);
  await expect(page.locator('canvas')).toBeAttached();
});
