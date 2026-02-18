import type { JSX } from 'react';
import { browseUsersForReservation, viewMachineDetails } from '@repo/application';
import { resolveIsoDateFromQuery } from '@repo/application/infra/iso-date';
import { getServerSession } from '../../../../../../lib/auth';
import MachineReservationModalRouteClient from '../../../machine-reservation-modal-route.client';

type MachineReservationModalPageProps = {
  params: Promise<{ machineId: string }>;
  searchParams?: Promise<{ start?: string }>;
};

export default async function MachineReservationModalPage({
  params,
  searchParams
}: MachineReservationModalPageProps): Promise<JSX.Element | null> {
  const { machineId } = await params;
  const { start } = searchParams ? await searchParams : {};
  const machine = await viewMachineDetails(machineId);
  if (!machine) {
    return null;
  }
  const session = await getServerSession();
  const participantOptions = await browseUsersForReservation();
  const startAt = resolveIsoDateFromQuery(start) ?? new Date();

  return (
    <MachineReservationModalRouteClient
      machine={machine}
      participantOptions={participantOptions}
      startAt={startAt}
      closeHref={`/hub/fab-lab/${machineId}`}
      currentUserId={session?.user?.id}
    />
  );
}
