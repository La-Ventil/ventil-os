import { hashToken } from '@repo/crypto';
import { userRepository } from '@repo/db';
import type { Command } from '../../usecase';
import { setNewPassword } from '../passwords';

export type ResetPasswordResult = { ok: true; email: string } | { ok: false; reason: 'invalid-token' };

export const resetPassword: Command<[string, string], ResetPasswordResult> = async (
  token: string,
  newPassword: string
) => {
  const user = await userRepository.findUserByValidResetToken(hashToken(token));

  if (!user) {
    return { ok: false, reason: 'invalid-token' };
  }

  // Reaching this point means following a link sent to that address: exactly the proof email
  // verification asks for. Without this, an unverified account could complete a reset and still be
  // refused at sign-in, having done the mailbox round-trip for nothing.
  //
  // Done before the password, because writing the password also burns the token: should this fail,
  // the link still works and the user can simply try again.
  if (!user.emailVerified) {
    await userRepository.markEmailVerified(user.id);
  }

  await setNewPassword(user.id, newPassword);

  return { ok: true, email: user.email };
};
