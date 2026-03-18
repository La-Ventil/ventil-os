import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export type LoginCredentials = {
  email: string;
  password: string;
};

export async function loginWithCredentials(page: Page, credentials: LoginCredentials): Promise<void> {
  await page.goto('/login');

  await page.locator('input[name="email"]').fill(credentials.email);
  await page.locator('input[name="password"]').fill(credentials.password);

  await page.locator('form button[type="submit"]').click();

  await expect
    .poll(
      async () => {
        const currentUrl = page.url();
        if (/\/hub(?:\/|$)/.test(currentUrl)) {
          return 'signed-in';
        }

        const alert = page.getByRole('alert').last();
        if (await alert.isVisible().catch(() => false)) {
          return (await alert.textContent())?.trim() || 'auth-error';
        }

        return 'pending';
      },
      { timeout: 20_000 }
    )
    .toBe('signed-in');
}
