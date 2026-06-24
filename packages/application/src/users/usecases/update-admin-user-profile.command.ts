import { mapUserRoleToProfileRecord, userRepository } from '@repo/db';
import { UserError } from '@repo/domain/user/user-errors';
import { resolvePersistedEducationLevel } from '@repo/domain/user/user-profile';
import type { EducationLevel } from '@repo/domain/user/education-level';
import type { UserRole } from '@repo/domain/user/user-role';
import type { Command } from '../../usecase';

export type UpdateAdminUserProfileInput = {
  actorUserId: string;
  firstName: string;
  lastName: string;
  educationLevel?: EducationLevel | null;
  profile: UserRole;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
};

export const updateAdminUserProfile: Command<[string, UpdateAdminUserProfileInput], void> = async (
  userId: string,
  input: UpdateAdminUserProfileInput
) => {
  const existingUser = await userRepository.getUserProfileById(userId);
  if (!existingUser) {
    throw new UserError('user.notFound');
  }

  const adminFlagsChanged =
    existingUser.globalAdmin !== input.globalAdmin || existingUser.pedagogicalAdmin !== input.pedagogicalAdmin;

  if (input.actorUserId === userId && adminFlagsChanged) {
    throw new UserError('user.cannotChangeOwnAdminAccess');
  }

  if (existingUser.globalAdmin && !input.globalAdmin) {
    const globalAdminCount = await userRepository.countGlobalAdmins();
    if (globalAdminCount <= 1) {
      throw new UserError('user.lastGlobalAdmin');
    }
  }

  const nextEducationLevel = resolvePersistedEducationLevel(input.profile, input.educationLevel);

  await userRepository.updateUserProfile(userId, {
    firstName: input.firstName,
    lastName: input.lastName,
    name: input.lastName,
    ...mapUserRoleToProfileRecord(input.profile),
    globalAdmin: input.globalAdmin,
    pedagogicalAdmin: input.pedagogicalAdmin,
    ...(nextEducationLevel !== undefined ? { educationLevel: nextEducationLevel } : {})
  });
};
