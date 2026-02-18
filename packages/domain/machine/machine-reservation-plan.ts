import { Machine } from './machine';
import type { Machine as MachineType, MachineReservationCommand, ReservationCandidate } from './machine';
import { assertCanReserveMachine } from './machine-reservation-policy';

export type MachineReservationPlan = {
  machine: MachineType;
  candidate: ReservationCandidate;
  participantIds: string[];
};

export const planReservationForMachine = (
  machine: MachineType,
  input: MachineReservationCommand
): MachineReservationPlan => {
  const { candidate, participantIds } = Machine.planReservation(input);
  assertCanReserveMachine(machine, candidate);

  return { machine, candidate, participantIds };
};
