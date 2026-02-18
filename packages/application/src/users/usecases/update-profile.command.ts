import { userRepository } from '@repo/db';
import type { Command } from '../../usecase';

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  educationLevel?: string | null;
};

export const updateProfile: Command<[string, UpdateProfileInput], void> = async (
  userId: string,
  input: UpdateProfileInput
) => {
  await userRepository.updateUserProfile(userId, {
    name: input.lastName,
    firstName: input.firstName,
    lastName: input.lastName,
    ...(input.educationLevel !== undefined ? { educationLevel: input.educationLevel } : {})
  });
};
