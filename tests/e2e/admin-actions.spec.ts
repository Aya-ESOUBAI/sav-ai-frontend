import { test, expect } from '@playwright/test';
import { setAuthCookies } from '../helpers/playwright-utils';

test('Admin: view users and docs and open settings', async ({ page }) => {
  await setAuthCookies(page, { role: 'ADMINISTRATEUR' });
  await page.goto('/admin');

  await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Gestion des utilisateurs et rôles' })).toBeVisible();
  await expect(page.locator('text=Utilisateurs actifs')).toBeVisible();
  await expect(page.locator('text=Gestion de la base documentaire')).toBeVisible();

  // Click invite user (button should exist)
  await page.click('button:has-text("Inviter un utilisateur")');

  // Open parameters
  await page.click('button:has-text("Paramètres")');

  // Basic assertion: settings icon present
  await expect(page.getByRole('heading', { name: 'Configuration IA & RAG' })).toBeVisible();
});
