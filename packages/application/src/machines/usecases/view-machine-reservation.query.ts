import { machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import type { Query } from '../../usecase';

export const viewMachineReservation: Query<[string], MachineReservationViewModel | null> = async (
  reservationId: string
) => {
  const reservation = await machineReservationRepository.getById(reservationId);
  return reservation ? mapMachineReservationToViewModel(reservation) : null;
};
