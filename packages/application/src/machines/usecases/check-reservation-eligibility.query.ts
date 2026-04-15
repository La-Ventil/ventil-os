import { machineRepository } from '@repo/db';
import { Machine } from '@repo/domain/machine/machine';
import type { Query } from '../../usecase';
import { canUserReserve } from '../reservation-eligibility';

type CheckReservationEligibilityArgs = [machineId: string, userId?: string | null];

export const checkReservationEligibility: Query<CheckReservationEligibilityArgs, boolean> = async (
  machineId: string,
  userId?: string | null
) => {
  const machine = await machineRepository.getMachineDetailsById(machineId);
  if (!machine) {
    return false;
  }

  return canUserReserve(
    Machine.from({
      id: machine.id,
      name: machine.name,
      category: machine.category,
      status: machine.status,
      description: machine.description,
      imageUrl: machine.imageUrl,
      badgeRequirements: machine.badgeRequirements
    }),
    userId
  );
};
