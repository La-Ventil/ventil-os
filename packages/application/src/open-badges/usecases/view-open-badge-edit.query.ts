import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeEditViewModel } from '@repo/application/open-badges/models/open-badge-edit';
import { mapOpenBadgeToEditViewModel } from '../../presenters/open-badge-edit';
import type { Query } from '../../usecase';

export const viewOpenBadgeEdit: Query<[string], OpenBadgeEditViewModel | null> = async (id: string) => {
  const [badge, trainerThresholdLevel] = await Promise.all([
    openBadgeRepository.getOpenBadgeById(id),
    openBadgeRepository.getTrainerThresholdLevel(id)
  ]);

  return badge ? mapOpenBadgeToEditViewModel(badge, trainerThresholdLevel) : null;
};
