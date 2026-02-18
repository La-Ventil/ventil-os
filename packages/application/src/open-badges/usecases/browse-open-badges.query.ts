import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import { mapOpenBadgeToViewModel } from '../../presenters/open-badge';
import type { Query } from '../../usecase';

export const browseOpenBadges: Query<[], OpenBadgeViewModel[]> = async () => {
  const badges = await openBadgeRepository.listOpenBadges();
  return badges.map(mapOpenBadgeToViewModel);
};
