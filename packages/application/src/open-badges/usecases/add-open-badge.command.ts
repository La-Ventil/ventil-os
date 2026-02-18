import { openBadgeRepository } from '@repo/db';
import { ActivityStatus } from '@repo/domain/activity-status';
import type { Command } from '../../usecase';

const DEFAULT_BADGE_TYPE = 'Administration';
const DEFAULT_BADGE_CATEGORY = 'Machine';

export type AddOpenBadgeInput = {
  name: string;
  description: string;
  imageUrl: string;
  levels: Array<{ title: string; description: string }>;
  activationEnabled: boolean;
  creatorId: string;
};

type AddOpenBadgeResult = Awaited<ReturnType<typeof openBadgeRepository.createOpenBadge>>;

export const addOpenBadge: Command<[AddOpenBadgeInput], AddOpenBadgeResult> = async (
  input: AddOpenBadgeInput
) =>
  openBadgeRepository.createOpenBadge({
    name: input.name,
    description: input.description,
    coverImage: input.imageUrl,
    levels: input.levels,
    status: input.activationEnabled ? ActivityStatus.Active : ActivityStatus.Inactive,
    creatorId: input.creatorId,
    type: DEFAULT_BADGE_TYPE,
    category: DEFAULT_BADGE_CATEGORY
  });
