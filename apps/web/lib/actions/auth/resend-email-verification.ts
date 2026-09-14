'use server';

import { getTranslations } from 'next-intl/server';
import { resendEmailVerification } from '@repo/application/users/usecases';
import { sendEmailVerification } from '@repo/application/users/account-emails';

/**
 * Reachable without signing in, so the answer must never depend on whether the address is known.
 * That rules out reporting delivery failures too: an error only an existing account can trigger
 * turns this form into a way of finding out who has an account here. Failures are logged instead.
 *
 * The mail is not awaited for the same reason — waiting would make a known address measurably
 * slower than an unknown one. It deliberately revalidates nothing: re-rendering the page would
 * re-run the verification with the now-replaced token and flip its message under the reader.
 */
export async function resendEmailVerificationAction(email: string): Promise<{ ok: boolean }> {
  const t = await getTranslations();

  try {
    const result = await resendEmailVerification(email);

    if (result.sent) {
      void sendEmailVerification({
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        token: result.token,
        t
      }).catch((error) => {
        console.error('Verification email could not be sent', error);
      });
    }
  } catch (error) {
    console.error(error);
  }

  return { ok: true };
}
