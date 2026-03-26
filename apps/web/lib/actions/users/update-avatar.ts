'use server';

import type { AvatarSelection } from '@repo/avatar-system';
import { updateAvatar } from '@repo/application/users/usecases';
import { revalidatePath } from 'next/cache';
import { getUserProfileFromSession } from '../../auth';

export async function updateAvatarAction(selection: AvatarSelection): Promise<AvatarSelection> {
  const userProfile = await getUserProfileFromSession();
  const avatar = await updateAvatar(userProfile.id, selection);

  revalidatePath('/hub', 'layout');
  revalidatePath('/hub/profile');
  revalidatePath('/hub/settings/avatar');

  return avatar;
}
