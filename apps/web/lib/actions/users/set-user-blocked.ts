'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { canManageUsers } from '@repo/application';
import { isUserError } from '@repo/domain/user/user-errors';
import { setUserBlocked } from '@repo/application/users/usecases';
import { getServerSession } from '../../auth';

export async function setUserBlockedAction(formData: FormData): Promise<void> {
  const session = await getServerSession();
  const userCanManageUsers = canManageUsers(session?.user);

  if (!session || !userCanManageUsers) {
    return;
  }

  const userId = formData.get('userId');
  const blocked = formData.get('blocked');

  if (typeof userId !== 'string' || typeof blocked !== 'string') {
    return;
  }

  try {
    await setUserBlocked({ actorUserId: session.user.id, userId, blocked: blocked === 'true' });
  } catch (error) {
    if (isUserError(error)) {
      return;
    }
    throw error;
  }

  revalidatePath('/hub/admin/users');
  revalidateTag('admin-statistics', {});
}
