import type { UserCredentialsSchema } from '@repo/db/schemas';
import type { UserStats } from '@repo/domain/user/user-stats';
import type { UserProfile } from '@repo/view-models/user-profile';
import { userRepository } from '@repo/db';
import { mapUserProfileToViewModel } from '../presenters/user-profile';
import { mapUserAdminToViewModel } from '../presenters/user-admin';
import { mapUserSummaryToViewModel } from '../presenters/user-summary';
import { prismaClient } from '../prisma';

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

export const userExists = async (userId: string): Promise<boolean> => {
  const user = await userRepository.exists(userId);
  return Boolean(user);
};

export const getUserProfileStats = async (userId: string): Promise<UserStats> => {
  const now = new Date();
  const [eventsCount, openBadgesCount, machinesCount] = await Promise.all([
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

  return { eventsCount, openBadgesCount, machinesCount };
};
