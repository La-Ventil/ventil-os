import type { Prisma, PrismaClient } from '@prisma/client';
import type { UserCredentialsSchema } from './schemas/user-credentials';
import type { UserAdminSchema } from './schemas/user-admin';
import type { UserPasswordResetSchema } from './schemas/user-password-reset';
import type { UserProfileSchema } from './schemas/user-profile';
import type { UserSummarySchema } from './schemas/user-summary';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

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

    return maybeUser ? (maybeUser as UserProfileSchema) : null;
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
        username: true,
        educationLevel: true,
        pedagogicalAdmin: true,
        globalAdmin: true,
        lastName: true,
        firstName: true
      }
    });

    return user ? (user as UserCredentialsSchema) : null;
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

    return users as UserAdminSchema[];
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

    return users as UserSummarySchema[];
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

    return user ? (user as UserPasswordResetSchema) : null;
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
}
