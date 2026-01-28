import type { OpenBadgeAdminSchema } from '@repo/db/schemas';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';

export const mapOpenBadgeAdminToViewModel = (
  badge: OpenBadgeAdminSchema
): OpenBadgeAdminViewModel => ({
  id: badge.id,
  name: badge.name,
  levelsCount: badge._count.levels,
  assignedCount: badge._count.openBadgeProgresses,
  status: badge.status
});
