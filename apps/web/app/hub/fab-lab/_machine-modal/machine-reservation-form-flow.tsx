'use client';

import type { JSX } from 'react';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/application/users/models/user-summary';
import MachineReservationForm from '@repo/ui/machine/machine-reservation-form';
import { useMachineReservationFormFlow } from './use-machine-reservation-form-flow';

type MachineReservationFormFlowProps = {
  machineId: string;
  startAt: Date;
  reservation: MachineReservationViewModel | null;
  participantOptions: UserSummaryViewModel[];
  currentUserId?: string;
  canManageReservations?: boolean;
  onClose: (nextAtIso?: string) => void;
  onSuccess: (nextStartsAtIso: string) => Promise<void>;
  onCancelSuccess?: (reservation: MachineReservationViewModel) => Promise<void>;
};

export default function MachineReservationFormFlow({
  machineId,
  startAt,
  reservation,
  participantOptions,
  currentUserId,
  canManageReservations,
  onClose,
  onSuccess,
  onCancelSuccess
}: MachineReservationFormFlowProps): JSX.Element {
  const { formState, state, canCancelReservation, handleCancelReservation } = useMachineReservationFormFlow({
    machineId,
    startAt,
    reservation,
    currentUserId,
    canManageReservations,
    onClose,
    onSuccess,
    onCancelSuccess
  });

  return (
    <>
      <div
        hidden
        data-testid="machine-reservation-state"
        data-success={String(state.success)}
        data-valid={String(state.valid)}
        data-message={state.message ?? ''}
      />
      <MachineReservationForm
        machineId={machineId}
        startAt={reservation?.startsAt ?? startAt}
        reservationId={reservation?.id}
        initialParticipants={reservation?.participants.map((participant) => participant.user)}
        participantOptions={participantOptions}
        currentUserId={currentUserId}
        onCancel={() => onClose(state.values.startsAt)}
        onCancelReservation={reservation && canCancelReservation ? handleCancelReservation : undefined}
        formState={formState}
      />
    </>
  );
}
