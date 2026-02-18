import { hashSecret } from '@repo/crypto';
import { userRepository } from '@repo/db';

export const setNewPassword = async (userId: string, password: string): Promise<{ id: string; email: string }> => {
  const { salt, hashedSecret, iterations } = await hashSecret(password);
  return userRepository.updateUserPassword(userId, {
    password: hashedSecret,
    salt,
    iterations
  });
};
