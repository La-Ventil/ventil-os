import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { OpenBadgeAdminViewModel } from '@repo/view-models/open-badge-admin';
import type { OpenBadgeEditViewModel } from '@repo/view-models/open-badge-edit';
import { mapOpenBadgeAdminToViewModel } from './mappers/open-badge-admin';
import { mapOpenBadgeProgressToViewModel, mapOpenBadgeToViewModel } from './mappers/open-badge';
import { mapOpenBadgeToEditViewModel } from './mappers/open-badge-edit';
import { canManageBadgesUser } from './authorization';
import { userExists } from './user';

export const canAssignOpenBadgeUser = async (
  openBadgeId: string,
  user?: {
    id?: string;
    globalAdmin?: boolean;
    pedagogicalAdmin?: boolean;
  } | null
): Promise<boolean> => {
  if (canManageBadgesUser(user)) {
    return true;
  }

  if (!user?.id) {
    return false;
  }

  const trainerThreshold = await openBadgeRepository.getTrainerThresholdLevel(openBadgeId);
  if (trainerThreshold === null) {
    return false;
  }

  const highestLevel = await openBadgeRepository.getUserHighestOpenBadgeLevel(user.id, openBadgeId);
  if (highestLevel === null) {
    return false;
  }

  return highestLevel >= trainerThreshold;
};

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

export const getOpenBadgeEditData = async (id: string): Promise<OpenBadgeEditViewModel | null> => {
  const badge = await openBadgeRepository.getOpenBadgeById(id);
  return badge ? mapOpenBadgeToEditViewModel(badge) : null;
};

export const listOpenBadgesForUser = async (userId: string): Promise<OpenBadgeViewModel[]> => {
  const progresses = await openBadgeRepository.listOpenBadgesForUser(userId);
  return progresses.map(mapOpenBadgeProgressToViewModel);
};

export const awardOpenBadgeLevel = async (input: {
  userId: string;
  openBadgeId: string;
  level: number;
  awardedById: string;
}) => openBadgeRepository.awardOpenBadgeLevel(input);

export const awardOpenBadgeLevelUseCase = async (
  input: {
    userId: string;
    openBadgeId: string;
    level: number;
  },
  currentUser: {
    id?: string;
    email?: string | null;
    globalAdmin?: boolean;
    pedagogicalAdmin?: boolean;
  }
) => {
  if (!currentUser?.id) {
    throw new Error('Unauthorized');
  }

  const canAssign = await canAssignOpenBadgeUser(input.openBadgeId, currentUser);
  if (!canAssign) {
    throw new Error('Unauthorized');
  }

  const awarderExists = await userExists(currentUser.id);
  if (!awarderExists) {
    throw new Error('Awarding user not found');
  }

  const targetExists = await userExists(input.userId);
  if (!targetExists) {
    throw new Error('Target user not found');
  }

  await awardOpenBadgeLevel({
    userId: input.userId,
    openBadgeId: input.openBadgeId,
    level: input.level,
    awardedById: currentUser.id
  });

  return { ok: true };
};

const DEFAULT_BADGE_TYPE = 'Administration';
const DEFAULT_BADGE_CATEGORY = 'Machine';

export type CreateOpenBadgeInput = {
  name: string;
  description: string;
  imageUrl: string;
  levels: Array<{ title: string; description: string }>;
  activationEnabled: boolean;
  creatorId: string;
};

export const createOpenBadge = async (input: CreateOpenBadgeInput) =>
  openBadgeRepository.createOpenBadge({
    name: input.name,
    description: input.description,
    coverImage: input.imageUrl,
    levels: input.levels,
    status: input.activationEnabled ? 'active' : 'inactive',
    creatorId: input.creatorId,
    type: DEFAULT_BADGE_TYPE,
    category: DEFAULT_BADGE_CATEGORY
  });

export type UpdateOpenBadgeInput = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  levels: Array<{ title: string; description: string }>;
  activationEnabled: boolean;
};

export const updateOpenBadge = async (input: UpdateOpenBadgeInput) =>
  openBadgeRepository.updateOpenBadge({
    id: input.id,
    name: input.name,
    description: input.description,
    coverImage: input.imageUrl ?? null,
    levels: input.levels,
    status: input.activationEnabled ? 'active' : 'inactive'
  });
