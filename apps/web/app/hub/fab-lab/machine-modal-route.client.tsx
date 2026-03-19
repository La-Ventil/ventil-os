'use client';

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';
import type { MachineDetailsViewModel } from '@repo/application/machines/models/machine-details';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import MachineModal from '@repo/ui/machine/machine-modal';
import type { DayKey } from '@repo/application';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';

type MachineModalRouteClientProps = {
  machine: MachineDetailsViewModel | null;
  reservations: MachineReservationViewModel[];
  dayKey: DayKey;
  closeHref: string;
  canReserve?: boolean;
  currentUserId?: string;
  canManageReservations?: boolean;
};

export default function MachineModalRouteClient({
  machine,
  reservations,
  dayKey,
  closeHref,
  canReserve = true,
  currentUserId,
  canManageReservations
}: MachineModalRouteClientProps): JSX.Element | null {
  const router = useRouter();

  if (!machine) {
    return null;
  }

  const modalPath = `/hub/fab-lab/${machine.id}`;
  const { open, handleClose } = useRouteModal({
    modalPath,
    closeHref
  });

  return (
    <MachineModal
      machine={machine}
      reservations={reservations}
      dayKey={dayKey}
      canReserve={canReserve}
      currentUserId={currentUserId}
      canManageReservations={canManageReservations}
      open={open}
      onClose={handleClose}
      onOpenReservation={
        canReserve
          ? (slot) => {
              router.push(`/hub/fab-lab/${machine.id}/reservation?start=${encodeURIComponent(slot.toISOString())}`);
            }
          : undefined
      }
      onReservationClick={(reservation) => {
        router.push(`/hub/fab-lab/${machine.id}/reservation?reservationId=${reservation.id}`);
      }}
      onDateChange={(dayKey) => {
        router.push(`/hub/fab-lab/${machine.id}?day=${dayKey}`);
      }}
    />
  );
}
