import { test, expect } from '@playwright/test';
import { setAuthCookies } from '../helpers/playwright-utils';

test('Create, update status and delete a ticket', async ({ page }) => {
  await setAuthCookies(page, { role: 'CLIENT' });
  await page.goto('/tickets');

  // Ensure no tickets at start (clear localStorage)
  await page.evaluate(() => localStorage.removeItem('sav_tickets_v1'));
  await page.reload();

  // Open new ticket form
  await page.click('text=Nouveau Ticket');
  await expect(page.locator('form').getByText('Titre')).toBeVisible();

  await page.locator('form input').first().fill('Imprimante E17');
  await page.locator('form textarea').fill('L imprimante affiche erreur E17 et s arrete');
  await page.locator('form select').first().selectOption('High');
  await page.locator('form').getByRole('button', { name: 'Enregistrer' }).click();

  // Expect ticket to appear in table
  await expect(page.getByRole('cell', { name: 'Imprimante E17' })).toBeVisible();

  // Change status to In Progress
  const statusSelect = page.locator('tbody tr').locator('select').first();
  await statusSelect.selectOption({ label: 'In Progress' });
  await expect(page.locator('text=Mise à jour de ticket')).toBeVisible();

  // Delete ticket (handle confirm)
  page.on('dialog', dialog => dialog.accept());
  await page.click('button:has-text("Supprimer")');

  // Expect no tickets
  await expect(page.locator('text=Aucun ticket')).toBeVisible();
});
