import { expect, test } from '../../fixtures/test';
import {
  getPasswordResetToken,
  givenPassword,
  givenUnverifiedUser,
  givenVerifiedUser,
  isEmailVerified
} from '../../helpers/auth-fixtures';
import { expectPrivacySafeResetNotice, requestPasswordReset, submitLoginForm } from '../../helpers/auth-flows';
import { SIGN_IN_REJECTED } from '../../helpers/sign-in-messages';

const newPassword = 'Renewed123';

test.describe('Update password journey', () => {
  test('password reset lets the user sign in with a new password', async ({ page, seedUsers, workerWebRuntime }) => {
    const email = seedUsers.external.email;
    const dbSlot = workerWebRuntime?.dbSlot;

    try {
      // Captured before triggering: mails are not awaited, and Mailpit still holds older ones.
      const since = new Date();
      await requestPasswordReset(page, email);

      await expectPrivacySafeResetNotice(page);

      const resetToken = await getPasswordResetToken({ email, dbSlot, since });

      await page.goto(`/update-password/${resetToken}`);
      await page.locator('input[name="password"]').fill(newPassword);
      await page.locator('input[name="passwordConfirmation"]').fill(newPassword);
      await page.locator('form button[type="submit"]').click();

      await expect(page).toHaveURL(/\/hub\/profile/, { timeout: 15_000 });

      await page.context().clearCookies();
      await submitLoginForm(page, {
        email,
        password: seedUsers.external.password
      });

      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByRole('alert').first()).toHaveText(SIGN_IN_REJECTED);

      await page.locator('input[name="password"]').fill(newPassword);
      await page.locator('form button[type="submit"]').click();
      await expect(page).toHaveURL(/\/hub\/profile/, { timeout: 15_000 });
    } finally {
      // Left as found: later specs sign in as this account with the seeded password, and a stale
      // password makes them fail for a reason that has nothing to do with what they test.
      await givenPassword({ email, dbSlot, password: seedUsers.external.password });
    }
  });

  test('back button from update password returns to login', async ({ page }) => {
    await page.goto('/update-password/fake-token');

    await page.getByRole('link', { name: /back/i }).click();

    await expect(page).toHaveURL(/\/login$/);
  });

  test('a reset also verifies an account that never confirmed its address', async ({
    page,
    seedUsers,
    workerWebRuntime
  }) => {
    const email = seedUsers.studentVisitor.email;
    const dbSlot = workerWebRuntime?.dbSlot;
    await givenUnverifiedUser({ email, dbSlot });

    try {
      const since = new Date();
      await requestPasswordReset(page, email);
      await expectPrivacySafeResetNotice(page);

      const resetToken = await getPasswordResetToken({ email, dbSlot, since });

      await page.goto(`/update-password/${resetToken}`);
      await page.locator('input[name="password"]').fill(newPassword);
      await page.locator('input[name="passwordConfirmation"]').fill(newPassword);
      await page.locator('form button[type="submit"]').click();

      await expect(page).toHaveURL(/\/hub\/profile/, { timeout: 15_000 });

      // Landing on the profile alone would also pass if sign-in stopped requiring a confirmed
      // address at all: the stored flag is what actually distinguishes the two.
      expect(await isEmailVerified({ email, dbSlot })).toBe(true);
    } finally {
      await givenVerifiedUser({ email, dbSlot });
      await givenPassword({ email, dbSlot, password: seedUsers.studentVisitor.password });
    }
  });
});
