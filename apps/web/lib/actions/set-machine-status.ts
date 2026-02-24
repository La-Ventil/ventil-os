'use server';

import { revalidatePath } from 'next/cache';
import { canManageMachines } from '@repo/application';
import { ActivityStatus } from '@repo/domain/activity-status';
import { setMachineStatus } from '@repo/application/machines/usecases';
import { getServerSession } from '../auth';

export async function setMachineStatusAction(formData: FormData): Promise<void> {
  const session = await getServerSession();
  const userCanManageMachines = canManageMachines(session?.user);

  if (!session || !userCanManageMachines) {
    return;
  }

  const machineId = formData.get('machineId');
  const nextStatus = formData.get('nextStatus');

  if (typeof machineId !== 'string' || typeof nextStatus !== 'string') {
    return;
  }

  const status =
    nextStatus === ActivityStatus.Active ? ActivityStatus.Active : ActivityStatus.Inactive;

  await setMachineStatus({ id: machineId, status });
  revalidatePath('/hub/admin/machines');
}
