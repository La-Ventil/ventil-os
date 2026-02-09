'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import MachineModal from '@repo/ui/machine/machine-modal';

type MachineModalRouteClientProps = {
  machine: MachineDetailsViewModel | null;
  reservations: MachineReservationViewModel[];
  date: string;
  closeHref: string;
};

export default function MachineModalRouteClient({
  machine,
  reservations,
  date,
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
      date={date}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.push(closeHref);
      }}
    />
  );
}
