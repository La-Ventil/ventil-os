import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeProgressSchema } from '@repo/db/schemas';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import { mapOpenBadgeToViewModel } from './mappers/open-badge';

export const listOpenBadges = async (): Promise<OpenBadgeViewModel[]> => {
  const badges = await openBadgeRepository.listOpenBadges();
  return badges.map(mapOpenBadgeToViewModel);
};

export const getOpenBadgeById = async (id: string): Promise<OpenBadgeViewModel | null> => {
  const badge = await openBadgeRepository.getOpenBadgeById(id);
  return badge ? mapOpenBadgeToViewModel(badge) : null;
};

export const listOpenBadgesForUser = async (
  userId: string
): Promise<OpenBadgeViewModel[]> => {
  const progresses = await openBadgeRepository.listOpenBadgesForUser(userId);
  return progresses.map(mapOpenBadgeProgressToViewModel);
};

const mapOpenBadgeProgressToViewModel = (
  progress: OpenBadgeProgressSchema
): OpenBadgeViewModel => ({
  ...mapOpenBadgeToViewModel(progress.openBadge),
  activeLevel: progress.highestLevel?.level ?? 0
});
