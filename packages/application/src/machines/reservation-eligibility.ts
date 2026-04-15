import { openBadgeRepository } from '@repo/db';
import {
  Machine,
  type Machine as MachineAggregate,
  type ReservationEligibilityLevels
} from '@repo/domain/machine/machine';

const emptyEligibilityLevels = (machine: MachineAggregate): ReservationEligibilityLevels =>
  new Map(machine.badgeRequirements.map((requirement) => [requirement.openBadge.id, null]));

export const resolveReservationEligibilityLevels = async (
  machine: MachineAggregate,
  userId?: string | null
): Promise<ReservationEligibilityLevels> => {
  if (!machine.badgeRequirements.length) {
    return new Map();
  }

  if (!userId) {
    return emptyEligibilityLevels(machine);
  }

  const openBadgeIds = [...new Set(machine.badgeRequirements.map((requirement) => requirement.openBadge.id))];
  return openBadgeRepository.getUserHighestOpenBadgeLevels(userId, openBadgeIds);
};

export const canUserReserve = async (machine: MachineAggregate, userId?: string | null): Promise<boolean> => {
  const userLevels = await resolveReservationEligibilityLevels(machine, userId);
  try {
    Machine.assertReservationEligibility(machine, userLevels);
    return true;
  } catch {
    return false;
  }
};
