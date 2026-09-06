import { test, expect } from '@playwright/test';

test('Login flow: user can login and reach dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[type=email]', 'e2e@test.com');
  await page.fill('input[type=password]', 'password123');
  await page.selectOption('select[name=role]', 'CLIENT');
  await page.click('button:has-text("Connexion")');

  // In dev mode the app sets cookies and redirects — wait for navigation
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText(/Bonjour,/)).toBeVisible();
});
