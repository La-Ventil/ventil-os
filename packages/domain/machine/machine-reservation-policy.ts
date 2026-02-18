import { Machine } from './machine';
import type { Machine as MachineType, ReservationCandidate } from './machine';

export const canReserveMachine = (machine: MachineType, candidate: ReservationCandidate): boolean =>
  Machine.canReserve(machine, candidate);

export const assertCanReserveMachine = (machine: MachineType, candidate: ReservationCandidate): void =>
  Machine.assertCanReserve(machine, candidate);
