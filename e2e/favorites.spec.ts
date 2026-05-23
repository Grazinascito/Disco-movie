import { test, expect } from '@playwright/test';

test('favorites a movie and shows it in the favorites channel', async ({ page }) => {
  await page.goto('/');

  await page.locator('#favorite-star-btn-1').click();
  await page.locator('#channel-favorites').click();

  await expect(page.locator('#movie-card-1')).toBeVisible();
  await expect(page.locator('#movies-layout-grid')).toContainText('Interstellar');
  await expect(page.locator('#channel-favorites')).toContainText('1');
});
