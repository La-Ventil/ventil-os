import { expect, test } from '../../fixtures/test';
import { getEmailVerificationToken, givenUnverifiedUser, givenVerifiedUser } from '../../helpers/auth-fixtures';
import { submitLoginForm } from '../../helpers/auth-flows';
import { SIGN_IN_REJECTED } from '../../helpers/sign-in-messages';

const RESEND_CTA = /send me a new link/i;
const RESEND_SENT = /a new link is on its way/i;

test.describe('Email verification', () => {
  test('a dead link gets the account verified again through a fresh one', async ({
    page,
    seedUsers,
    workerWebRuntime
  }) => {
    const email = seedUsers.external.email;
    const dbSlot = workerWebRuntime?.dbSlot;
    await givenUnverifiedUser({ email, dbSlot });

    try {
      await page.goto(`/verify-email/not-a-real-token?email=${encodeURIComponent(email)}`);
      await expect(page.getByRole('alert').filter({ hasText: /verification link is invalid/i })).toBeVisible();

      const since = new Date();
      await page.getByRole('button', { name: RESEND_CTA }).click();
      await expect(page.getByText(RESEND_SENT)).toBeVisible();

      // The link really has to arrive and really has to work: a silent failure would still have
      // shown that confirmation, since the answer never says whether the address is known.
      const token = await getEmailVerificationToken({ email, dbSlot, since });
      await page.goto(`/verify-email/${token}?email=${encodeURIComponent(email)}`);

      await expect(page.getByRole('alert').filter({ hasText: /your email has been verified/i })).toBeVisible();
    } finally {
      await givenVerifiedUser({ email, dbSlot });
    }
  });

  test('an unverified sign-in attempt offers the link instead of a dead end', async ({
    page,
    seedUsers,
    workerWebRuntime
  }) => {
    const email = seedUsers.external.email;
    const password = seedUsers.external.password;
    const dbSlot = workerWebRuntime?.dbSlot;

    // Signing in for real first: without it, a later refusal proves nothing, since a stale password
    // would produce the very same screen and the rule under test could be deleted unnoticed.
    await submitLoginForm(page, { email, password });
    await expect(page).toHaveURL(/\/hub\/profile/, { timeout: 15_000 });
    await page.context().clearCookies();

    await givenUnverifiedUser({ email, dbSlot });

    try {
      await submitLoginForm(page, { email, password });

      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByRole('alert').first()).toHaveText(SIGN_IN_REJECTED);
      await expect(page.getByRole('button', { name: RESEND_CTA })).toBeVisible();
    } finally {
      await givenVerifiedUser({ email, dbSlot });
    }
  });

  test('an address nobody owns is answered exactly like a known one', async ({ page }) => {
    await page.goto('/verify-email/not-a-real-token?email=nobody%40example.org');

    await page.getByRole('button', { name: RESEND_CTA }).click();

    await expect(page.getByText(RESEND_SENT)).toBeVisible();
  });

  // The three rejections below must be indistinguishable: same words, same offer. Each one exists
  // because a plausible change — naming the reason, or offering the link only to real accounts —
  // would otherwise pass unnoticed.
  test('a wrong password on a verified account is refused in exactly the same words', async ({ page, seedUsers }) => {
    await submitLoginForm(page, { email: seedUsers.student.email, password: 'definitely-not-the-password' });

    await expect(page.getByRole('alert').first()).toHaveText(SIGN_IN_REJECTED);
    await expect(page.getByRole('button', { name: RESEND_CTA })).toBeVisible();
  });

  test('an address with no account at all is refused in exactly the same words', async ({ page }) => {
    await submitLoginForm(page, { email: 'nobody@example.org', password: 'definitely-not-the-password' });

    await expect(page.getByRole('alert').first()).toHaveText(SIGN_IN_REJECTED);
    await expect(page.getByRole('button', { name: RESEND_CTA })).toBeVisible();
  });
});
