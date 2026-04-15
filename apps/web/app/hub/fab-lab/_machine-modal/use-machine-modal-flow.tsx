'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { formatDayKey, type DayKey } from '@repo/application';
import type { MachineDetailsViewModel } from '@repo/application/machines/models/machine-details';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/application/users/models/user-summary';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';
import useTimeZone from '@repo/ui/hooks/use-time-zone';
import {
  createMachineReservationModalState,
  getMachineModalTab,
  getReservationStep,
  getSelectedReservation,
  machineReservationModalReducer,
  type MachineModalTab
} from './machine-reservation-modal.state';
import { useMachineReservationsDay } from './use-machine-reservations-day';
import MachineReservationFormFlow from './machine-reservation-form-flow';
import { buildMachineModalHref, replaceBrowserUrl } from './machine-modal-url';
import { useMachineReservationParticipantOptions } from './use-machine-reservation-participant-options';

type UseMachineModalFlowOptions = {
  machine: MachineDetailsViewModel;
  reservations: MachineReservationViewModel[];
  closeHref: string;
  focusedAt: Date;
  canReserve: boolean;
  viewer: {
    userId?: string;
    canManageReservations: boolean;
  };
  initialReservationState?: {
    at: Date;
    reservation: MachineReservationViewModel | null;
  };
  reservationFormOptions: {
    participantOptions: UserSummaryViewModel[];
  };
  initialTab: MachineModalTab;
};

type SyncUrlParams = {
  tab: MachineModalTab;
  step: 'schedule' | 'create' | 'edit';
  at?: Date | null;
  reservationId?: string | null;
};

