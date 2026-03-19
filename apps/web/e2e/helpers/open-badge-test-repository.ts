import { ActivityStatus as PrismaActivityStatus, type PrismaClient } from '@prisma/client';
import { getE2EPrismaClient } from './e2e-prisma';

export class OpenBadgeTestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findIdByName(name: string): Promise<string> {
    const badge = await this.prisma.openBadge.findFirst({
      where: { name },
      select: { id: true }
    });

    if (!badge) {
      throw new Error(`Open badge not found for name ${name}`);
    }

    return badge.id;
  }

  async setStatusByName(name: string, status: PrismaActivityStatus): Promise<void> {
    const id = await this.findIdByName(name);

    await this.prisma.openBadge.update({
      where: { id },
      data: { status }
    });
  }

  async removeProgressForUserByBadgeName(userEmail: string, badgeName: string): Promise<void> {
    const [user, badge] = await Promise.all([
      this.prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true }
      }),
      this.prisma.openBadge.findFirst({
        where: { name: badgeName },
        select: { id: true }
      })
    ]);

    if (!user) {
      throw new Error(`User not found for email ${userEmail}`);
    }

    if (!badge) {
      throw new Error(`Open badge not found for name ${badgeName}`);
    }

    await this.prisma.openBadgeProgress.deleteMany({
      where: {
        userId: user.id,
        openBadgeId: badge.id
      }
    });
  }

  async awardBadgeToUserByName(userEmail: string, badgeName: string, level: number = 1): Promise<void> {
    const [user, badge] = await Promise.all([
      this.prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true }
      }),
      this.prisma.openBadge.findFirst({
        where: { name: badgeName },
        select: { id: true }
      })
    ]);

    if (!user) {
      throw new Error(`User not found for email ${userEmail}`);
    }

    if (!badge) {
      throw new Error(`Open badge not found for name ${badgeName}`);
    }

    const openBadgeLevel = await this.prisma.openBadgeLevel.findUnique({
      where: {
        openBadgeId_level: {
          openBadgeId: badge.id,
          level
        }
      },
      select: { id: true }
    });

    if (!openBadgeLevel) {
      throw new Error(`Open badge level not found for ${badgeName} (${level})`);
    }

    await this.prisma.$transaction(async (tx) => {
      const progress = await tx.openBadgeProgress.upsert({
        where: {
          userId_openBadgeId: {
            userId: user.id,
            openBadgeId: badge.id
          }
        },
        create: {
          userId: user.id,
          openBadgeId: badge.id
        },
        update: {}
      });

      await tx.openBadgeLevelProgress.upsert({
        where: {
          progressId_openBadgeLevelId: {
            progressId: progress.id,
            openBadgeLevelId: openBadgeLevel.id
          }
        },
        create: {
          progressId: progress.id,
          openBadgeLevelId: openBadgeLevel.id,
          awardedById: user.id
        },
        update: {}
      });

      await tx.openBadgeProgress.update({
        where: { id: progress.id },
        data: { highestLevelId: openBadgeLevel.id }
      });
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
