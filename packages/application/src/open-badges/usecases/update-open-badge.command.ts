import { openBadgeRepository } from '@repo/db';
import { ActivityStatus } from '@repo/domain/activity-status';
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
) =>
  openBadgeRepository.updateOpenBadge({
    id: input.id,
    name: input.name,
    description: input.description,
    coverImage: input.imageUrl ?? null,
    levels: input.levels,
    status: input.activationEnabled ? ActivityStatus.Active : ActivityStatus.Inactive
  });
