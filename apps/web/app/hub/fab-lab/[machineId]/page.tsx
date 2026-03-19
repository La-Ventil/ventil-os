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
  viewMachineReservationForm,
  viewMachineReservationsForDayKey
} from '@repo/application/machines/usecases';
import { getTimeZone } from 'next-intl/server';
import MachineModalRouteClient from '../machine-modal-route.client';
import { getServerSession } from '../../../../lib/auth';

type MachinePageProps = {
  params: Promise<{ machineId: string }>;
  searchParams?: Promise<{ day?: string; start?: string; reservationId?: string; tab?: 'info' | 'reservations' }>;
};

export default async function MachinePage({ params, searchParams }: MachinePageProps): Promise<JSX.Element | null> {
  const [{ machineId }, resolvedSearchParams, timeZone, session] = await Promise.all([
    params,
    searchParams ??
      Promise.resolve<{ day?: string; start?: string; reservationId?: string; tab?: 'info' | 'reservations' }>({}),
    getTimeZone(),
    getServerSession()
  ]);
  const { day, start, reservationId, tab } = resolvedSearchParams;
  const now = new Date();
  const currentUserId = session?.user?.id;
  const machinePromise = viewMachineDetails(machineId);
  const canReservePromise = checkReservationEligibility(machineId, currentUserId);
  const todayKey = formatDayKey(now, timeZone);
  const selectedDateKey = resolveDayKeyFromString(day) ?? todayKey;
  const reservationsPromise = viewMachineReservationsForDayKey(machineId, selectedDateKey, timeZone);
  const reservationsTodayPromise =
    selectedDateKey === todayKey
      ? reservationsPromise
      : viewMachineReservationsForDayKey(machineId, todayKey, timeZone);
  const reservationFormPromise =
    start || reservationId
      ? viewMachineReservationForm({
          machineId,
          reservationId,
          start,
          actor: session?.user
        })
      : Promise.resolve(null);
  const [machine, reservations, reservationsToday, canReserve, reservationForm] = await Promise.all([
    machinePromise,
    reservationsPromise,
    reservationsTodayPromise,
    canReservePromise,
    reservationFormPromise
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
      reservationStartAt={reservationForm?.startAt}
      reservation={reservationForm?.reservation}
      participantOptions={reservationForm?.participantOptions}
      initialTab={tab === 'info' ? 'info' : 'reservations'}
      closeHref="/hub/fab-lab"
    />
  );
}
