import { userRepository } from '@repo/db';
import { isUniqueConstraintError } from './mappers';

export type UpdateUserProfileInput = {
  firstName: string;
  lastName: string;
  educationLevel?: string | null;
};

export type UpdateUserEmailResult = { ok: true } | { ok: false; reason: 'email-already-used' };

export const updateUserProfile = async (userId: string, input: UpdateUserProfileInput): Promise<void> => {
  await userRepository.updateUserProfile(userId, {
    name: input.lastName,
    firstName: input.firstName,
    lastName: input.lastName,
    ...(input.educationLevel !== undefined ? { educationLevel: input.educationLevel } : {})
  });
};

export const updateUserEmail = async (userId: string, email: string): Promise<UpdateUserEmailResult> => {
  try {
    await userRepository.updateUserEmail(userId, email);
    return { ok: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, reason: 'email-already-used' };
    }
    throw error;
  }
};
