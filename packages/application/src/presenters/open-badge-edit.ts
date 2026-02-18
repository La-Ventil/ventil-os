import type { OpenBadgeRow } from '@repo/db/schemas';
import { ActivityStatus, toActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeEditViewModel } from '@repo/view-models/open-badge-edit';

export const mapOpenBadgeToEditViewModel = (badge: OpenBadgeRow): OpenBadgeEditViewModel => ({
  id: badge.id,
  name: badge.name,
  description: badge.description ?? '',
  coverImage: badge.coverImage ?? null,
  levels: badge.levels.map((level: OpenBadgeRow['levels'][number]) => ({
    title: level.title,
    description: level.description ?? ''
  })),
  activationEnabled: toActivityStatus(badge.status) === ActivityStatus.Active
});
