import type { OpenBadgeReadModel } from '@repo/db/read-models';
import { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeEditViewModel } from '@repo/view-models/open-badge-edit';

export const mapOpenBadgeToEditViewModel = (badge: OpenBadgeReadModel): OpenBadgeEditViewModel => ({
  id: badge.id,
  name: badge.name,
  description: badge.description ?? '',
  coverImage: badge.coverImage ?? null,
  levels: badge.levels.map((level) => ({
    title: level.title,
    description: level.description
  })),
  activationEnabled: badge.status === ActivityStatus.Active
});
