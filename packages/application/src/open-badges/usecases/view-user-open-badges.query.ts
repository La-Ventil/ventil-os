import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import { mapOpenBadgeProgressToViewModel } from '../../presenters/open-badge';
import type { Query } from '../../usecase';

export const viewUserOpenBadges: Query<[string], OpenBadgeViewModel[]> = async (userId: string) => {
  const progresses = await openBadgeRepository.listOpenBadgesForUser(userId);
  return progresses.map(mapOpenBadgeProgressToViewModel);
};
