import {
  MachineAvailability,
  type ReservationWindow,
  resolveMachineAvailability
} from './machine-availability';
import type { MachineReservationStatus } from './machine-reservation-status';

type ReservationsByMachineId = Map<string, ReservationWindow[]>;
type ReservationInput = {
  machineId: string;
  startsAt: Date;
  endsAt: Date;
  status: MachineReservationStatus;
};

export const resolveAvailabilityByMachineId = (
  baseAvailabilityByMachineId: Map<string, MachineAvailability>,
  reservations: ReservationInput[],
  now: Date,
  dayEnd: Date
): Map<string, MachineAvailability> => {
  const grouped = new Map<string, ReservationWindow[]>();

  reservations.forEach((reservation) => {
    const list = grouped.get(reservation.machineId) ?? [];
    list.push({
      startsAt: reservation.startsAt,
      endsAt: reservation.endsAt,
      status: reservation.status
    });
    grouped.set(reservation.machineId, list);
  });

  return MachineAvailabilityRules.resolveByMachineId(baseAvailabilityByMachineId, grouped, now, dayEnd);
};

export const MachineAvailabilityRules = {
  resolve: resolveMachineAvailability,
  resolveByMachineId: (
    baseAvailabilityByMachineId: Map<string, MachineAvailability>,
    reservationsByMachineId: ReservationsByMachineId,
    now: Date,
    dayEnd: Date
  ): Map<string, MachineAvailability> => {
    const resolved = new Map<string, MachineAvailability>();
    baseAvailabilityByMachineId.forEach((availability, machineId) => {
      const reservations = reservationsByMachineId.get(machineId) ?? [];
      resolved.set(machineId, resolveMachineAvailability(availability, reservations, now, dayEnd));
    });

    return resolved;
  }
};
