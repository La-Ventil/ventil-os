/**
 * The one and only wording a rejected sign-in may use, copied from `apps/web/messages/en.json`
 * (Playwright forces `APP_LOCALE=en`).
 *
 * Spelled out on purpose: asserting a substring such as /sign-in failed/i would still pass if a
 * reason were appended to it, which is precisely the disclosure these tests exist to forbid.
 */
export const SIGN_IN_REJECTED =
  'Sign-in failed. Check your address and password. If your address was never confirmed, ask for a new link below.';
