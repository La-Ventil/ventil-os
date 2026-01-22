import type { PrismaClient } from '@prisma/client';
import type { UserProfile } from '@repo/domain/user-profile';
import { mapUserProfileToViewModel } from './mappers/user-profile';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    const maybeUser = await this.prisma.user.findFirst({
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

    return maybeUser ? mapUserProfileToViewModel(maybeUser) : null;
  }
}
