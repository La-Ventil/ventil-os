import { machineRepository, openBadgeRepository } from '@repo/db';
import {
  buildReservationEligibilityChecks,
  isMachineReservationEligible
} from '@repo/domain/machine/machine-reservation-eligibility';
import type { Query } from '../../usecase';

type CheckReservationEligibilityArgs = [machineId: string, userId?: string | null];

export const checkReservationEligibility: Query<CheckReservationEligibilityArgs, boolean> = async (
  machineId: string,
  userId?: string | null
) => {
  const machine = await machineRepository.getMachineDetailsById(machineId);
  if (!machine) {
    return false;
  }

  if (!machine.badgeRequirements.length) {
    return true;
  }

  if (!userId) {
    return false;
  }

  const openBadgeIds = machine.badgeRequirements.map((requirement) => requirement.openBadge.id);
  const userLevels = await openBadgeRepository.getUserHighestOpenBadgeLevels(userId, openBadgeIds);
  const checks = buildReservationEligibilityChecks(machine.badgeRequirements, userLevels);
  const rules = machine.badgeRequirements.map((requirement) => requirement.rule);

  return isMachineReservationEligible(rules, checks);
};
