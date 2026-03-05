import { userRepository } from '@repo/db';
import type { Query } from '../../usecase';

export const isUserBlocked: Query<[string], boolean> = async (userId: string): Promise<boolean> => {
  return userRepository.isUserBlocked(userId);
};
