import { userRepository } from '@repo/db';
import { generateToken } from '../tokens';
import type { Command } from '../../usecase';

export type PasswordResetRecipient = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

const findUserForPasswordReset = async (email: string): Promise<PasswordResetRecipient | null> => {
  const user = await userRepository.findUserForPasswordReset(email);
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
};

export const requestPasswordReset: Command<[string], {
  user: PasswordResetRecipient | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
}> = async (email: string) => {
  const user = await findUserForPasswordReset(email);

  if (!user) {
    return { user: null, resetToken: null, resetTokenExpiry: null };
  }

  const resetToken = generateToken(24);
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await userRepository.setResetToken(user.id, resetToken, resetTokenExpiry);

  return { user, resetToken, resetTokenExpiry };
};
