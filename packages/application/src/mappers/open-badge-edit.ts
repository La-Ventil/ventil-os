import type { OpenBadgeSchema } from '@repo/db/schemas';
import type { OpenBadgeEditViewModel } from '@repo/view-models/open-badge-edit';

export const mapOpenBadgeToEditViewModel = (badge: OpenBadgeSchema): OpenBadgeEditViewModel => ({
  id: badge.id,
  name: badge.name,
  description: badge.description ?? '',
  coverImage: badge.coverImage ?? null,
  levels: badge.levels.map((level) => ({
    title: level.title,
    description: level.description ?? ''
  })),
  activationEnabled: badge.status === 'active'
});
