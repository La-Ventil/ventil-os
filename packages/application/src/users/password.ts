import { hashSecret, verifySecret } from '@repo/crypto';
import type { UserPasswordResetSchema } from '@repo/db/schemas';
import { userRepository } from '@repo/db';
import { generateToken } from './tokens';

export const findUserForPasswordReset = async (email: string): Promise<UserPasswordResetSchema | null> =>
  userRepository.findUserForPasswordReset(email);

export const requestPasswordReset = async (email: string) => {
  const user = await findUserForPasswordReset(email);

  if (!user) {
    return { user: null, resetToken: null, resetTokenExpiry: null };
  }

  const resetToken = generateToken(24);
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await userRepository.setResetToken(user.id, resetToken, resetTokenExpiry);

  return { user, resetToken, resetTokenExpiry };
};

export const setUserResetToken = async (userId: string, resetToken: string, resetTokenExpiry: Date): Promise<void> => {
  await userRepository.setResetToken(userId, resetToken, resetTokenExpiry);
};

export const findUserByValidResetToken = async (token: string) => userRepository.findUserByValidResetToken(token);

export const updateUserPassword = async (userId: string, password: string) => {
  const { salt, hashedSecret, iterations } = await hashSecret(password);
  return userRepository.updateUserPassword(userId, {
    password: hashedSecret,
    salt,
    iterations
  });
};

export type ChangeUserPasswordResult =
  | { ok: true }
  | { ok: false; reason: 'not-found' | 'invalid-password' };

export const changeUserPassword = async (
  email: string,
  input: { currentPassword: string; newPassword: string }
): Promise<ChangeUserPasswordResult> => {
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

  await updateUserPassword(credentials.id, input.newPassword);

  return { ok: true };
};
