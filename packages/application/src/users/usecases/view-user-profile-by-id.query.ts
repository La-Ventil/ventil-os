import type { UserProfile } from '@repo/view-models/user-profile';
import { userRepository } from '@repo/db';
import { mapUserProfileToViewModel } from '../../presenters/user-profile';
import type { Query } from '../../usecase';

export const viewUserProfileById: Query<[string], UserProfile | null> = async (userId: string) => {
  const profile = await userRepository.getUserProfileById(userId);
  return profile ? mapUserProfileToViewModel(profile) : null;
};
