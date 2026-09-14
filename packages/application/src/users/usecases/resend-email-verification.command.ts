import { userRepository, verificationTokenRepository } from '@repo/db';
import type { Command } from '../../usecase';
import { EMAIL_VERIFICATION_TOKEN_TTL_MS, createEmailVerificationToken } from '../email-tokens';

/** Two links a few seconds apart help nobody, and the endpoint is reachable without signing in. */
const RESEND_COOLDOWN_MS = 5 * 60 * 1000;

/**
 * `sent: false` covers every case the caller must not be able to tell apart — unknown address,
 * already verified, or a link issued moments ago. The caller always answers the same thing, so the
 * form cannot be used to find out who has an account here.
 */
export type ResendEmailVerificationResult =
  { sent: true; email: string; firstName: string; lastName: string; token: string } | { sent: false };

export const resendEmailVerification: Command<[string], ResendEmailVerificationResult> = async (email: string) => {
  // Strictly the account whose own address this is. The `OrPending` lookup would also match an
  // account merely *requesting* this address, and issuing a token would destroy its pending one.
  const user = await userRepository.getUserProfileByEmail(email);

  if (!user || user.emailVerified) {
    return { sent: false };
  }

  const activeToken = await verificationTokenRepository.findByIdentifier(email);

  if (activeToken) {
    // The table stores no creation date, so it is derived from the fixed lifetime. A negative age
    // means the row predates a change of that constant: prefer sending over refusing forever.
    const ageMs = Date.now() - (activeToken.expires.getTime() - EMAIL_VERIFICATION_TOKEN_TTL_MS);
    if (ageMs >= 0 && ageMs < RESEND_COOLDOWN_MS) {
      return { sent: false };
    }
  }

  const { token } = await createEmailVerificationToken(email);

  return {
    sent: true,
    email,
    firstName: user.firstName,
    lastName: user.lastName,
    token
  };
};
