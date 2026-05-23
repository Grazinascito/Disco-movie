import { test, expect } from '@playwright/test';

test('loads the movie grid and opens a movie modal', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#movie-grid-viewport')).toBeVisible();
  await expect(page.locator('#movies-layout-grid')).toBeVisible();

  await page.locator('#movie-card-1').click();

  await expect(page.locator('#movie-details-modal-box')).toBeVisible();
  await expect(page.locator('#global-modal-wrapper')).toContainText('Interstellar');
});
