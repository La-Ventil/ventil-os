'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import MachineModal from '@repo/ui/machine/machine-modal';
import type { DayKey } from '@repo/application';

type MachineModalRouteClientProps = {
  machine: MachineDetailsViewModel | null;
  reservations: MachineReservationViewModel[];
  dayKey: DayKey;
  closeHref: string;
};

export default function MachineModalRouteClient({
  machine,
  reservations,
  dayKey,
  closeHref
}: MachineModalRouteClientProps): JSX.Element | null {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(Boolean(machine));

  useEffect(() => {
    setIsOpen(Boolean(machine));
  }, [machine]);

  if (!machine) {
    return null;
  }

  return (
    <MachineModal
      machine={machine}
      reservations={reservations}
      dayKey={dayKey}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.push(closeHref);
      }}
      onOpenReservation={(slot) => {
        router.push(`/hub/fab-lab/${machine.id}/reservation?start=${encodeURIComponent(slot.toISOString())}`);
      }}
      onDateChange={(dayKey) => {
        router.push(`/hub/fab-lab/${machine.id}?day=${dayKey}`);
      }}
    />
  );
}
