'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { MachineDetailsViewModel } from '@repo/application/machines/models/machine-details';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/application/users/models/user-summary';
import MachineModal from '@repo/ui/machine/machine-modal';
import { formatDayKey, type DayKey } from '@repo/application';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';
import { machineReservationFormSchema } from '@repo/application/forms';
import { resolveFormFeedback } from '@repo/form/form-feedback';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createMachineReservationInitialState } from '@repo/ui/machine/machine-reservation-form';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import useTimeZone from '@repo/ui/hooks/use-time-zone';
import {
  cancelMachineReservationAction,
  type ReservationActionResult
} from '../../../lib/actions/machines/cancel-machine-reservation';
import { reserveMachineAction } from '../../../lib/actions/machines/reserve-machine';

type MachineModalRouteClientProps = {
  machine: MachineDetailsViewModel | null;
  reservations: MachineReservationViewModel[];
  dayKey: DayKey;
  closeHref: string;
  canReserve?: boolean;
  currentUserId?: string;
  canManageReservations?: boolean;
  reservationStartAt?: Date | null;
  reservation?: MachineReservationViewModel | null;
  participantOptions?: UserSummaryViewModel[];
  initialTab?: 'info' | 'reservations';
};

export default function MachineModalRouteClient({
  machine,
  reservations,
  dayKey,
  closeHref,
  canReserve = true,
  currentUserId,
  canManageReservations,
  reservationStartAt = null,
  reservation = null,
  participantOptions = [],
  initialTab = 'reservations'
}: MachineModalRouteClientProps): JSX.Element | null {
  const router = useRouter();
  const t = useTranslations('pages.hub.fabLab');
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const timeZone = useTimeZone();
  const machineId = machine?.id ?? '';
  const modalPath = machine ? `/hub/fab-lab/${machineId}` : closeHref;
  const { open, handleClose } = useRouteModal({
    modalPath,
    closeHref
  });
  const buildMachineHref = useCallback(
    (params?: { day?: DayKey; tab?: 'info' | 'reservations'; start?: string; reservationId?: string }) => {
      const searchParams = new URLSearchParams();
      const nextDay = params?.day ?? dayKey;
      const nextTab = params?.tab;
      const nextStart = params?.start;
      const nextReservationId = params?.reservationId;

      if (nextDay) {
        searchParams.set('day', nextDay);
      }

      if (nextTab) {
        searchParams.set('tab', nextTab);
      }

      if (nextStart) {
        searchParams.set('start', nextStart);
      }

      if (nextReservationId) {
        searchParams.set('reservationId', nextReservationId);
      }

      const query = searchParams.toString();
      return query ? `${modalPath}?${query}` : modalPath;
    },
    [dayKey, modalPath]
  );
  const initialReservationState = useMemo(() => {
    if (!reservationStartAt) {
      return createMachineReservationInitialState(machineId, new Date());
    }

    if (!reservation) {
      return createMachineReservationInitialState(machineId, reservationStartAt);
    }

    const durationMinutes = MachineReservation.durationMinutes(reservation);
    const participantIds = reservation.participants.map((participant) => participant.user.id);
    return createMachineReservationInitialState(
      machineId,
      reservation.startsAt,
      durationMinutes,
      participantIds,
      reservation.id
    );
  }, [machineId, reservation, reservationStartAt]);
  const formState = useFormActionState({
    action: reserveMachineAction,
    initialState: initialReservationState,
    schema: machineReservationFormSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });
  const [state] = formState;
  const canCancelReservation = useMemo(() => {
    if (!reservation) return false;
    const isOwner = Boolean(currentUserId && reservation.creator.id === currentUserId);
    const canAct = isOwner || Boolean(canManageReservations);
    return canAct && MachineReservation.isUpcoming(reservation, new Date());
  }, [canManageReservations, currentUserId, reservation]);
  const closeReservationForm = useCallback(() => {
    router.replace(buildMachineHref({ tab: 'reservations' }));
  }, [buildMachineHref, router]);
  const handleTabChange = useCallback(
    (tab: 'info' | 'reservations') => {
      router.replace(buildMachineHref({ tab }));
    },
    [buildMachineHref, router]
  );
  const normalizeReservationActionResult = useCallback(
    (result: ReservationActionResult): ReservationActionResult => {
      const nextFeedback = resolveFormFeedback(result, {
        fallbackErrorMessage: t('reservations.error.cancel'),
        fallbackSuccessMessage: t('reservations.success.cancel')
      });

      return {
        success: result.success,
        message: nextFeedback?.message ?? ''
      };
    },
    [t]
  );
  const handleCancelReservation = useCallback(async (): Promise<ReservationActionResult> => {
    if (!reservation) {
      return normalizeReservationActionResult({ success: false, message: '' });
    }

    const result = normalizeReservationActionResult(await cancelMachineReservationAction(reservation.id));
    if (result.success) {
      closeReservationForm();
    }

    return result;
  }, [closeReservationForm, normalizeReservationActionResult, reservation]);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    const nextDayKey = formatDayKey(new Date(state.values.startsAt), timeZone);
    const nextUrl = buildMachineHref({ day: nextDayKey, tab: 'reservations' });
    router.replace(nextUrl);
  }, [buildMachineHref, router, state.success, state.values.startsAt, timeZone]);

  if (!machine) {
    return null;
  }

  return (
    <>
      <div
        hidden
        data-testid="machine-reservation-state"
        data-success={String(state.success)}
        data-valid={String(state.valid)}
        data-message={state.message ?? ''}
      />
      <MachineModal
        machine={machine}
        reservations={reservations}
        dayKey={dayKey}
        initialTab={initialTab}
        canReserve={canReserve}
        currentUserId={currentUserId}
        canManageReservations={canManageReservations}
        reservationStartAt={state.success ? null : reservationStartAt}
        reservationId={state.success ? undefined : reservation?.id}
        initialParticipants={
          state.success ? undefined : reservation?.participants.map((participant) => participant.user)
        }
        participantOptions={participantOptions}
        formState={formState}
        open={open}
        onClose={handleClose}
        onCloseReservationForm={closeReservationForm}
        onCancelReservation={reservation && canCancelReservation ? handleCancelReservation : undefined}
        onTabChange={handleTabChange}
        onOpenReservation={
          canReserve
            ? (slot) => {
                router.push(buildMachineHref({ tab: 'reservations', start: slot.toISOString() }));
              }
            : undefined
        }
        onReservationClick={(reservation) => {
          router.push(buildMachineHref({ tab: 'reservations', reservationId: reservation.id }));
        }}
        onDateChange={(dayKey) => {
          router.push(buildMachineHref({ day: dayKey, tab: 'reservations' }));
        }}
      />
    </>
  );
}
