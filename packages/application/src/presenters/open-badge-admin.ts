import type { OpenBadgeAdminReadModel } from '@repo/db/read-models';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';

export const mapOpenBadgeAdminToViewModel = (badge: OpenBadgeAdminReadModel): OpenBadgeAdminViewModel => ({
  id: badge.id,
  name: badge.name,
  coverImage: badge.coverImage ?? null,
  levelsCount: badge._count.levels,
  assignedCount: badge._count.openBadgeProgresses,
  machineLinksCount: badge._count.machines,
  status: badge.status
});
