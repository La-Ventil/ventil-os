import type { OpenBadgeLevelSchema, OpenBadgeSchema } from '@repo/db/schemas';
import type {
  OpenBadgeLevelViewModel,
  OpenBadgeViewModel
} from '@repo/view-models/open-badge';

export const mapOpenBadgeLevelToViewModel = (
  level: OpenBadgeLevelSchema
): OpenBadgeLevelViewModel => ({
  level: level.level,
  title: level.title ?? `Niveau ${level.level}`,
  description: level.description ?? ''
});

export const mapOpenBadgeToViewModel = (
  badge: OpenBadgeSchema
): OpenBadgeViewModel => ({
  id: badge.id,
  type: badge.type,
  name: badge.name,
  coverImage: badge.coverImage ?? undefined,
  description: badge.description ?? '',
  levels: badge.levels.map(mapOpenBadgeLevelToViewModel),
  activeLevel: 0
});
