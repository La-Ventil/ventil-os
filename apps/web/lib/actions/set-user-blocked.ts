'use server';

import { revalidatePath } from 'next/cache';
import { canManageUsers } from '@repo/application';
import { setUserBlocked } from '@repo/application/users/usecases';
import { getServerSession } from '../auth';

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

  await setUserBlocked({ userId, blocked: blocked === 'true' });
  revalidatePath('/hub/admin/users');
}
