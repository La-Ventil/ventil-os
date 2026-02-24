import { openBadgeRepository } from '@repo/db';
import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import type { Command } from '../../usecase';

export type RemoveOpenBadgeInput = {
  id: string;
};

export type RemoveOpenBadgeResult = Awaited<ReturnType<typeof openBadgeRepository.deleteOpenBadge>>;

export const removeOpenBadge: Command<[RemoveOpenBadgeInput], RemoveOpenBadgeResult> = async (
  input: RemoveOpenBadgeInput
) => {
  const badge = await openBadgeRepository.getOpenBadgeAdminById(input.id);
  if (!badge) {
    throw new OpenBadgeError('openBadge.delete.notFound');
  }
  if (badge._count.openBadgeProgresses > 0) {
    throw new OpenBadgeError('openBadge.delete.alreadyAssigned');
  }

  return openBadgeRepository.deleteOpenBadge(input.id);
};
