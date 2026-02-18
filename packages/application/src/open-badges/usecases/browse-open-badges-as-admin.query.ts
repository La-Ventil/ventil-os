import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';
import { mapOpenBadgeAdminToViewModel } from '../../presenters/open-badge-admin';
import type { Query } from '../../usecase';

export const browseOpenBadgesAsAdmin: Query<[], OpenBadgeAdminViewModel[]> = async () => {
  const badges = await openBadgeRepository.listOpenBadgesForAdmin();
  return badges.map(mapOpenBadgeAdminToViewModel);
};
