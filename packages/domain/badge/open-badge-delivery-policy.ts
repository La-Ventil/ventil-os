import { OpenBadgeError } from './open-badge-errors';

/**
 * A trainer threshold names the lowest level from which a holder may deliver the badge, so it has to
 * be one of the levels the badge actually has. `null` is always valid: only admins may deliver it.
 */
export const assertTrainerThresholdWithinLevels = (threshold: number | null, levelCount: number): void => {
  if (threshold === null) {
    return;
  }

  if (!Number.isInteger(threshold) || threshold < 1 || threshold > levelCount) {
    throw new OpenBadgeError('openBadge.delivery.invalidLevel');
  }
};
