import { openBadgeRepository } from '@repo/db';
import { type ActivityStatus } from '@repo/domain/activity-status';
import { assertCanDeactivateBadge } from '@repo/domain/badge/open-badge-deactivation-policy';
import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import type { Command } from '../../usecase';

export type SetOpenBadgeStatusInput = {
  id: string;
  status: ActivityStatus;
};

export type SetOpenBadgeStatusResult = Awaited<ReturnType<typeof openBadgeRepository.setOpenBadgeStatus>>;

export const setOpenBadgeStatus: Command<[SetOpenBadgeStatusInput], SetOpenBadgeStatusResult> = async (
  input: SetOpenBadgeStatusInput
) => {
  const badge = await openBadgeRepository.getOpenBadgeAdminById(input.id);
  if (!badge) {
    throw new OpenBadgeError('openBadge.status.notFound');
  }

  if (input.status === 'inactive') {
    assertCanDeactivateBadge(badge._count.machines);
  }

  return openBadgeRepository.setOpenBadgeStatus(input.id, input.status);
};
