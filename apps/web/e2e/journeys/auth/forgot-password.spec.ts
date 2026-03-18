import { expect, test } from '../../fixtures/test';
import { expectPrivacySafeResetNotice, requestPasswordReset } from '../../helpers/auth-flows';

const createUnknownEmail = (): string => `playwright.reset.${Date.now()}@example.test`;

test.describe('Forgot password journey', () => {
  test('back link returns to login', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.getByRole('link', { name: /retour|back/i }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('submitting an unknown email still returns the privacy-safe success state', async ({ page }) => {
    await requestPasswordReset(page, createUnknownEmail());

    const alert = page.locator('.MuiAlert-root[role="alert"]');
    await expect(alert).toBeVisible();
    await expectPrivacySafeResetNotice(page);
    await expect(page).toHaveURL(/\/forgot-password$/);
  });
});
