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
  const [{ machineId }, resolvedSearchParams, timeZone, session] = await Promise.all([
    params,
    searchParams ?? Promise.resolve<{ day?: string }>({}),
    getTimeZone(),
    getServerSession()
  ]);
  const { day } = resolvedSearchParams;
  const now = new Date();
  const currentUserId = session?.user?.id;
  const machinePromise = viewMachineDetails(machineId);
  const canReservePromise = checkReservationEligibility(machineId, currentUserId);
  const todayKey = formatDayKey(now, timeZone);
  const selectedDateKey = resolveDayKeyFromString(day) ?? todayKey;
  const reservationsPromise = viewMachineReservationsForDayKey(machineId, selectedDateKey, timeZone);
  const reservationsTodayPromise =
    selectedDateKey === todayKey ? reservationsPromise : viewMachineReservationsForDayKey(machineId, todayKey, timeZone);
  const [machine, reservations, reservationsToday, canReserve] = await Promise.all([
    machinePromise,
    reservationsPromise,
    reservationsTodayPromise,
    canReservePromise
  ]);

  if (!machine) {
    return null;
  }

  const { end } = getDayIntervalForDayKey(todayKey, timeZone);
  const availability = resolveMachineAvailability(machine.availability, reservationsToday, now, end);
  const machineWithAvailability = { ...machine, availability };
  const canManage = canManageReservations(session?.user);

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
