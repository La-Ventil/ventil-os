import { openBadgeRepository } from '@repo/db';
import { type ActivityStatus } from '@repo/domain/activity-status';
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
  const badge = await openBadgeRepository.getOpenBadgeById(input.id);
  if (!badge) {
    throw new OpenBadgeError('openBadge.status.notFound');
  }

  return openBadgeRepository.setOpenBadgeStatus(input.id, input.status);
};
