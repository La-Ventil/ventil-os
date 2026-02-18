import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import { mapOpenBadgeToViewModel } from '../../presenters/open-badge';
import type { Query } from '../../usecase';

export const viewOpenBadge: Query<[string], OpenBadgeViewModel | null> = async (id: string) => {
  const badge = await openBadgeRepository.getOpenBadgeById(id);
  return badge ? mapOpenBadgeToViewModel(badge) : null;
};
