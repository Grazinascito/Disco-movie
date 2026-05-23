import { test, expect } from '@playwright/test';

test('navigates between paginated catalogue pages', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#pagination-container')).toBeVisible();
  await expect(page.locator('#pagination-container')).toContainText('Showing 1 to 8');

  await page.locator('#pagination-next-btn').click();

  await expect(page.locator('#pagination-container')).toContainText('Showing 9 to 16');
  await expect(page.locator('#pagination-page-2')).toHaveClass(/bg-indigo-500/);
});
