import type { OpenBadgeRequirementOptionReadModel } from '@repo/db/read-models';
import type { OpenBadgeRequirementOptionViewModel } from '@repo/view-models/open-badge-requirement-option';

export const mapOpenBadgeRequirementOptionToViewModel = (
  badge: OpenBadgeRequirementOptionReadModel
): OpenBadgeRequirementOptionViewModel => ({
  id: badge.id,
  name: badge.name,
  type: badge.type,
  coverImage: badge.coverImage,
  levels: badge.levels.map((level) => ({
    id: level.id,
    level: level.level,
    title: level.title,
    label: `${level.level} - ${level.title}`.trim()
  }))
});
