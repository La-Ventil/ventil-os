import { OpenBadgeError } from './open-badge-errors';

export const assertCanDeactivateBadge = (attachedMachineCount: number): void => {
  if (attachedMachineCount > 0) {
    throw new OpenBadgeError('openBadge.status.attachedToMachines');
  }
};

export const assertCanDeleteBadge = (assignedProgressCount: number): void => {
  if (assignedProgressCount > 0) {
    throw new OpenBadgeError('openBadge.delete.alreadyAssigned');
  }
};
