import { test, expect } from '@playwright/test';

test('filters movies by search and resets from empty state', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.locator('#header-movie-search');
  await searchInput.fill('Inception');

  await expect(page.locator('#movie-card-2')).toBeVisible();
  await expect(page.locator('#movies-layout-grid')).not.toContainText('Interstellar');

  await searchInput.fill('zzzznotfoundquery');
  await expect(page.locator('#empty-results-fallback')).toBeVisible();

  await page.locator('#reset-search-btn').click();

  await expect(page.locator('#movie-grid-viewport')).toBeVisible();
  await expect(page.locator('#empty-results-fallback')).toHaveCount(0);
  await expect(page.locator('#movie-card-1')).toBeVisible();
});
