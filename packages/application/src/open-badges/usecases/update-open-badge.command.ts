import { openBadgeRepository } from '@repo/db';
import { ActivityStatus } from '@repo/domain/activity-status';
import { assertCanDeactivateBadge } from '@repo/domain/badge/open-badge-deactivation-policy';
import { assertTrainerThresholdWithinLevels } from '@repo/domain/badge/open-badge-delivery-policy';
import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import type { Command } from '../../usecase';

export type UpdateOpenBadgeInput = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  levels: Array<{ title: string; description: string }>;
  activationEnabled: boolean;
  /** Lowest level from which holders may deliver the badge; `null` leaves delivery to admins. */
  trainerThresholdLevel: number | null;
};

type UpdateOpenBadgeResult = Awaited<ReturnType<typeof openBadgeRepository.updateOpenBadge>>;

export const updateOpenBadge: Command<[UpdateOpenBadgeInput], UpdateOpenBadgeResult> = async (
  input: UpdateOpenBadgeInput
) => {
  const [current, admin] = await Promise.all([
    openBadgeRepository.getOpenBadgeById(input.id),
    openBadgeRepository.getOpenBadgeAdminById(input.id)
  ]);

  if (!current || !admin) {
    throw new OpenBadgeError('openBadge.update.notFound');
  }

  if (!input.activationEnabled) {
    assertCanDeactivateBadge(admin._count.machines);
  }

  // Checked against the levels the badge keeps after this update, not the ones it had before.
  assertTrainerThresholdWithinLevels(input.trainerThresholdLevel, input.levels.length);

  const coverImage = input.imageUrl !== undefined ? input.imageUrl : (current.coverImage ?? null);

  return openBadgeRepository.updateOpenBadge({
    id: input.id,
    name: input.name,
    description: input.description,
    coverImage,
    levels: input.levels,
    status: input.activationEnabled ? ActivityStatus.Active : ActivityStatus.Inactive,
    trainerThresholdLevel: input.trainerThresholdLevel
  });
};
