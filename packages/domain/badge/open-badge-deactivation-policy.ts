import { OpenBadgeError } from './open-badge-errors';

export const assertCanDeactivateBadge = (attachedMachineCount: number): void => {
  if (attachedMachineCount > 0) {
    throw new OpenBadgeError('openBadge.status.attachedToMachines');
  }
};
