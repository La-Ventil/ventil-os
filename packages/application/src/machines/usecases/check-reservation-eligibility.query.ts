import { machineRepository, openBadgeRepository } from '@repo/db';
import { isMachineReservationEligible } from '@repo/domain/machine/machine-reservation-eligibility';
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

  const checks = await Promise.all(
    machine.badgeRequirements.map(async (requirement) => {
      const requiredLevel = requirement.level?.level ?? 0;
      const highestLevel = await openBadgeRepository.getUserHighestOpenBadgeLevel(
        userId,
        requirement.openBadge.id
      );
      return { requiredLevel, userLevel: highestLevel };
    })
  );

  const rules = machine.badgeRequirements.map((requirement) => requirement.rule);

  return isMachineReservationEligible(rules, checks);
};
