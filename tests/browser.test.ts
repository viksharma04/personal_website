import { test, expect, devices } from '@playwright/test';

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

test('returning to the room via client-side nav hides the loading bar', async ({ page }) => {
  // Regression: entering the terminal from the room and closing it returns to
  // /room via a client-side navigation. drei caches the 3D assets, so on the
  // second mount `active` never flips true and the loader used to hang forever.
  // The landing <-> room round trip exercises the same warm-cache remount
  // without needing to click the in-canvas screen.
  await page.goto('/');
  await page.getByRole('button', { name: /enter the room/i }).click();
  await expect(page).toHaveURL(/\/room$/);
  await expect(page.getByTestId('room-loader')).toBeHidden();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole('button', { name: /enter the room/i }).click();
  await expect(page).toHaveURL(/\/room$/);
  await expect(page.getByTestId('room-loader')).toBeHidden();
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

test('quotes page renders content and the back link returns home', async ({ page }) => {
  await page.goto('/quotes');
  await expect(page.getByText('Things I return to')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Principles' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Quotes' })).toBeVisible();
  await expect(page.getByText('Superintending')).toBeVisible();
  await expect(page.getByText(/swim in the waters of life/)).toBeVisible();

  await page.getByRole('link', { name: /home/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: /hello, i'm vik\./i })).toBeVisible();
});

test('terminal close button falls back to /room when opened directly', async ({ page }) => {
  await page.goto('/terminal');
  await page.getByRole('button', { name: 'Close terminal' }).click();
  await expect(page).toHaveURL(/\/room$/);
});

test('each terminal section window has its own working close button', async ({ page }) => {
  await page.goto('/terminal');
  await page.getByRole('button', { name: /^>\s*about$/i }).click();
  await page.getByRole('button', { name: /^>\s*projects$/i }).click();

  const about = page.getByRole('dialog', { name: 'ABOUT.EXE' });
  const projects = page.getByRole('dialog', { name: 'PROJECTS.EXE' });
  await expect(about).toBeVisible();
  await expect(projects).toBeVisible();

  // Closing one window closes only that window.
  await about.getByRole('button', { name: 'Close ABOUT.EXE' }).click();
  await expect(about).toBeHidden();
  await expect(projects).toBeVisible();
});

test('terminal windows stay within a phone viewport when several are open', async ({ browser }) => {
  // Use a real device profile: on mobile window.innerWidth diverges from the
  // vw-based layout viewport, which is exactly what let the cascaded windows
  // spill off the right edge. A plain setViewportSize keeps them equal and
  // would not catch the regression.
  const context = await browser.newContext({
    ...devices['Pixel 5'],
    baseURL: 'http://localhost:3000',
  });
  const page = await context.newPage();
  await page.goto('/terminal');
  await page.getByRole('button', { name: /^>\s*about$/i }).click();
  await page.getByRole('button', { name: /^>\s*projects$/i }).click();
  await page.getByRole('button', { name: /^>\s*contact$/i }).click();

  const viewport = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }));
  const windows = page.getByTestId('draggable-window');
  await expect(windows).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    const box = await windows.nth(i).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.y).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1);
  }

  await context.close();
});
