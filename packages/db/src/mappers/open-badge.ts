import type { Prisma } from '@prisma/client';
import type {
  OpenBadgeLevelViewModel,
  OpenBadgeViewModel
} from '@repo/domain/view-models/open-badge';

export type OpenBadgeSchema = Prisma.OpenBadgeGetPayload<{
  include: {
    levels: {
      select: {
        level: true;
        title: true;
        description: true;
      };
    };
  };
}>;

export type OpenBadgeLevelSchema = OpenBadgeSchema['levels'][number];

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
