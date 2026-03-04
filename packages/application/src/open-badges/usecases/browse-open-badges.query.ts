import { openBadgeRepository } from '@repo/db';
import { isActive } from '@repo/domain/activity-status';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import { mapOpenBadgeToViewModel, mapOpenBadgeToViewModelWithActiveLevel } from '../../presenters/open-badge';
import type { Query } from '../../usecase';

export const browseOpenBadges: Query<[string?], OpenBadgeViewModel[]> = async (userId?: string) => {
  const badges = (await openBadgeRepository.listOpenBadges()).filter((badge) => isActive(badge.status));

  if (!userId) {
    return badges.map(mapOpenBadgeToViewModel);
  }

  const progresses = await openBadgeRepository.listOpenBadgesForUser(userId);
  const activeByBadgeId = new Map(
    progresses.map((progress) => [progress.openBadge.id, progress.highestLevel ? progress.highestLevel.level : 0])
  );

  return badges.map((badge) => mapOpenBadgeToViewModelWithActiveLevel(badge, activeByBadgeId.get(badge.id) ?? 0));
};
