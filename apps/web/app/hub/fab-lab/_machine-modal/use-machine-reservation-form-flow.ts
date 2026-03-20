'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { machineReservationFormSchema } from '@repo/application/forms';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import { resolveFormFeedback } from '@repo/form/form-feedback';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createMachineReservationInitialState } from '@repo/ui/machine/machine-reservation-form';
import {
  cancelMachineReservationAction,
  type ReservationActionResult
} from '../../../../lib/actions/machines/cancel-machine-reservation';
import { reserveMachineAction } from '../../../../lib/actions/machines/reserve-machine';

type UseMachineReservationFormFlowOptions = {
  machineId: string;
  startAt: Date;
  reservation: MachineReservationViewModel | null;
  currentUserId?: string;
  canManageReservations?: boolean;
  onClose: (nextAtIso?: string) => void;
  onSuccess: (nextStartsAtIso: string) => Promise<void>;
  onCancelSuccess?: (reservation: MachineReservationViewModel) => Promise<void>;
};

export function useMachineReservationFormFlow({
  machineId,
  startAt,
  reservation,
  currentUserId,
  canManageReservations,
  onClose,
  onSuccess,
  onCancelSuccess
}: UseMachineReservationFormFlowOptions) {
  const t = useTranslations('pages.hub.fabLab');
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const initialReservationState = useMemo(() => {
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

  useEffect(() => {
    if (!state.success) {
      return;
    }

    void onSuccess(state.values.startsAt);
  }, [onSuccess, state.success, state.values.startsAt]);

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
      onClose(reservation.startsAt.toISOString());
      await onCancelSuccess?.(reservation);
    }

    return result;
  }, [normalizeReservationActionResult, onCancelSuccess, onClose, reservation]);

  return {
    formState,
    state,
    canCancelReservation,
    handleCancelReservation
  };
}
