import { test, expect } from '@playwright/test';
import { setAuthCookies } from '../helpers/playwright-utils';

test('Admin page access and basic checks', async ({ page }) => {
  // set admin cookies to simulate authenticated admin
  await page.goto('/');
  await setAuthCookies(page, { role: 'ADMINISTRATEUR', name: 'E2E Admin' });

  // navigate to admin
  await page.goto('/admin');
  await expect(page).toHaveURL(/admin/);

  // Check presence of key elements
  await expect(page.locator('text=Interface d\'administration')).toBeVisible();
  await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Gestion des utilisateurs et rôles' })).toBeVisible();
  await expect(page.locator('text=Gestion de la base documentaire')).toBeVisible();
});
