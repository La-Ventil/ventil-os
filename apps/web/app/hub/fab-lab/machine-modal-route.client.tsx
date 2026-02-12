'use client';

import type { JSX } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import MachineModal from '@repo/ui/machine/machine-modal';
import type { DayKey } from '@repo/application';

type MachineModalRouteClientProps = {
  machine: MachineDetailsViewModel | null;
  reservations: MachineReservationViewModel[];
  dayKey: DayKey;
  closeHref: string;
  canReserve?: boolean;
};

export default function MachineModalRouteClient({
  machine,
  reservations,
  dayKey,
  closeHref,
  canReserve = true
}: MachineModalRouteClientProps): JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();

  if (!machine) {
    return null;
  }

  const isOpen = pathname === `/hub/fab-lab/${machine.id}`;

  return (
    <MachineModal
      machine={machine}
      reservations={reservations}
      dayKey={dayKey}
      canReserve={canReserve}
      open={isOpen}
      onClose={() => {
        router.push(closeHref);
      }}
      onOpenReservation={
        canReserve
          ? (slot) => {
              router.push(`/hub/fab-lab/${machine.id}/reservation?start=${encodeURIComponent(slot.toISOString())}`);
            }
          : undefined
      }
      onDateChange={(dayKey) => {
        router.push(`/hub/fab-lab/${machine.id}?day=${dayKey}`);
      }}
    />
  );
}
