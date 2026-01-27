import { ConsentType, ExternalProfile, Prisma, Profile, StudentProfile, userRepository } from '@repo/db';
import type { UserCredentialsSchema, UserPasswordResetSchema } from '@repo/db/schemas';
import { ProfileType } from '@repo/domain/profile-type';
import type { UserProfile } from '@repo/view-models/user-profile';
import { mapUserProfileToViewModel } from './mappers/user-profile';

export const getUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  const profile = await userRepository.getUserProfileByEmail(email);
  return profile ? mapUserProfileToViewModel(profile) : null;
};

export const getUserCredentialsByEmail = async (
  email: string
): Promise<UserCredentialsSchema | null> => userRepository.findUserCredentialsByEmail(email);

export type RegisterUserAccountInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  educationLevel: string;
  profileType: string;
  hashedSecret: string;
  salt: string;
  iterations: number;
  termsAccepted: boolean;
};

export type RegisterUserAccountResult =
  | { ok: true }
  | { ok: false; reason: 'email-already-used' };

const resolveProfile = (profileType: string) => {
  let profile: Profile = Profile.student;
  let studentProfile: StudentProfile | null = null;
  let externalProfile: ExternalProfile | null = null;

  switch (profileType) {
    case ProfileType.Member:
      profile = Profile.student;
      studentProfile = StudentProfile.member;
      break;
    case ProfileType.Alumni:
      profile = Profile.student;
      studentProfile = StudentProfile.alumni;
      break;
    case ProfileType.Teacher:
      profile = Profile.teacher;
      break;
    case ProfileType.Contributor:
      profile = Profile.external;
      externalProfile = ExternalProfile.contributor;
      break;
    case ProfileType.Visitor:
      profile = Profile.external;
      externalProfile = ExternalProfile.visitor;
      break;
    default:
      profile = Profile.student;
      studentProfile = StudentProfile.visitor;
  }

  return { profile, studentProfile, externalProfile };
};

export const registerUserAccount = async (
  input: RegisterUserAccountInput
): Promise<RegisterUserAccountResult> => {
  const { profile, studentProfile, externalProfile } = resolveProfile(input.profileType);

  try {
    await userRepository.createUser({
      name: input.lastName,
      email: input.email,
      username: input.username,
      firstName: input.firstName,
      lastName: input.lastName,
      educationLevel: input.educationLevel,
      password: input.hashedSecret,
      salt: input.salt,
      iterations: input.iterations,
      profile,
      studentProfile,
      externalProfile,
      consents: {
        create: {
          accepted: input.termsAccepted,
          acceptedAt: new Date(),
          type: ConsentType.terms
        }
      }
    });

    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { ok: false, reason: 'email-already-used' };
    }

    throw error;
  }
};

export type UpdateUserProfileInput = {
  firstName: string;
  lastName: string;
  educationLevel: string;
};

export const updateUserProfile = async (
  userId: string,
  input: UpdateUserProfileInput
): Promise<void> => {
  await userRepository.updateUserProfile(userId, {
    name: input.lastName,
    firstName: input.firstName,
    lastName: input.lastName,
    educationLevel: input.educationLevel
  });
};

export const findUserForPasswordReset = async (
  email: string
): Promise<UserPasswordResetSchema | null> => userRepository.findUserForPasswordReset(email);

export const setUserResetToken = async (
  userId: string,
  resetToken: string,
  resetTokenExpiry: Date
): Promise<void> => {
  await userRepository.setResetToken(userId, resetToken, resetTokenExpiry);
};

export const findUserByValidResetToken = async (token: string) =>
  userRepository.findUserByValidResetToken(token);

export const updateUserPassword = async (
  userId: string,
  data: {
    password: string;
    salt: string;
    iterations: number;
  }
) => userRepository.updateUserPassword(userId, data);