export function useMachineModalFlow({
  machine,
  reservations,
  closeHref,
  focusedAt,
  canReserve,
  viewer,
  initialReservationState,
  reservationFormOptions,
  initialTab
}: UseMachineModalFlowOptions) {
  const timeZone = useTimeZone();
  const modalPath = `/hub/fab-lab/machines/${machine.id}`;
  // Invariant: opening/closing the modal is route-driven, but transitions inside the
  // reservation tab must stay client-side to avoid rerendering the server page.
  const { open, handleClose } = useRouteModal({
    modalPath,
    closeHref
  });
  const buildMachineHref = useCallback(
    (params?: {
      tab?: MachineModalTab;
      step?: 'schedule' | 'create' | 'edit' | null;
      at?: string | null;
      reservationId?: string | null;
    }) => buildMachineModalHref({ modalPath, ...params }),
    [modalPath]
  );
  const [reservationState, dispatch] = useReducer(
    machineReservationModalReducer,
    createMachineReservationModalState({
      tab: initialTab,
      focusedAt,
      reservationStartAt: initialReservationState?.reservation ? null : (initialReservationState?.at ?? null),
      reservation: initialReservationState?.reservation ?? null
    })
  );
  const {
    reservations: currentReservations,
    isLoading: isScheduleLoading,
    resetReservations,
    fetchReservationsForDay
  } = useMachineReservationsDay({
    machineId: machine.id,
    timeZone,
    initialReservations: reservations
  });

  useEffect(() => {
    dispatch({
      type: 'HYDRATE_FROM_SERVER_CONTEXT',
      tab: initialTab,
      focusedAt,
      reservationStartAt: initialReservationState?.reservation ? null : (initialReservationState?.at ?? null),
      reservation: initialReservationState?.reservation ?? null
    });
    resetReservations(reservations);
  }, [focusedAt, initialReservationState, initialTab, reservations, resetReservations]);

  const tab = getMachineModalTab(reservationState);
  const step = getReservationStep(reservationState);
  const selectedAt = reservationState.at;
  const selectedReservation = getSelectedReservation(reservationState);
  const scheduleDayKey = useMemo(() => formatDayKey(selectedAt, timeZone), [selectedAt, timeZone]);
  const { participantOptions, isLoadingParticipantOptions } = useMachineReservationParticipantOptions({
    machineId: machine.id,
    initialParticipantOptions: reservationFormOptions.participantOptions,
    enabled: step !== 'schedule'
  });

  const syncUrl = useCallback(
    ({ tab, step, at, reservationId }: SyncUrlParams) => {
      replaceBrowserUrl(
        buildMachineHref({
          tab,
          step,
          at: at ? at.toISOString() : null,
          reservationId: reservationId ?? null
        })
      );
    },
    [buildMachineHref]
  );

  const closeReservationForm = useCallback(
    (nextAtIso?: string) => {
      const nextAt = nextAtIso ? new Date(nextAtIso) : selectedAt;
      dispatch({ type: 'CLOSE_FORM', at: nextAt });
      syncUrl({ tab: 'reservations', step: 'schedule', at: nextAt });
    },
    [selectedAt, syncUrl]
  );

  const handleTabChange = useCallback(
    (nextTab: MachineModalTab) => {
      dispatch(nextTab === 'info' ? { type: 'OPEN_INFO' } : { type: 'OPEN_SCHEDULE' });
      syncUrl({
        tab: nextTab,
        step: nextTab === 'reservations' ? step : 'schedule',
        at: nextTab === 'reservations' ? selectedAt : null,
        reservationId: nextTab === 'reservations' && step === 'edit' ? selectedReservation?.id : null
      });
    },
    [selectedAt, selectedReservation?.id, step, syncUrl]
  );

  const handleScheduleDayChange = useCallback(
    (nextDayKey: DayKey) => {
      const nextAt = new Date(selectedAt);
      nextAt.setUTCFullYear(
        Number(nextDayKey.slice(0, 4)),
        Number(nextDayKey.slice(5, 7)) - 1,
        Number(nextDayKey.slice(8, 10))
      );

      dispatch({ type: 'CHANGE_DAY', at: nextAt });
      syncUrl({ tab: 'reservations', step: 'schedule', at: nextAt });
      void fetchReservationsForDay(nextDayKey);
    },
    [fetchReservationsForDay, selectedAt, syncUrl]
  );

  const handleOpenReservation = useCallback(
    (slot: Date) => {
      dispatch({ type: 'OPEN_CREATE', at: slot });
      syncUrl({ tab: 'reservations', step: 'create', at: slot });
    },
    [syncUrl]
  );

  const handleReservationClick = useCallback(
    (nextReservation: MachineReservationViewModel) => {
      dispatch({ type: 'OPEN_EDIT', reservation: nextReservation });
      syncUrl({
        tab: 'reservations',
        step: 'edit',
        reservationId: nextReservation.id
      });
    },
    [syncUrl]
  );

  const handleReservationSuccess = useCallback(
    async (nextStartsAtIso: string) => {
      const nextAt = new Date(nextStartsAtIso);
      dispatch({ type: 'CLOSE_FORM', at: nextAt });
      syncUrl({ tab: 'reservations', step: 'schedule', at: nextAt });
      await fetchReservationsForDay(formatDayKey(nextAt, timeZone), { skipCache: true });
    },
    [fetchReservationsForDay, syncUrl, timeZone]
  );

  const reservationForm: ReactNode = useMemo(() => {
    if (step === 'schedule') {
      return null;
    }

    return (
      <MachineReservationFormFlow
        key={selectedReservation?.id ?? selectedAt.toISOString()}
        machineId={machine.id}
        startAt={selectedReservation?.startsAt ?? selectedAt}
        reservation={selectedReservation}
        participantOptions={participantOptions}
        isParticipantOptionsLoading={isLoadingParticipantOptions}
        currentUserId={viewer.userId}
        canManageReservations={viewer.canManageReservations}
        onClose={closeReservationForm}
        onSuccess={handleReservationSuccess}
        onCancelSuccess={async (reservation) => {
          await fetchReservationsForDay(formatDayKey(reservation.startsAt, timeZone), { skipCache: true });
        }}
      />
    );
  }, [
    closeReservationForm,
    fetchReservationsForDay,
    handleReservationSuccess,
    isLoadingParticipantOptions,
    machine.id,
    participantOptions,
    selectedAt,
    selectedReservation,
    step,
    timeZone,
    viewer.canManageReservations,
    viewer.userId
  ]);

  return {
    open,
    handleClose,
    tab,
    scheduleDayKey,
    reservations: currentReservations,
    isScheduleLoading,
    reservationForm,
    canReserve,
    viewer,
    handleTabChange,
    handleOpenReservation,
    handleReservationClick,
    handleScheduleDayChange
  };
}
