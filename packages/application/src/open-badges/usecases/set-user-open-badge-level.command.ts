import { openBadgeRepository } from '@repo/db';
import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import type { Command } from '../../usecase';
import { userExists } from '../../users/guards/user-exists';
import { canAssignOpenBadge, type OpenBadgeAssigner } from './can-assign-open-badge.query';

export type SetUserOpenBadgeLevelInput = {
  userId: string;
  openBadgeId: string;
  level: number;
};

export const setUserOpenBadgeLevel: Command<[SetUserOpenBadgeLevelInput, OpenBadgeAssigner], void> = async (
  input: SetUserOpenBadgeLevelInput,
  currentUser: OpenBadgeAssigner
) => {
  if (!currentUser?.id) {
    throw new OpenBadgeError('openBadge.assign.unauthorized');
  }

  const canAssign = await canAssignOpenBadge(input.openBadgeId, currentUser);
  if (!canAssign) {
    throw new OpenBadgeError('openBadge.assign.unauthorized');
  }

  const managerExists = await userExists(currentUser.id);
  if (!managerExists) {
    throw new OpenBadgeError('openBadge.assign.awarderNotFound');
  }

  const targetExists = await userExists(input.userId);
  if (!targetExists) {
    throw new OpenBadgeError('openBadge.assign.targetNotFound');
  }

  await openBadgeRepository.setUserOpenBadgeLevel({
    userId: input.userId,
    openBadgeId: input.openBadgeId,
    level: input.level,
    awardedById: currentUser.id
  });
};
