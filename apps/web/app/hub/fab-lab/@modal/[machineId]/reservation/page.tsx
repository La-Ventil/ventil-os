import type { JSX } from 'react';
import { canManageReservations } from '@repo/domain/authorization';
import { viewMachineDetails, viewMachineReservation } from '@repo/application/machines/usecases';
import { browseUsersForReservation } from '@repo/application/users/usecases';
import { resolveIsoDateFromQuery } from '@repo/application/infra/iso-date';
import { canViewReservation } from '@repo/domain/machine/machine-reservation-cancellation-policy';
import { getServerSession } from '../../../../../../lib/auth';
import MachineReservationModalRouteClient from '../../../machine-reservation-modal-route.client';

type MachineReservationModalPageProps = {
  params: Promise<{ machineId: string }>;
  searchParams?: Promise<{ start?: string; reservationId?: string }>;
};

export default async function MachineReservationModalPage({
  params,
  searchParams
}: MachineReservationModalPageProps): Promise<JSX.Element | null> {
  const { machineId } = await params;
  const { start, reservationId } = searchParams ? await searchParams : {};
  const machine = await viewMachineDetails(machineId);
  if (!machine) {
    return null;
  }
  const session = await getServerSession();
  const reservation = reservationId ? await viewMachineReservation(reservationId) : null;
  if (reservation && reservation.machineId !== machineId) {
    return null;
  }
  if (reservation && !canViewReservation(reservation, session?.user)) {
    return null;
  }
  const participantOptions = await browseUsersForReservation();
  const startAt = reservation?.startsAt ?? resolveIsoDateFromQuery(start) ?? new Date();

  return (
    <MachineReservationModalRouteClient
      machine={machine}
      participantOptions={participantOptions}
      startAt={startAt}
      reservation={reservation}
      closeHref={`/hub/fab-lab/${machineId}`}
      currentUserId={session?.user?.id}
      canManageReservations={canManageReservations(session?.user)}
    />
  );
}
