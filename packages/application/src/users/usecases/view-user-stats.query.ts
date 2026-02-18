import type { UserStats } from '@repo/domain/user/user-stats';
import { userRepository } from '@repo/db';
import type { Query } from '../../usecase';

export const viewUserStats: Query<[string], UserStats> = async (userId: string) => {
  const now = new Date();
  return userRepository.getUserStats(userId, now);
};
