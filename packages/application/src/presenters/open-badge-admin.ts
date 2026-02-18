import type { OpenBadgeAdminRow } from '@repo/db/schemas';
import { toActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';

export const mapOpenBadgeAdminToViewModel = (badge: OpenBadgeAdminRow): OpenBadgeAdminViewModel => ({
  id: badge.id,
  name: badge.name,
  levelsCount: badge._count.levels,
  assignedCount: badge._count.openBadgeProgresses,
  status: toActivityStatus(badge.status)
});
