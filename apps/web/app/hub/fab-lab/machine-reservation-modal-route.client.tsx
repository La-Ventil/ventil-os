'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { MachineDetailsViewModel } from '@repo/application/machines/models/machine-details';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/application/users/models/user-summary';
import { machineReservationFormSchema } from '@repo/application/forms';
import { resolveFormFeedback } from '@repo/form/form-feedback';
import { useFormActionState } from '@repo/form/use-form-action-state';
import MachineReservationModal from '@repo/ui/machine/machine-reservation-modal';
import { createMachineReservationInitialState } from '@repo/ui/machine/machine-reservation-form';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import { reserveMachineAction } from '../../../lib/actions/machines/reserve-machine';
import {
  cancelMachineReservationAction,
  type ReservationActionResult
} from '../../../lib/actions/machines/cancel-machine-reservation';

type MachineReservationModalRouteClientProps = {
  machine: MachineDetailsViewModel | null;
  participantOptions: UserSummaryViewModel[];
  startAt: Date;
  reservation?: MachineReservationViewModel | null;
  closeHref: string;
  currentUserId?: string;
  canManageReservations?: boolean;
};

export default function MachineReservationModalRouteClient({
  machine,
  participantOptions,
  startAt,
  reservation,
  closeHref,
  currentUserId,
  canManageReservations
}: MachineReservationModalRouteClientProps): JSX.Element | null {
  const t = useTranslations('pages.hub.fabLab');
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const machineId = machine?.id ?? '';
  const reservationModalPath = machineId ? `/hub/fab-lab/${machineId}/reservation` : null;
  const { open, handleClose: closeReservationModal } = useRouteModal({
    modalPath: reservationModalPath,
    closeHref,
    refreshOnClose: true
  });
  const initialState = useMemo(() => {
    if (!reservation) {
      return createMachineReservationInitialState(machineId, startAt);
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
  }, [machineId, reservation, startAt]);
  const formState = useFormActionState({
    action: reserveMachineAction,
    initialState,
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
  const closeReservationFlow = closeReservationModal;
  const normalizeReservationActionResult = useCallback(
    (result: ReservationActionResult): ReservationActionResult => {
      const feedback = resolveFormFeedback(result, {
        fallbackErrorMessage: t('reservations.error.cancel'),
        fallbackSuccessMessage: t('reservations.success.cancel')
      });

      return {
        success: result.success,
        message: feedback?.message ?? ''
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
      closeReservationFlow();
    }
    return result;
  }, [closeReservationFlow, normalizeReservationActionResult, reservation]);

  useEffect(() => {
    if (!state.success) return;
    closeReservationFlow();
  }, [closeReservationFlow, state.success]);

  if (!machine) {
    return null;
  }

  return (
    <MachineReservationModal
      machine={machine}
      reservationId={reservation?.id}
      initialParticipants={reservation?.participants.map((participant) => participant.user)}
      participantOptions={participantOptions}
      startAt={reservation?.startsAt ?? startAt}
      formState={formState}
      currentUserId={currentUserId}
      open={open}
      onClose={closeReservationModal}
      onCancelReservation={reservation && canCancelReservation ? handleCancelReservation : undefined}
    />
  );
}
