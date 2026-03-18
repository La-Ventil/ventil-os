import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeRequirementOptionViewModel } from '@repo/application/view-models/open-badge-requirement-option';
import { mapOpenBadgeRequirementOptionToViewModel } from '../../presenters/open-badge-requirement-option';
import type { Query } from '../../usecase';

export const browseOpenBadgeRequirementOptions: Query<[], OpenBadgeRequirementOptionViewModel[]> = async () => {
  const badges = await openBadgeRepository.listOpenBadgeRequirementOptions();
  return badges.map(mapOpenBadgeRequirementOptionToViewModel);
};
