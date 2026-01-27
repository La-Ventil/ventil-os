import type { OpenBadgeProgressSchema, OpenBadgeSchema } from '@repo/db/schemas';
import { BadgeLevel } from '@repo/domain/badge-level';
import { Level } from '@repo/domain/level';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';

export const mapOpenBadgeToViewModel = (
  badge: OpenBadgeSchema
): OpenBadgeViewModel => ({
  id: badge.id,
  type: badge.type,
  name: badge.name,
  coverImage: badge.coverImage ?? undefined,
  description: badge.description ?? '',
  levels: badge.levels.map((level) =>
    BadgeLevel.from(level.level, level.title, level.description)
  ),
  activeLevel: 0
});

export const mapOpenBadgeProgressToViewModel = (
  progress: OpenBadgeProgressSchema
): OpenBadgeViewModel => ({
  ...mapOpenBadgeToViewModel(progress.openBadge),
  activeLevel: progress.highestLevel ? Level.from(progress.highestLevel.level) : 0
});
