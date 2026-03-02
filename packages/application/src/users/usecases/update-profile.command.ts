import { mapUserRoleToProfileRecord, userRepository } from '@repo/db';
import { requiresEducationLevel, type UserRole } from '@repo/domain/user/user-role';
import type { Command } from '../../usecase';

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  educationLevel?: string | null;
  profile?: UserRole;
};

export const updateProfile: Command<[string, UpdateProfileInput], void> = async (
  userId: string,
  input: UpdateProfileInput
) => {
  const nextEducationLevel =
    input.profile && !requiresEducationLevel(input.profile)
      ? null
      : input.educationLevel;

  await userRepository.updateUserProfile(userId, {
    name: input.lastName,
    firstName: input.firstName,
    lastName: input.lastName,
    ...(input.profile ? mapUserRoleToProfileRecord(input.profile) : {}),
    ...(nextEducationLevel !== undefined ? { educationLevel: nextEducationLevel } : {})
  });
};
