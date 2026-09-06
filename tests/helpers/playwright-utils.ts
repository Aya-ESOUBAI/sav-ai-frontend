import { Page } from '@playwright/test';

export async function setAuthCookies(page: Page, opts: { token?: string; role?: string; name?: string; email?: string } = {}) {
  const token = opts.token ?? 'e2e-fake-token';
  const user = {
    id: 'e2e-user-1',
    nom: opts.name ?? 'E2E Test User',
    email: opts.email ?? 'e2e@example.com',
    role: opts.role ?? 'ADMINISTRATEUR',
  };

  // Playwright expects cookie objects
  await page.context().addCookies([
    {
      name: 'token',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
    },
    {
      name: 'user',
      value: JSON.stringify(user),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
    },
  ]);
}
