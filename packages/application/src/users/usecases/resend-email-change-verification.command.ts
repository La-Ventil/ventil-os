import { userRepository } from '@repo/db';
import type { Command } from '../../usecase';
import { createEmailVerificationToken } from '../email-tokens';
import { toDomainUser } from '../mappers';
import { Email } from '@repo/domain/user/email';
import { User } from '@repo/domain/user/user';

export type ResendEmailChangeVerificationResult =
  | { ok: true; email: string; token: string }
  | { ok: false; reason: 'no-pending-email' };

export const resendEmailChangeVerification: Command<[string], ResendEmailChangeVerificationResult> = async (
  userId: string
) => {
  const user = await userRepository.getUserProfileById(userId);

  if (!user) {
    return { ok: false, reason: 'no-pending-email' };
  }

  const domainUser = toDomainUser(user);

  if (!User.hasPendingEmail(domainUser)) {
    return { ok: false, reason: 'no-pending-email' };
  }

  const pendingEmail = domainUser.pendingEmail as Email;
  const { token } = await createEmailVerificationToken(pendingEmail);
  return { ok: true, email: pendingEmail, token };
};
