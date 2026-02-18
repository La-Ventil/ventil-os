import type { OpenBadgeSchemaRaw } from '@repo/db/schemas';
import { ActivityStatus, toActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeEditViewModel } from '@repo/view-models/open-badge-edit';

export const mapOpenBadgeToEditViewModel = (badge: OpenBadgeSchemaRaw): OpenBadgeEditViewModel => ({
  id: badge.id,
  name: badge.name,
  description: badge.description ?? '',
  coverImage: badge.coverImage ?? null,
  levels: badge.levels.map((level: OpenBadgeSchemaRaw['levels'][number]) => ({
    title: level.title,
    description: level.description ?? ''
  })),
  activationEnabled: toActivityStatus(badge.status) === ActivityStatus.Active
});
