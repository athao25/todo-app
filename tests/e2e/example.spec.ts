import { test, expect } from '@playwright/test';

test('basic todo app test', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page loads
  await expect(page).toHaveTitle('To Do List - Task Management');
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.getByTestId('app-title')).toHaveText('To Do List');
  
  // Look for the main heading
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
});