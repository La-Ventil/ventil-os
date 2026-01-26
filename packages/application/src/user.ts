import { userRepository } from '@repo/db';
import type { UserProfile } from '@repo/view-models/user-profile';
import { mapUserProfileToViewModel } from './mappers/user-profile';

export const getUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  const profile = await userRepository.getUserProfileByEmail(email);
  return profile ? mapUserProfileToViewModel(profile) : null;
};
