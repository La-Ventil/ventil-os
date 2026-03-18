import { expect, test } from '../../fixtures/test';
import { getAuthTestRepository } from '../../helpers/auth-test-repository';

const newPassword = 'Renewed123';
const privacySafeResetMessage = /si votre email existe|if your email exists/i;

test.describe('Update password journey', () => {
  test('password reset lets the user sign in with a new password', async ({ page, seedUsers, workerWebRuntime }) => {
    const email = seedUsers.external.email;

    await page.goto('/forgot-password');
    const emailField = page.getByRole('textbox', { name: /email/i });
    await emailField.click();
    await emailField.pressSequentially(email);
    await emailField.blur();
    await page.locator('form button[type="submit"]').click();

    await expect(page.getByRole('alert').first()).toContainText(privacySafeResetMessage);

    const resetToken = await getAuthTestRepository(workerWebRuntime?.dbSlot).getResetTokenByEmail(email);

    await page.goto(`/update-password/${resetToken}`);
    await page.locator('input[name="password"]').fill(newPassword);
    await page.locator('input[name="passwordConfirmation"]').fill(newPassword);
    await page.locator('form button[type="submit"]').click();

    await expect(page).toHaveURL(/\/hub\/profile/, { timeout: 15_000 });

    await page.context().clearCookies();
    await page.goto('/login');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(seedUsers.external.password);
    await page.locator('form button[type="submit"]').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: /identifiants|mot de passe|password/i })
        .first()
    ).toContainText(/identifiants|mot de passe|password/i);

    await page.locator('input[name="password"]').fill(newPassword);
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/hub\/profile/, { timeout: 15_000 });
  });

  test('back button from update password returns to login', async ({ page }) => {
    await page.goto('/update-password/fake-token');

    await page.getByRole('link', { name: /retour|back/i }).click();

    await expect(page).toHaveURL(/\/login$/);
  });
});
