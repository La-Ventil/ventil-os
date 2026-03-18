import { test, expect } from '../../fixtures/test';
import { givenActiveUser, givenBlockedUser } from '../../helpers/auth-fixtures';
import { submitLoginForm } from '../../helpers/auth-flows';

test.describe('Auth journey', () => {
  test('student can sign in and reach profile hub', async ({ page, loginAs }) => {
    await loginAs('student');

    await expect(page).toHaveURL(/\/hub\/profile/);
    await expect(page.getByRole('heading', { name: /student/i })).toBeVisible();
    await expect(page.getByText(/open badges earned/i)).toBeVisible();
  });

  test('blocked user sees a specific sign-in error message', async ({ page, seedUsers, workerWebRuntime }) => {
    await givenBlockedUser({
      email: seedUsers.student.email,
      dbSlot: workerWebRuntime?.dbSlot
    });

    await submitLoginForm(page, seedUsers.student);

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('alert').filter({ hasText: /account has been blocked/i })).toHaveText(
      /account has been blocked/i
    );

    await givenActiveUser({
      email: seedUsers.student.email,
      dbSlot: workerWebRuntime?.dbSlot
    });
  });

  test('already signed-in user is redirected to login once blocked', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('student');
    await expect(page).toHaveURL(/\/hub\/profile/);

    await givenBlockedUser({
      email: seedUsers.student.email,
      dbSlot: workerWebRuntime?.dbSlot
    });

    await page.reload();
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });

    await givenActiveUser({
      email: seedUsers.student.email,
      dbSlot: workerWebRuntime?.dbSlot
    });
  });
});
