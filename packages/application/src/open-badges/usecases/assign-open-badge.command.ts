import { openBadgeRepository } from '@repo/db';
import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import { canAdvanceOpenBadgeLevel } from '@repo/domain/badge/open-badge-level-transition-policy';
import type { Command } from '../../usecase';
import { userExists } from '../../users/guards/user-exists';
import { canAssignOpenBadge, type OpenBadgeAssigner } from './can-assign-open-badge.query';

export type AssignOpenBadgeInput = {
  userId: string;
  openBadgeId: string;
  level: number;
};

export const assignOpenBadge: Command<[AssignOpenBadgeInput, OpenBadgeAssigner], void> = async (
  input: AssignOpenBadgeInput,
  currentUser: OpenBadgeAssigner
) => {
  if (!currentUser?.id) {
    throw new OpenBadgeError('openBadge.assign.unauthorized');
  }

  const canAssign = await canAssignOpenBadge(input.openBadgeId, currentUser);
  if (!canAssign) {
    throw new OpenBadgeError('openBadge.assign.unauthorized');
  }

  const awarderExists = await userExists(currentUser.id);
  if (!awarderExists) {
    throw new OpenBadgeError('openBadge.assign.awarderNotFound');
  }

  const targetExists = await userExists(input.userId);
  if (!targetExists) {
    throw new OpenBadgeError('openBadge.assign.targetNotFound');
  }

  const highestLevel = await openBadgeRepository.getUserHighestOpenBadgeLevel(input.userId, input.openBadgeId);
  if (!canAdvanceOpenBadgeLevel(highestLevel, input.level)) {
    throw new OpenBadgeError('openBadge.assign.invalidLevelTransition');
  }

  await openBadgeRepository.awardOpenBadgeLevel({
    userId: input.userId,
    openBadgeId: input.openBadgeId,
    level: input.level,
    awardedById: currentUser.id
  });
};
