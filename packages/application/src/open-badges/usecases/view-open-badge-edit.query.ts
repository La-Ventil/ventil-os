import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeEditViewModel } from '@repo/view-models/open-badge-edit';
import { mapOpenBadgeToEditViewModel } from '../../presenters/open-badge-edit';
import type { Query } from '../../usecase';

export const viewOpenBadgeEdit: Query<[string], OpenBadgeEditViewModel | null> = async (id: string) => {
  const badge = await openBadgeRepository.getOpenBadgeById(id);
  return badge ? mapOpenBadgeToEditViewModel(badge) : null;
};
