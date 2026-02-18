import { userRepository } from '@repo/db';
import type { Command } from '../../usecase';
import { setNewPassword } from '../passwords';

export type ResetPasswordResult = { ok: true; email: string } | { ok: false; reason: 'invalid-token' };

export const resetPassword: Command<[string, string], ResetPasswordResult> = async (
  token: string,
  newPassword: string
) => {
  const user = await userRepository.findUserByValidResetToken(token);

  if (!user) {
    return { ok: false, reason: 'invalid-token' };
  }

  await setNewPassword(user.id, newPassword);

  return { ok: true, email: user.email };
};
