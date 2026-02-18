import { ExternalProfile, Profile, StudentProfile, type Prisma, type PrismaClient } from '@prisma/client';
import { parseEducationLevel } from '@repo/domain/user/education-level';
import { Email } from '@repo/domain/user/email';
import { deriveUserRole } from '@repo/domain/user/user-role';
import type { UserCredentialsSchema, UserCredentialsSchemaRaw } from './schemas/user-credentials';
import type { UserAdminSchema, UserAdminSchemaRaw } from './schemas/user-admin';
import type { UserPasswordResetSchema, UserPasswordResetSchemaRaw } from './schemas/user-password-reset';
import type { UserProfileSchema, UserProfileSchemaRaw } from './schemas/user-profile';
import type { UserSummarySchema, UserSummarySchemaRaw } from './schemas/user-summary';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeUserProfile(user: UserProfileSchemaRaw): UserProfileSchema {
    const { email, pendingEmail, educationLevel, profile, studentProfile, externalProfile, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email),
      pendingEmail: pendingEmail ? Email.from(pendingEmail) : null,
      educationLevel: parseEducationLevel(educationLevel)
    };
  }

  private normalizeUserCredentials(user: UserCredentialsSchemaRaw): UserCredentialsSchema {
    const { email, educationLevel, profile, studentProfile, externalProfile, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email),
      educationLevel: parseEducationLevel(educationLevel)
    };
  }

  private normalizeUserAdmin(user: UserAdminSchemaRaw): UserAdminSchema {
    const { email, profile, studentProfile, externalProfile, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email)
    };
  }

  private normalizeUserSummary(user: UserSummarySchemaRaw): UserSummarySchema {
    const { email, ...rest } = user;

    return {
      ...rest,
      email: Email.from(email)
    };
  }

  private normalizeUserPasswordReset(user: UserPasswordResetSchemaRaw): UserPasswordResetSchema {
    const { email, ...rest } = user;

    return {
      ...rest,
      email: Email.from(email)
    };
  }

  async getUserProfileByEmail(email: string): Promise<UserProfileSchema | null> {
    const maybeUser = await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        pendingEmail: true,
        emailVerified: true,
        image: true,
        profile: true,
        studentProfile: true,
        externalProfile: true,
        username: true,
        educationLevel: true,
        pedagogicalAdmin: true,
        globalAdmin: true,
        lastName: true,
        firstName: true
      }
    });

    return maybeUser ? this.normalizeUserProfile(maybeUser as UserProfileSchemaRaw) : null;
  }

  async findUserCredentialsByEmail(email: string): Promise<UserCredentialsSchema | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        image: true,
        password: true,
        salt: true,
        iterations: true,
        profile: true,
        studentProfile: true,
        externalProfile: true,
        username: true,
        educationLevel: true,
        pedagogicalAdmin: true,
        globalAdmin: true,
        lastName: true,
        firstName: true
      }
    });

    return user ? this.normalizeUserCredentials(user as UserCredentialsSchemaRaw) : null;
  }

  async listUsersForManagement(): Promise<UserAdminSchema[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        profile: true,
        studentProfile: true,
        externalProfile: true,
        pedagogicalAdmin: true,
        globalAdmin: true,
        _count: {
          select: {
            eventRegistrations: true,
            openBadgeProgresses: true
          }
        }
      }
    });

    return users.map((user) => this.normalizeUserAdmin(user as UserAdminSchemaRaw));
  }

  async listUserSummaries(): Promise<UserSummarySchema[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        image: true,
        email: true
      }
    });

    return users.map((user) => this.normalizeUserSummary(user as UserSummarySchemaRaw));
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

  async findUserForPasswordReset(email: string): Promise<UserPasswordResetSchema | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });

    return user ? this.normalizeUserPasswordReset(user as UserPasswordResetSchemaRaw) : null;
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
