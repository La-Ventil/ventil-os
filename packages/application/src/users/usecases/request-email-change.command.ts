import { verifySecret } from '@repo/crypto';
import { userRepository } from '@repo/db';
import type { Command } from '../../usecase';
import { Email } from '@repo/domain/user/email';
import { User } from '@repo/domain/user/user';
import { UserError } from '@repo/domain/user/user-errors';
import { createEmailVerificationToken } from '../email-tokens';
import { toDomainUser } from '../mappers';

export type RequestEmailChangeResult =
  | { ok: true; email: string; token: string }
  | { ok: false; reason: 'email-already-used' | 'not-found' | 'invalid-password' };

const applyEmailChange = async (userId: string, email: string): Promise<RequestEmailChangeResult> => {
  const isAvailable = await userRepository.isEmailAvailableForUser(userId, email);

  if (!isAvailable) {
    return { ok: false, reason: 'email-already-used' };
  }

  const record = await userRepository.getUserProfileById(userId);

  if (!record) {
    throw new UserError('user.notFound');
  }

  const domainUser = toDomainUser(record);
  const nextEmail = Email.from(email);

  if (domainUser.email === nextEmail) {
    const { token } = await createEmailVerificationToken(nextEmail);
    return { ok: true, email: nextEmail, token };
  }

  const updated = User.requestEmailChange(domainUser, nextEmail);

  await userRepository.updatePendingEmail(userId, updated.pendingEmail ?? null);

  const { token } = await createEmailVerificationToken(nextEmail);

  return { ok: true, email: nextEmail, token };
};

export const requestEmailChange: Command<[string, string, string], RequestEmailChangeResult> = async (
  currentEmail: string,
  currentPassword: string,
  newEmail: string
) => {
  const credentials = await userRepository.findUserCredentialsByEmail(currentEmail);

  if (!credentials) {
    return { ok: false, reason: 'not-found' };
  }

  const isValid = await verifySecret(
    currentPassword,
    credentials.password,
    credentials.salt,
    credentials.iterations
  );

  if (!isValid) {
    return { ok: false, reason: 'invalid-password' };
  }

  return applyEmailChange(credentials.id, newEmail);
};
