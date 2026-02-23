import type { JSX } from 'react';
import {
  canManageReservations,
  formatDayKey,
  getDayIntervalForDayKey,
  resolveMachineAvailability,
  resolveDayKeyFromString
} from '@repo/application';
import {
  checkReservationEligibility,
  viewMachineDetails,
  viewMachineReservationsForDayKey
} from '@repo/application/machines/usecases';
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
  const machine = await viewMachineDetails(machineId);
  if (!machine) {
    return null;
  }

  const timeZone = await getTimeZone();
  const todayKey = formatDayKey(new Date(), timeZone);
  const selectedDateKey = resolveDayKeyFromString(day) ?? todayKey;
  const reservations = await viewMachineReservationsForDayKey(machineId, selectedDateKey, timeZone);
  const reservationsToday =
    selectedDateKey === todayKey
      ? reservations
      : await viewMachineReservationsForDayKey(machineId, todayKey, timeZone);
  const { end } = getDayIntervalForDayKey(todayKey, timeZone);
  const availability = resolveMachineAvailability(machine.availability, reservationsToday, new Date(), end);
  const machineWithAvailability = { ...machine, availability };
  const session = await getServerSession();
  const canReserve = await checkReservationEligibility(machineId, session?.user?.id);
  const canManage = canManageReservations(session?.user);
  const currentUserId = session?.user?.id;

  return (
    <MachineModalRouteClient
      machine={machineWithAvailability}
      reservations={reservations}
      dayKey={selectedDateKey}
      canReserve={canReserve}
      currentUserId={currentUserId}
      canManageReservations={canManage}
      closeHref="/hub/fab-lab"
    />
  );
}
