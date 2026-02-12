import { randomBytes } from 'node:crypto';
import { ConsentType, ExternalProfile, Profile, StudentProfile, userRepository } from '@repo/db';
import type { UserCredentialsSchema, UserPasswordResetSchema } from '@repo/db/schemas';
import { ProfileType } from '@repo/domain/profile-type';
import type { UserProfile } from '@repo/view-models/user-profile';
import { mapUserProfileToViewModel } from './mappers/user-profile';
import { mapUserAdminToViewModel } from './mappers/user-admin';
import { mapUserSummaryToViewModel } from './mappers/user-summary';
import { prismaClient } from './prisma';

export const getUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  const profile = await userRepository.getUserProfileByEmail(email);
  return profile ? mapUserProfileToViewModel(profile) : null;
};

export const listUsersForManagement = async () => {
  const users = await userRepository.listUsersForManagement();
  return users.map(mapUserAdminToViewModel);
};

export const listUsersForReservation = async () => {
  const users = await userRepository.listUserSummaries();
  return users.map(mapUserSummaryToViewModel);
};

export const getUserCredentialsByEmail = async (email: string): Promise<UserCredentialsSchema | null> =>
  userRepository.findUserCredentialsByEmail(email);

export type RegisterUserAccountInput = {
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  educationLevel: string;
  profileType: string;
  hashedSecret: string;
  salt: string;
  iterations: number;
  termsAccepted: boolean;
};

export type RegisterUserAccountResult = { ok: true } | { ok: false; reason: 'email-already-used' };

const isUniqueConstraintError = (error: unknown): error is { code: string } => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return 'code' in error && (error as { code?: string }).code === 'P2002';
};

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

const generateToken = (bytes: number) => randomBytes(bytes).toString('base64url');

const generateUsername = (firstName: string, lastName: string) => `${firstName}${lastName}#${generateToken(6)}`;

export const registerUserAccount = async (input: RegisterUserAccountInput): Promise<RegisterUserAccountResult> => {
  const { profile, studentProfile, externalProfile } = resolveProfile(input.profileType);
  const username = input.username ?? generateUsername(input.firstName, input.lastName);

  try {
    await userRepository.createUser({
      name: input.lastName,
      email: input.email,
      username,
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
    if (isUniqueConstraintError(error)) {
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

export const updateUserProfile = async (userId: string, input: UpdateUserProfileInput): Promise<void> => {
  await userRepository.updateUserProfile(userId, {
    name: input.lastName,
    firstName: input.firstName,
    lastName: input.lastName,
    educationLevel: input.educationLevel
  });
};

export const findUserForPasswordReset = async (email: string): Promise<UserPasswordResetSchema | null> =>
  userRepository.findUserForPasswordReset(email);

export const userExists = async (userId: string): Promise<boolean> => {
  const user = await userRepository.exists(userId);
  return Boolean(user);
};

export const requestPasswordReset = async (email: string) => {
  const user = await findUserForPasswordReset(email);

  if (!user) {
    return { user: null, resetToken: null, resetTokenExpiry: null };
  }

  const resetToken = generateToken(24);
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await userRepository.setResetToken(user.id, resetToken, resetTokenExpiry);

  return { user, resetToken, resetTokenExpiry };
};

export const setUserResetToken = async (userId: string, resetToken: string, resetTokenExpiry: Date): Promise<void> => {
  await userRepository.setResetToken(userId, resetToken, resetTokenExpiry);
};

export const findUserByValidResetToken = async (token: string) => userRepository.findUserByValidResetToken(token);

export const updateUserPassword = async (
  userId: string,
  data: {
    password: string;
    salt: string;
    iterations: number;
  }
) => userRepository.updateUserPassword(userId, data);

export type UserProfileStats = {
  events: number;
  openBadges: number;
  machines: number;
};

export const getUserProfileStats = async (userId: string): Promise<UserProfileStats> => {
  const now = new Date();
  const [events, openBadges, machines] = await Promise.all([
    prismaClient.eventRegistration.count({
      where: { userId }
    }),
    prismaClient.openBadgeProgress.count({
      where: { userId }
    }),
    prismaClient.machineReservation.count({
      where: {
        status: 'confirmed',
        endsAt: {
          lt: now
        },
        OR: [
          { creatorId: userId },
          {
            participants: {
              some: {
                userId
              }
            }
          }
        ]
      }
    })
  ]);

  return { events, openBadges, machines };
};
