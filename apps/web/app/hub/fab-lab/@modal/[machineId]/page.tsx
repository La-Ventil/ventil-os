import type { JSX } from 'react';
import {
  canUserReserveMachine,
  formatDayKey,
  getMachineDetailsById,
  listMachineReservationsForDayKey,
  resolveDayKeyFromString
} from '@repo/application';
import { getTimeZone } from 'next-intl/server';
import MachineModalRouteClient from '../../machine-modal-route.client';
import { getServerSession } from '../../../../../lib/auth';

type MachineModalPageProps = {
  params: Promise<{ machineId: string }>;
  searchParams?: Promise<{ day?: string }>;
};

export default async function MachineModalPage({
  params,
  searchParams
}: MachineModalPageProps): Promise<JSX.Element | null> {
  const { machineId } = await params;
  const { day } = searchParams ? await searchParams : {};
  const machine = await getMachineDetailsById(machineId);
  if (!machine) {
    return null;
  }

  const timeZone = await getTimeZone();
  const selectedDateKey = resolveDayKeyFromString(day) ?? formatDayKey(new Date(), timeZone);
  const reservations = await listMachineReservationsForDayKey(machineId, selectedDateKey, timeZone);
  const session = await getServerSession();
  const canReserve = await canUserReserveMachine(machineId, session?.user?.id);

  return (
    <MachineModalRouteClient
      machine={machine}
      reservations={reservations}
      dayKey={selectedDateKey}
      canReserve={canReserve}
      closeHref="/hub/fab-lab"
    />
  );
}
