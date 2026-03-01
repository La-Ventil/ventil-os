import { expect, test } from '../../fixtures/test';

const createUnknownEmail = (): string => `playwright.reset.${Date.now()}@ventil.local`;

test.describe('Forgot password journey', () => {
  test('back link returns to login', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.getByRole('link', { name: /retour|back/i }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('submitting an unknown email still returns the privacy-safe success state', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.locator('input[name="email"]').fill(createUnknownEmail());
    await page.locator('form button[type="submit"]').click();

    const alert = page.locator('.MuiAlert-root[role="alert"]');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/mot de passe|password/i);
    await expect(page).toHaveURL(/\/forgot-password$/);
  });
});
