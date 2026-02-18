import { userRepository, verificationTokenRepository } from '@repo/db';
import type { Command } from '../../usecase';
import { toDomainUser } from '../mappers';
import { Email } from '@repo/domain/user/email';
import { User } from '@repo/domain/user/user';

export type CancelEmailChangeResult = { ok: true } | { ok: false; reason: 'no-pending-email' };

export const cancelEmailChange: Command<[string], CancelEmailChangeResult> = async (userId: string) => {
  const user = await userRepository.getUserProfileById(userId);

  if (!user) {
    return { ok: false, reason: 'no-pending-email' };
  }

  const domainUser = toDomainUser(user);
  if (!User.hasPendingEmail(domainUser)) {
    return { ok: false, reason: 'no-pending-email' };
  }

  const pendingEmail = domainUser.pendingEmail as Email;
  const updated = User.clearPendingEmail(domainUser);

  await userRepository.updatePendingEmail(userId, updated.pendingEmail ?? null);
  await verificationTokenRepository.deleteByIdentifier(pendingEmail);

  return { ok: true };
};
