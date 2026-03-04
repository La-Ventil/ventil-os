import { openBadgeRepository } from '@repo/db';
import { isActive } from '@repo/domain/activity-status';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import { mapOpenBadgeProgressToViewModel } from '../../presenters/open-badge';
import type { Query } from '../../usecase';

export const viewUserOpenBadges: Query<[string, { includeInactive?: boolean }?], OpenBadgeViewModel[]> = async (
  userId: string,
  options?: { includeInactive?: boolean }
) => {
  const progresses = await openBadgeRepository.listOpenBadgesForUser(userId);
  const visibleProgresses = options?.includeInactive
    ? progresses
    : progresses.filter((progress) => isActive(progress.openBadge.status));

  return visibleProgresses.map(mapOpenBadgeProgressToViewModel);
};
