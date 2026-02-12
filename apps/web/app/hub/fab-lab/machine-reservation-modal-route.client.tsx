'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { machineReservationFormSchema } from '@repo/application/forms';
import { useFormActionState } from '@repo/form/use-form-action-state';
import MachineReservationModal from '@repo/ui/machine/machine-reservation-modal';
import { createMachineReservationInitialState } from '@repo/ui/machine/machine-reservation-form';
import { createMachineReservation } from '../../../lib/actions/create-machine-reservation';

type MachineReservationModalRouteClientProps = {
  machine: MachineDetailsViewModel | null;
  participantOptions: UserSummaryViewModel[];
  startAt: Date;
  closeHref: string;
  currentUserId?: string;
};

export default function MachineReservationModalRouteClient({
  machine,
  participantOptions,
  startAt,
  closeHref,
  currentUserId
}: MachineReservationModalRouteClientProps): JSX.Element | null {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const [isOpen, setIsOpen] = useState(Boolean(machine));
  const machineId = machine?.id ?? '';
  const initialState = useMemo(
    () => createMachineReservationInitialState(machineId, startAt),
    [machineId, startAt]
  );
  const formState = useFormActionState({
    action: createMachineReservation,
    initialState,
    schema: machineReservationFormSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });
  const [state] = formState;

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
      participantOptions={participantOptions}
      startAt={startAt}
      formState={formState}
      currentUserId={currentUserId}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.push(closeHref);
      }}
    />
  );
}
