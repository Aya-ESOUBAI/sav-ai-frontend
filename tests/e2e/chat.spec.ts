import { test, expect } from '@playwright/test';
import { setAuthCookies } from '../helpers/playwright-utils';

test('Chat IA replies and can escalate to ticket', async ({ page }) => {
  await setAuthCookies(page, { role: 'CLIENT' });
  await page.goto('/chat');

  // Ensure no conversations/tickets
  await page.evaluate(() => { localStorage.removeItem('sav_chat_conversations_v1'); localStorage.removeItem('sav_tickets_v1'); });
  await page.reload();

  // Create conversation and send message
  await page.click('text=Nouvelle');
  await page.fill('input[aria-label=message]', 'Problème d imprimante E17');
  await page.click('button:has-text("Envoyer")');

  // Wait for AI reply (simulate delay up to ~2000ms)
  await page.waitForSelector('text=Merci pour votre message', { timeout: 5000 });

  // Escalate to ticket
  // Click the Escalader button
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '[Escalader]' }).click();

  // Confirm that we were redirected to /tickets
  await page.waitForURL('**/tickets');
  await expect(page.locator('text=Escalade:')).toBeVisible();
});
