import { Email } from '@repo/domain/user/email';
import { User } from '@repo/domain/user/user';
import { userRepository, verificationTokenRepository } from '@repo/db';
import { toDomainUser } from '../mappers';
import type { Command } from '../../usecase';

export type EmailVerificationResult =
  | { ok: true; email: string }
  | { ok: false; reason: 'invalid' | 'expired' | 'not-found' };

export const verifyEmail: Command<[string, string], EmailVerificationResult> = async (
  email: string,
  token: string
) => {
  const record = await verificationTokenRepository.findByIdentifierAndToken(email, token);

  if (!record) {
    return { ok: false, reason: 'invalid' };
  }

  if (record.expires < new Date()) {
    await verificationTokenRepository.deleteByIdentifierAndToken(email, token);
    return { ok: false, reason: 'expired' };
  }

  const user = await userRepository.getUserProfileByEmailOrPending(email);

  if (!user) {
    return { ok: false, reason: 'not-found' };
  }

  let updatedUser: User;
  try {
    updatedUser = User.confirmEmail(toDomainUser(user), Email.from(email));
  } catch {
    await verificationTokenRepository.deleteByIdentifierAndToken(email, token);
    return { ok: false, reason: 'invalid' };
  }

  await userRepository.confirmUserEmail(user.id, {
    email: updatedUser.email,
    pendingEmail: updatedUser.pendingEmail ?? null,
    emailVerifiedAt: updatedUser.emailVerifiedAt ?? new Date()
  });

  await verificationTokenRepository.deleteByIdentifierAndToken(email, token);

  return { ok: true, email };
};
