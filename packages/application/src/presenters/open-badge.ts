import type { OpenBadgeProgressReadModel, OpenBadgeReadModel } from '@repo/db/read-models';
import { OpenBadge } from '@repo/domain/badge/open-badge';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';

export const mapOpenBadgeToViewModel = (badge: OpenBadgeReadModel): OpenBadgeViewModel =>
  OpenBadge.from({
    id: badge.id,
    type: badge.type,
    name: badge.name,
    coverImage: badge.coverImage ?? undefined,
    description: badge.description ?? '',
    levels: badge.levels,
    activeLevel: 0
  });

export const mapOpenBadgeProgressToViewModel = (
  progress: OpenBadgeProgressReadModel
): OpenBadgeViewModel =>
  OpenBadge.from({
    ...mapOpenBadgeToViewModel(progress.openBadge),
    activeLevel: progress.highestLevel ? progress.highestLevel.level : 0
  });
