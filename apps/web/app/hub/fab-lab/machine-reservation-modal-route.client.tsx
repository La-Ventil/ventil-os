'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { machineReservationFormSchema } from '@repo/application/forms';
import { resolveFormFeedback } from '@repo/form/form-feedback';
import { useFormActionState } from '@repo/form/use-form-action-state';
import MachineReservationModal from '@repo/ui/machine/machine-reservation-modal';
import { createMachineReservationInitialState } from '@repo/ui/machine/machine-reservation-form';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import { reserveMachineAction } from '../../../lib/actions/reserve-machine';
import {
  cancelMachineReservationAction,
  type ReservationActionResult
} from '../../../lib/actions/cancel-machine-reservation';

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
  const router = useRouter();
  const t = useTranslations('pages.hub.fabLab');
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const [isOpen, setIsOpen] = useState(Boolean(machine));
  const machineId = machine?.id ?? '';
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
      setIsOpen(false);
      router.push(closeHref);
      router.refresh();
    }
    return result;
  }, [closeHref, normalizeReservationActionResult, reservation, router]);

  useEffect(() => {
    setIsOpen(Boolean(machine));
  }, [machine]);

  useEffect(() => {
    if (!state.success) return;
    setIsOpen(false);
    router.push(closeHref);
    router.refresh();
  }, [closeHref, router, state.success]);

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
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.push(closeHref);
      }}
      onCancelReservation={reservation && canCancelReservation ? handleCancelReservation : undefined}
    />
  );
}
