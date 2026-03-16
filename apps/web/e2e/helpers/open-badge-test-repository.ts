import { ActivityStatus as PrismaActivityStatus, type PrismaClient } from '@prisma/client';
import { getE2EPrismaClient } from './e2e-prisma';

export class OpenBadgeTestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async setStatusByName(name: string, status: PrismaActivityStatus): Promise<void> {
    const badge = await this.prisma.openBadge.findFirst({
      where: { name },
      select: { id: true }
    });

    if (!badge) {
      throw new Error(`Open badge not found for name ${name}`);
    }

    await this.prisma.openBadge.update({
      where: { id: badge.id },
      data: { status }
    });
  }
}

const repositoriesBySlot = new Map<string, OpenBadgeTestRepository>();

export const getOpenBadgeTestRepository = (dbSlot?: string): OpenBadgeTestRepository => {
  const key = dbSlot?.trim() || process.env.PLAYWRIGHT_DB_SLOT?.trim() || 'default';
  const cached = repositoriesBySlot.get(key);

  if (cached) {
    return cached;
  }

  const repository = new OpenBadgeTestRepository(getE2EPrismaClient(key));
  repositoriesBySlot.set(key, repository);
  return repository;
};
