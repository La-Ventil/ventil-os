import { verifySecret } from '@repo/crypto';
import { userRepository } from '@repo/db';
import { setNewPassword } from '../passwords';
import type { Command } from '../../usecase';

export type ChangePasswordResult =
  | { ok: true }
  | { ok: false; reason: 'not-found' | 'invalid-password' };

export const changePassword: Command<
  [string, { currentPassword: string; newPassword: string }],
  ChangePasswordResult
> = async (email: string, input: { currentPassword: string; newPassword: string }) => {
  const credentials = await userRepository.findUserCredentialsByEmail(email);

  if (!credentials) {
    return { ok: false, reason: 'not-found' };
  }

  const isValid = await verifySecret(
    input.currentPassword,
    credentials.password,
    credentials.salt,
    credentials.iterations
  );

  if (!isValid) {
    return { ok: false, reason: 'invalid-password' };
  }

  await setNewPassword(credentials.id, input.newPassword);

  return { ok: true };
};
