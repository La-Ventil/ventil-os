'use server';

import { revalidatePath } from 'next/cache';
import { canManageBadges } from '@repo/application';
import { removeOpenBadge } from '@repo/application/open-badges/usecases';
import { getServerSession } from '../../auth';
import { isOpenBadgeDomainError } from './open-badge-action-errors';

export async function removeOpenBadgeAction(formData: FormData): Promise<void> {
  const session = await getServerSession();
  const userCanManageBadges = canManageBadges(session?.user);

  if (!session || !userCanManageBadges) {
    return;
  }

  const badgeId = formData.get('badgeId');
  if (typeof badgeId !== 'string') {
    return;
  }

  try {
    await removeOpenBadge({ id: badgeId });
    revalidatePath('/hub/admin/open-badges');
  } catch (error) {
    if (isOpenBadgeDomainError(error)) {
      return;
    }
    throw error;
  }
}
