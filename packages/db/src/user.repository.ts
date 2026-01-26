import type { PrismaClient } from '@prisma/client';
import type { UserProfileSchema } from './schemas/user-profile';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getUserProfileByEmail(email: string): Promise<UserProfileSchema | null> {
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

    return maybeUser ? (maybeUser as UserProfileSchema) : null;
  }
}
