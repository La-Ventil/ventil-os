import { expect, type Page } from '@playwright/test';
import type { LoginCredentials } from './auth';

export const privacySafeResetMessage = /if your email exists/i;

export async function openLoginPage(page: Page): Promise<void> {
  await page.goto('/login');
}

export async function submitLoginForm(page: Page, credentials: LoginCredentials): Promise<void> {
  await openLoginPage(page);
  await page.locator('input[name="email"]').fill(credentials.email);
  await page.locator('input[name="password"]').fill(credentials.password);
  await page.locator('form button[type="submit"]').click();
}

export async function requestPasswordReset(page: Page, email: string): Promise<void> {
  await page.goto('/forgot-password');

  const emailField = page.getByRole('textbox', { name: /email/i });
  await emailField.click();
  await emailField.pressSequentially(email);
  await emailField.blur();
  await page.locator('form button[type="submit"]').click();
}

export async function expectPrivacySafeResetNotice(page: Page): Promise<void> {
  await expect(page.getByRole('alert').first()).toContainText(privacySafeResetMessage);
}
