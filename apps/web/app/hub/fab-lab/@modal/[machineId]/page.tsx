import type { JSX } from 'react';
import { getMachineDetailsById, listMachineReservationsForDay } from '@repo/application';
import MachineModalRouteClient from '../../machine-modal-route.client';

type MachineModalPageProps = {
  params: Promise<{ machineId: string }>;
};

export default async function MachineModalPage({ params }: MachineModalPageProps): Promise<JSX.Element | null> {
  const { machineId } = await params;
  const machine = await getMachineDetailsById(machineId);
  if (!machine) {
    return null;
  }

  const today = new Date();
  const dateKey = today.toISOString().slice(0, 10);
  const reservations = await listMachineReservationsForDay(machineId, today);

  return (
    <MachineModalRouteClient machine={machine} reservations={reservations} date={dateKey} closeHref="/hub/fab-lab" />
  );
}
