import type { JSX } from 'react';
import {
  canManageReservations,
  formatDayKey,
  getDayIntervalForDayKey,
  resolveMachineAvailability,
  resolveIsoDateFromQuery
} from '@repo/application';
import {
  checkReservationEligibility,
  viewMachineDetails,
  viewMachineReservationForm,
  viewMachineReservationsForDayKey
} from '@repo/application/machines/usecases';
import { getTimeZone } from 'next-intl/server';
import MachineModalRouteClient from '../../../_machine-modal/machine-modal-route.client';
import { getServerSession } from '../../../../../../lib/auth';

type MachineModalPageProps = {
  params: Promise<{ machineId: string }>;
  searchParams?: Promise<{
    at?: string;
    reservationId?: string;
    step?: 'schedule' | 'create' | 'edit';
    tab?: 'info' | 'reservations';
  }>;
};

export default async function MachineModalPage({
  params,
  searchParams
}: MachineModalPageProps): Promise<JSX.Element | null> {
  const [{ machineId }, resolvedSearchParams, timeZone, session] = await Promise.all([
    params,
    searchParams ??
      Promise.resolve<{
        at?: string;
        reservationId?: string;
        step?: 'schedule' | 'create' | 'edit';
        tab?: 'info' | 'reservations';
      }>({}),
    getTimeZone(),
    getServerSession()
  ]);
  // Invariant: this route must stay under `machines/@modal/[machineId]`.
  // The parent list context is `/hub/fab-lab/machines`; if the modal route stops
  // mirroring that subtree, the standalone machine page replaces the list instead
  // of rendering on top of it.
  // The server page only hydrates the initial modal context; reservation tab transitions
  // must remain client-side in `_machine-modal/use-machine-modal-flow.tsx`.
  const { at, reservationId, step, tab } = resolvedSearchParams;
  const now = new Date();
  const currentUserId = session?.user?.id;
  const focusedAt = resolveIsoDateFromQuery(at) ?? now;
  const machinePromise = viewMachineDetails(machineId);
  const canReservePromise = checkReservationEligibility(machineId, currentUserId);
  const todayKey = formatDayKey(now, timeZone);
  const selectedDateKey = formatDayKey(focusedAt, timeZone);
  const reservationsPromise = viewMachineReservationsForDayKey(machineId, selectedDateKey, timeZone);
  const reservationsTodayPromise =
    selectedDateKey === todayKey
      ? reservationsPromise
      : viewMachineReservationsForDayKey(machineId, todayKey, timeZone);
  const normalizedStep = reservationId ? 'edit' : step === 'create' ? 'create' : 'schedule';
  const reservationFormPromise = viewMachineReservationForm({
    machineId,
    reservationId: normalizedStep === 'edit' ? reservationId : null,
    at,
    actor: session?.user
  });
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
      focusedAt={reservationForm?.startAt ?? focusedAt}
      canReserve={canReserve}
      initialReservationState={
        normalizedStep === 'schedule'
          ? undefined
          : {
              at: reservationForm?.startAt ?? focusedAt,
              reservation: normalizedStep === 'edit' ? (reservationForm?.reservation ?? null) : null
            }
      }
      reservationFormOptions={{
        participantOptions: reservationForm?.participantOptions ?? []
      }}
      viewer={{
        userId: currentUserId,
        canManageReservations: canManage
      }}
      initialTab={tab === 'info' ? 'info' : 'reservations'}
      closeHref="/hub/fab-lab/machines"
    />
  );
}
