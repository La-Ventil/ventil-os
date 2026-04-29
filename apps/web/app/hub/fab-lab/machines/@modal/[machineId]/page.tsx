import type { JSX } from 'react';
import { canManageReservations } from '@repo/application';
import { viewMachineScheduleContext } from '@repo/application/machines/usecases';
import { getTimeZone } from 'next-intl/server';
import MachineModalRouteClient from '../../../_machine-modal/machine-modal-route.client';
import { getServerSession } from '../../../../../../lib/auth';
import { traceServerOperation } from '../../../../../../lib/observability/server-tracing';

type MachineModalPageProps = {
  params: Promise<{ machineId: string }>;
  searchParams?: Promise<{
    at?: string;
    reservationId?: string;
    step?: 'schedule' | 'create' | 'edit';
    tab?: 'info' | 'reservations';
  }>;
};

export default async function MachineModalPage({
  params,
  searchParams
}: MachineModalPageProps): Promise<JSX.Element | null> {
  const [{ machineId }, resolvedSearchParams, timeZone, session] = await Promise.all([
    params,
    searchParams ??
      Promise.resolve<{
        at?: string;
        reservationId?: string;
        step?: 'schedule' | 'create' | 'edit';
        tab?: 'info' | 'reservations';
      }>({}),
    getTimeZone(),
    getServerSession()
  ]);
  // Invariant: this route must stay under `machines/@modal/[machineId]`.
  // The parent list context is `/hub/fab-lab/machines`; if the modal route stops
  // mirroring that subtree, the standalone machine page replaces the list instead
  // of rendering on top of it.
  // The server page only hydrates the initial modal context; reservation tab transitions
  // must remain client-side in `_machine-modal/use-machine-modal-flow.tsx`.
  const { at, reservationId, step, tab } = resolvedSearchParams;
  const currentUserId = session?.user?.id;
  const modalContext = await traceServerOperation(
    'fab_lab.machine_modal.view_schedule_context',
    {
      'app.machine.id': machineId,
      'app.machine.modal.step': step,
      'app.machine.modal.tab': tab,
      'app.user.authenticated': Boolean(session?.user)
    },
    () =>
      viewMachineScheduleContext({
        machineId,
        at,
        reservationId,
        step,
        actor: session?.user,
        timeZone
      })
  );

  if (!modalContext) {
    return null;
  }

  const canManage = canManageReservations(session?.user);
  return (
    <MachineModalRouteClient
      machine={modalContext.machine}
      reservations={modalContext.reservations}
      focusedAt={modalContext.focusedAt}
      canReserve={modalContext.canReserve}
      initialReservationState={modalContext.initialReservationState}
      reservationFormOptions={modalContext.reservationFormOptions}
      viewer={{
        userId: currentUserId,
        canManageReservations: canManage
      }}
      initialTab={tab === 'info' ? 'info' : 'reservations'}
      closeHref="/hub/fab-lab/machines"
    />
  );
}
