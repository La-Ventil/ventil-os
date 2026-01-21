import type { PrismaClient } from '@prisma/client';
import { UserProfile } from '@repo/domain/user-profile';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getUserProfileByEmail(email: string): Promise<UserProfile> {
    const maybeUser = await this.prisma.user.findFirstOrThrow({
      where: { email },
      select: {
        id: true,
        email: true,
        profile: true,
        username: true,
        educationLevel: true,
        pedagogicalAdmin: true,
        globalAdmin: true,
        lastName: true,
        firstName: true
      }
    });

    return {
      id: maybeUser.id,
      email: maybeUser.email,
      lastName: maybeUser.lastName,
      firstName: maybeUser.firstName,
      profile: maybeUser.profile,
      username: maybeUser.username,
      educationLevel: maybeUser.educationLevel,
      globalAdmin: maybeUser.globalAdmin,
      pedagogicalAdmin: maybeUser.pedagogicalAdmin
    };
  }
}
