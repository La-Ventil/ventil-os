import { type Prisma, type PrismaClient } from '@prisma/client';
import { parseEducationLevel } from '@repo/domain/user/education-level';
import { Email } from '@repo/domain/user/email';
import { deriveUserRole } from '@repo/domain/user/user-role';
import { userProfileSelect } from '../schemas/user-profile';
import { userCredentialsSelect } from '../schemas/user-credentials';
import { userAdminSelect } from '../schemas/user-admin';
import { userPasswordResetSelect } from '../schemas/user-password-reset';
import { userSummarySelect } from '../schemas/user-summary';
import type { UserCredentialsReadModel, UserCredentialsRow } from '../schemas/user-credentials';
import type { UserAdminReadModel, UserAdminRow } from '../schemas/user-admin';
import type { UserPasswordResetReadModel, UserPasswordResetRow } from '../schemas/user-password-reset';
import type { UserProfileReadModel, UserProfileRow } from '../schemas/user-profile';
import type { UserSummaryReadModel, UserSummaryRow } from '../schemas/user-summary';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeUserProfile(user: UserProfileRow): UserProfileReadModel {
    const { email, pendingEmail, educationLevel, profile, studentProfile, externalProfile, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email),
      pendingEmail: pendingEmail ? Email.from(pendingEmail) : null,
      educationLevel: parseEducationLevel(educationLevel)
    };
  }

  private normalizeUserCredentials(user: UserCredentialsRow): UserCredentialsReadModel {
    const { email, educationLevel, profile, studentProfile, externalProfile, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email),
      educationLevel: parseEducationLevel(educationLevel)
    };
  }

  private normalizeUserAdmin(user: UserAdminRow): UserAdminReadModel {
    const { email, profile, studentProfile, externalProfile, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email)
    };
  }

  private normalizeUserSummary(user: UserSummaryRow): UserSummaryReadModel {
    const { email, ...rest } = user;

    return {
      ...rest,
      email: Email.from(email)
    };
  }

  private normalizeUserPasswordReset(user: UserPasswordResetRow): UserPasswordResetReadModel {
    const { email, ...rest } = user;

    return {
      ...rest,
      email: Email.from(email)
    };
  }

  async getUserProfileByEmail(email: string): Promise<UserProfileReadModel | null> {
    const maybeUser = await this.prisma.user.findFirst({
      where: { email },
      select: userProfileSelect
    });

    return maybeUser ? this.normalizeUserProfile(maybeUser as UserProfileRow) : null;
  }

  async getUserProfileById(userId: string): Promise<UserProfileReadModel | null> {
    const maybeUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userProfileSelect
    });

    return maybeUser ? this.normalizeUserProfile(maybeUser as UserProfileRow) : null;
  }

  async getUserProfileByEmailOrPending(email: string): Promise<UserProfileReadModel | null> {
    const maybeUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { pendingEmail: email }]
      },
      select: userProfileSelect
    });

    return maybeUser ? this.normalizeUserProfile(maybeUser as UserProfileRow) : null;
  }

  async findUserCredentialsByEmail(email: string): Promise<UserCredentialsReadModel | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: userCredentialsSelect
    });

    return user ? this.normalizeUserCredentials(user as UserCredentialsRow) : null;
  }

  async listUsersForManagement(): Promise<UserAdminReadModel[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: userAdminSelect
    });

    return users.map((user) => this.normalizeUserAdmin(user as UserAdminRow));
  }

  async listUserSummaries(): Promise<UserSummaryReadModel[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: userSummarySelect
    });

    return users.map((user) => this.normalizeUserSummary(user as UserSummaryRow));
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true
      }
    });
  }

  async updateUserProfile(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true }
    });
  }

  async updateUserEmail(userId: string, email: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        email,
        emailVerified: null
      },
      select: { id: true, email: true }
    });
  }

  async isEmailAvailableForUser(userId: string, email: string): Promise<boolean> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { pendingEmail: email }]
      },
      select: { id: true }
    });

    if (!existing) {
      return true;
    }

    return existing.id === userId;
  }

  async updatePendingEmail(userId: string, pendingEmail: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { pendingEmail }
    });
  }

  async confirmUserEmail(
    userId: string,
    data: { email: string; pendingEmail: string | null; emailVerifiedAt: Date }
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        pendingEmail: data.pendingEmail,
        emailVerified: data.emailVerifiedAt
      }
    });
  }

  async findUserForPasswordReset(email: string): Promise<UserPasswordResetReadModel | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: userPasswordResetSelect
    });

    return user ? this.normalizeUserPasswordReset(user as UserPasswordResetRow) : null;
  }

  async getUserStats(
    userId: string,
    now: Date
  ): Promise<{ eventsCount: number; openBadgesCount: number; machinesCount: number }> {
    const [eventsCount, openBadgesCount, machinesCount] = await Promise.all([
      this.prisma.eventRegistration.count({
        where: { userId }
      }),
      this.prisma.openBadgeProgress.count({
        where: { userId }
      }),
      this.prisma.machineReservation.count({
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
  }

  async setResetToken(userId: string, resetToken: string, resetTokenExpiry: Date) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken,
        resetTokenExpiry
      },
      select: { id: true }
    });
  }

  async findUserByValidResetToken(resetToken: string) {
    return this.prisma.user.findFirst({
      where: {
        resetToken: { equals: resetToken },
        resetTokenExpiry: { gte: new Date() }
      },
      select: {
        id: true,
        email: true
      }
    });
  }

  async updateUserPassword(
    userId: string,
    data: {
      password: string;
      salt: string;
      iterations: number;
    }
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
        password: data.password,
        salt: data.salt,
        iterations: data.iterations
      },
      select: { id: true, email: true }
    });
  }

  async exists(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
  }

  async getDeleteDependencies(userId: string): Promise<{
    id: string;
    createdMachines: number;
    createdOpenBadges: number;
    createdEvents: number;
    createdEventTemplates: number;
    createdMachineReservations: number;
    openBadgeLevelAwards: number;
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        _count: {
          select: {
            createdMachines: true,
            createdOpenBadges: true,
            createdEvents: true,
            createdEventTemplates: true,
            createdMachineReservations: true,
            openBadgeLevelAwards: true
          }
        }
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      createdMachines: user._count.createdMachines,
      createdOpenBadges: user._count.createdOpenBadges,
      createdEvents: user._count.createdEvents,
      createdEventTemplates: user._count.createdEventTemplates,
      createdMachineReservations: user._count.createdMachineReservations,
      openBadgeLevelAwards: user._count.openBadgeLevelAwards
    };
  }

  async deleteUser(userId: string): Promise<{ id: string }> {
    return this.prisma.$transaction(async (tx) => {
      await tx.userConsent.deleteMany({
        where: { userId }
      });

      return tx.user.delete({
        where: { id: userId },
        select: { id: true }
      });
    });
  }
}
