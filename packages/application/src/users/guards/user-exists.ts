import { userRepository } from '@repo/db';
export const userExists = async (userId: string): Promise<boolean> => {
  const user = await userRepository.exists(userId);
  return Boolean(user);
};
