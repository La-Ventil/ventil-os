'use server';

import { revalidatePath } from 'next/cache';
import { canManageBadges } from '@repo/application';
import { ActivityStatus } from '@repo/domain/activity-status';
import { setOpenBadgeStatus } from '@repo/application/open-badges/usecases';
import { getServerSession } from '../../auth';
import { isOpenBadgeDomainError } from './open-badge-action-errors';

export async function setOpenBadgeStatusAction(formData: FormData): Promise<void> {
  const session = await getServerSession();
  const userCanManageBadges = canManageBadges(session?.user);

  if (!session || !userCanManageBadges) {
    return;
  }

  const badgeId = formData.get('badgeId');
  const nextStatus = formData.get('nextStatus');

  if (typeof badgeId !== 'string' || typeof nextStatus !== 'string') {
    return;
  }

  const status = nextStatus === ActivityStatus.Active ? ActivityStatus.Active : ActivityStatus.Inactive;

  try {
    await setOpenBadgeStatus({ id: badgeId, status });
    revalidatePath('/hub/admin/open-badges');
  } catch (error) {
    if (isOpenBadgeDomainError(error)) {
      return;
    }
    throw error;
  }
}
