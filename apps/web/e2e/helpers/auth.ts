import type { Page } from '@playwright/test';

export type LoginCredentials = {
  email: string;
  password: string;
};

export async function loginWithCredentials(page: Page, credentials: LoginCredentials): Promise<void> {
  await page.goto('/login');

  await page.locator('input[name="email"]').fill(credentials.email);
  await page.locator('input[name="password"]').fill(credentials.password);

  await page.locator('form button[type="submit"]').click();
  await page.waitForURL(/\/hub\/profile/, { timeout: 15_000 });
}
