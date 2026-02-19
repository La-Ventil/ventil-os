import type { OpenBadgeProgressReadModel, OpenBadgeReadModel } from '@repo/db/read-models';
import { OpenBadge, type OpenBadge as OpenBadgeDomain } from '@repo/domain/badge/open-badge';
import { formatOpenBadgeLevelLabel } from '@repo/domain/badge/open-badge-level';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';

const withLevelLabels = (badge: OpenBadgeDomain): OpenBadgeViewModel => ({
  ...badge,
  levels: badge.levels.map((level) => ({
    ...level,
    label: formatOpenBadgeLevelLabel(level)
  }))
});

export const mapOpenBadgeToViewModelWithActiveLevel = (
  badge: OpenBadgeReadModel,
  activeLevel: number
): OpenBadgeViewModel =>
  withLevelLabels(
    OpenBadge.from({
      id: badge.id,
      type: badge.type,
      name: badge.name,
      coverImage: badge.coverImage ?? undefined,
      description: badge.description ?? '',
      levels: badge.levels,
      activeLevel
    })
  );

export const mapOpenBadgeToViewModel = (badge: OpenBadgeReadModel): OpenBadgeViewModel =>
  mapOpenBadgeToViewModelWithActiveLevel(badge, 0);

export const mapOpenBadgeProgressToViewModel = (
  progress: OpenBadgeProgressReadModel
): OpenBadgeViewModel =>
  ({
    ...mapOpenBadgeToViewModelWithActiveLevel(
      progress.openBadge,
      progress.highestLevel ? progress.highestLevel.level : 0
    )
  });
