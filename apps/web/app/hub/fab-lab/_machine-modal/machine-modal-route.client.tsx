'use client';

import type { JSX } from 'react';
import type { MachineDetailsViewModel } from '@repo/application/machines/models/machine-details';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/application/users/models/user-summary';
import MachineModal from '@repo/ui/machine/machine-modal';
import { type MachineModalTab } from './machine-reservation-modal.state';
import { useMachineModalFlow } from './use-machine-modal-flow';

type MachineModalRouteClientProps = {
  machine: MachineDetailsViewModel;
  reservations: MachineReservationViewModel[];
  closeHref: string;
  focusedAt: Date;
  canReserve?: boolean;
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
  initialTab?: MachineModalTab;
};

export default function MachineModalRouteClient({
  machine,
  reservations,
  closeHref,
  focusedAt,
  canReserve = true,
  viewer,
  initialReservationState,
  reservationFormOptions,
  initialTab = 'reservations'
}: MachineModalRouteClientProps): JSX.Element {
  const flow = useMachineModalFlow({
    machine,
    reservations,
    closeHref,
    focusedAt,
    canReserve,
    viewer,
    initialReservationState,
    reservationFormOptions,
    initialTab
  });

  return (
    <MachineModal
      machine={machine}
      reservations={flow.reservations}
      scheduleDayKey={flow.scheduleDayKey}
      initialTab={flow.tab}
      canReserve={flow.canReserve}
      viewer={flow.viewer}
      reservationForm={flow.reservationForm}
      isScheduleLoading={flow.isScheduleLoading}
      open={flow.open}
      onClose={flow.handleClose}
      onTabChange={flow.handleTabChange}
      onOpenReservation={flow.canReserve ? flow.handleOpenReservation : undefined}
      onReservationClick={flow.handleReservationClick}
      onScheduleDayChange={flow.handleScheduleDayChange}
    />
  );
}
