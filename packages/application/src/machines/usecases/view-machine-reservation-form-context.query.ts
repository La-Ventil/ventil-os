import { canManageReservations } from '@repo/domain/authorization';
import {
  canViewReservation,
  type ReservationActor
} from '@repo/domain/machine/machine-reservation-cancellation-policy';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { resolveIsoDateFromQuery } from '../../infra/iso-date';
import type { Query } from '../../usecase';
import { browseUsersForReservation } from '../../users/usecases/browse-users-for-reservation.query';
import { viewMachineDetails } from './view-machine-details.query';
import { viewMachineReservation } from './view-machine-reservation.query';

export type ViewMachineReservationFormContextInput = {
  machineId: string;
  reservationId?: string | null;
  start?: string | null;
  actor?: ReservationActor | null;
  now?: Date;
};

export type MachineReservationFormContext = {
  machine: MachineDetailsViewModel;
  participantOptions: UserSummaryViewModel[];
  startAt: Date;
  reservation: MachineReservationViewModel | null;
  currentUserId?: string;
  canManageReservations: boolean;
};

export const viewMachineReservationFormContext: Query<
  [ViewMachineReservationFormContextInput],
  MachineReservationFormContext | null
> = async (input: ViewMachineReservationFormContextInput) => {
  const [machine, reservation, participantOptions] = await Promise.all([
    viewMachineDetails(input.machineId),
    input.reservationId ? viewMachineReservation(input.reservationId) : Promise.resolve(null),
    browseUsersForReservation()
  ]);

  if (!machine) {
    return null;
  }

  if (reservation && reservation.machineId !== input.machineId) {
    return null;
  }

  if (reservation && !canViewReservation(reservation, input.actor ?? null)) {
    return null;
  }

  const now = input.now ?? new Date();
  const startAt = reservation?.startsAt ?? resolveIsoDateFromQuery(input.start) ?? now;

  return {
    machine,
    participantOptions,
    startAt,
    reservation,
    currentUserId: input.actor?.id ?? undefined,
    canManageReservations: canManageReservations(input.actor)
  };
};
