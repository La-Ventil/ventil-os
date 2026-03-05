import type { JSX } from 'react';
import { viewMachineReservationFormContext } from '@repo/application/machines/usecases';
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
  const [{ machineId }, resolvedSearchParams, session] = await Promise.all([
    params,
    searchParams ?? Promise.resolve<{ start?: string; reservationId?: string }>({}),
    getServerSession()
  ]);
  const context = await viewMachineReservationFormContext({
    machineId,
    reservationId: resolvedSearchParams.reservationId,
    start: resolvedSearchParams.start,
    actor: session?.user
  });

  if (!context) {
    return null;
  }

  return (
    <MachineReservationModalRouteClient
      machine={context.machine}
      participantOptions={context.participantOptions}
      startAt={context.startAt}
      reservation={context.reservation}
      closeHref={`/hub/fab-lab/${machineId}`}
      currentUserId={context.currentUserId}
      canManageReservations={context.canManageReservations}
    />
  );
}
