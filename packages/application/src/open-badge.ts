import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';
import { mapOpenBadgeAdminToViewModel } from './mappers/open-badge-admin';
import { mapOpenBadgeProgressToViewModel, mapOpenBadgeToViewModel } from './mappers/open-badge';

export const listOpenBadges = async (): Promise<OpenBadgeViewModel[]> => {
  const badges = await openBadgeRepository.listOpenBadges();
  return badges.map(mapOpenBadgeToViewModel);
};

export const listAdminOpenBadges = async (): Promise<OpenBadgeAdminViewModel[]> => {
  const badges = await openBadgeRepository.listOpenBadgesForAdmin();
  return badges.map(mapOpenBadgeAdminToViewModel);
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

export const awardOpenBadgeLevel = async (input: {
  userId: string;
  openBadgeId: string;
  level: number;
  awardedById: string;
}) => openBadgeRepository.awardOpenBadgeLevel(input);

const DEFAULT_BADGE_TYPE = 'Administration';
const DEFAULT_BADGE_CATEGORY = 'Machine';

export type CreateOpenBadgeInput = {
  name: string;
  description: string;
  imageUrl: string;
  levelTitle: string;
  levelDescription: string;
  activationEnabled: boolean;
  creatorId: string;
};

export const createOpenBadge = async (input: CreateOpenBadgeInput) =>
  openBadgeRepository.createOpenBadge({
    name: input.name,
    description: input.description,
    coverImage: input.imageUrl,
    levelTitle: input.levelTitle,
    levelDescription: input.levelDescription,
    status: input.activationEnabled ? 'active' : 'inactive',
    creatorId: input.creatorId,
    type: DEFAULT_BADGE_TYPE,
    category: DEFAULT_BADGE_CATEGORY
  });
