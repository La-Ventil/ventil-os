import { test, expect } from '../../fixtures/test';
import { givenActiveUser, givenBlockedUser } from '../../helpers/auth-fixtures';
import { submitLoginForm } from '../../helpers/auth-flows';
import { SIGN_IN_REJECTED } from '../../helpers/sign-in-messages';

test.describe('Auth journey', () => {
  test('student can sign in and reach profile hub', async ({ page, loginAs }) => {
    await loginAs('student');

    await expect(page).toHaveURL(/\/hub\/profile/);
    await expect(page.getByRole('heading', { name: /student/i })).toBeVisible();
    await expect(page.getByText(/open badges earned/i)).toBeVisible();
  });

  test('a blocked account is refused in the same words as any other rejection', async ({
    page,
    seedUsers,
    workerWebRuntime
  }) => {
    const email = seedUsers.student.email;
    const dbSlot = workerWebRuntime?.dbSlot;
    await givenBlockedUser({ email, dbSlot });

    try {
      await submitLoginForm(page, seedUsers.student);

      await expect(page).toHaveURL(/\/login/);
      // Naming the reason would tell a stranger that this address has an account, and that it was
      // blocked. Every rejection reads the same, word for word, and offers the same way out.
      await expect(page.getByRole('alert').first()).toHaveText(SIGN_IN_REJECTED);
      await expect(page.getByRole('button', { name: /send me a new link/i })).toBeVisible();
    } finally {
      // Restored even on failure: leaving the account blocked cascades into every later test.
      await givenActiveUser({ email, dbSlot });
    }
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

    try {
      await page.reload();
      await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
    } finally {
      // `student` is the account most other journeys sign in as: leaving it blocked here would fail
      // half the suite for a reason none of those tests are about.
      await givenActiveUser({
        email: seedUsers.student.email,
        dbSlot: workerWebRuntime?.dbSlot
      });
    }
  });
});
