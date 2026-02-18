import type { OpenBadgeProgressSchemaRaw, OpenBadgeSchemaRaw } from '@repo/db/schemas';
import { OpenBadge } from '@repo/domain/badge/open-badge';
import { OpenBadgeLevel } from '@repo/domain/badge/open-badge-level';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';

const toOpenBadgeLevels = (levels: OpenBadgeSchemaRaw['levels']): OpenBadgeLevel[] =>
  levels.map((level: OpenBadgeSchemaRaw['levels'][number]) => OpenBadgeLevel.fromObject(level));

export const mapOpenBadgeToViewModel = (badge: OpenBadgeSchemaRaw): OpenBadgeViewModel =>
  OpenBadge.from({
    id: badge.id,
    type: badge.type,
    name: badge.name,
    coverImage: badge.coverImage ?? undefined,
    description: badge.description ?? '',
    levels: toOpenBadgeLevels(badge.levels),
    activeLevel: 0
  });

export const mapOpenBadgeProgressToViewModel = (
  progress: OpenBadgeProgressSchemaRaw
): OpenBadgeViewModel =>
  OpenBadge.from({
    ...mapOpenBadgeToViewModel(progress.openBadge),
    activeLevel: progress.highestLevel ? progress.highestLevel.level : 0
  });
