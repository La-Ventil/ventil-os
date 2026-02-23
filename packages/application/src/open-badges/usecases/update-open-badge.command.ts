import { openBadgeRepository } from '@repo/db';
import { ActivityStatus } from '@repo/domain/activity-status';
import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import type { Command } from '../../usecase';

export type UpdateOpenBadgeInput = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  levels: Array<{ title: string; description: string }>;
  activationEnabled: boolean;
};

type UpdateOpenBadgeResult = Awaited<ReturnType<typeof openBadgeRepository.updateOpenBadge>>;

export const updateOpenBadge: Command<[UpdateOpenBadgeInput], UpdateOpenBadgeResult> = async (
  input: UpdateOpenBadgeInput
) => {
  const current = await openBadgeRepository.getOpenBadgeById(input.id);
  if (!current) {
    throw new OpenBadgeError('openBadge.update.notFound');
  }

  const coverImage = input.imageUrl !== undefined ? input.imageUrl : current.coverImage ?? null;

  return openBadgeRepository.updateOpenBadge({
    id: input.id,
    name: input.name,
    description: input.description,
    coverImage,
    levels: input.levels,
    status: input.activationEnabled ? ActivityStatus.Active : ActivityStatus.Inactive
  });
};
