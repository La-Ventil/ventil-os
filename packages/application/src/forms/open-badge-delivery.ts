import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';

/**
 * Translation between the form's "Delivery" section — an on/off switch plus a `level-N` option —
 * and the domain's trainer threshold: the lowest level from which a holder may deliver the badge
 * to someone else, or `null` when only admins may (see `canAssignOpenBadge`).
 */

type DeliveryFields = {
  deliveryEnabled?: boolean | null;
  deliveryLevel?: string | null;
};

const LEVEL_OPTION = /^level-(\d+)$/;

export const deliveryToTrainerThreshold = ({ deliveryEnabled, deliveryLevel }: DeliveryFields): number | null => {
  if (!deliveryEnabled) {
    return null;
  }

  // The form preselects the first level; an empty option means nobody changed it.
  if (!deliveryLevel) {
    return 1;
  }

  const level = Number(LEVEL_OPTION.exec(deliveryLevel)?.[1]);

  if (!Number.isInteger(level) || level < 1) {
    throw new OpenBadgeError('openBadge.delivery.invalidLevel');
  }

  return level;
};

export const trainerThresholdToDelivery = (
  threshold: number | null
): { deliveryEnabled: boolean; deliveryLevel: string } =>
  threshold === null
    ? { deliveryEnabled: false, deliveryLevel: 'level-1' }
    : { deliveryEnabled: true, deliveryLevel: `level-${threshold}` };
