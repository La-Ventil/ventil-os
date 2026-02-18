import { verificationTokenRepository } from '@repo/db';
import { generateToken } from './tokens';

const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export const createEmailVerificationToken = async (email: string) => {
  const token = generateToken(24);
  const expires = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS);

  await verificationTokenRepository.replaceToken(email, token, expires);

  return { token, expires };
};
