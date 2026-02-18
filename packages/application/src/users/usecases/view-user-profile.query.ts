import type { UserProfile } from '@repo/view-models/user-profile';
import { userRepository } from '@repo/db';
import { mapUserProfileToViewModel } from '../../presenters/user-profile';
import type { Query } from '../../usecase';

export const viewUserProfile: Query<[string], UserProfile | null> = async (email: string) => {
  const profile = await userRepository.getUserProfileByEmail(email);
  return profile ? mapUserProfileToViewModel(profile) : null;
};
