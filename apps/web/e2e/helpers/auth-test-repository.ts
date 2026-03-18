import type { PrismaClient } from '@prisma/client';
import { getE2EPrismaClient } from './e2e-prisma';

export class AuthTestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getResetTokenByEmail(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { resetToken: true }
    });

    if (!user?.resetToken) {
      throw new Error(`No reset token found for email ${email}`);
    }

    return user.resetToken;
  }

  async setBlockedByEmail(email: string, blocked: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { blocked }
    });
  }
}

const repositoriesBySlot = new Map<string, AuthTestRepository>();

export const getAuthTestRepository = (dbSlot?: string): AuthTestRepository => {
  const key = dbSlot?.trim() || process.env.PLAYWRIGHT_DB_SLOT?.trim() || 'default';
  const cached = repositoriesBySlot.get(key);

  if (cached) {
    return cached;
  }

  const repository = new AuthTestRepository(getE2EPrismaClient(key));
  repositoriesBySlot.set(key, repository);
  return repository;
};
