import { hashToken } from '@repo/crypto';
import { verificationTokenRepository } from '@repo/db';
import { generateToken } from './tokens';

/**
 * Short on purpose: confirming one of these links activates an account, or moves an existing one
 * onto a new address, so a link that outlives its usefulness is a liability. Missing the window is
 * no longer a dead end — see `resendEmailVerification`.
 */
export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export const createEmailVerificationToken = async (email: string) => {
  const token = generateToken(24);
  const expires = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS);

  await verificationTokenRepository.replaceToken(email, hashToken(token), expires);

  return { token, expires };
};
