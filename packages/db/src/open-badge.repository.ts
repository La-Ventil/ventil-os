import type { PrismaClient, ActivityStatus } from '@prisma/client';
import type {
  OpenBadgeAdminSchema,
  OpenBadgeProgressSchema,
  OpenBadgeSchema
} from './schemas/open-badge';

export class OpenBadgeRepository {
  constructor(private prisma: PrismaClient) {}

  async listOpenBadges(): Promise<OpenBadgeSchema[]> {
    const badges = await this.prisma.openBadge.findMany({
      include: {
        levels: {
          select: { level: true, title: true, description: true },
          orderBy: { level: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    return badges as OpenBadgeSchema[];
  }

  async getOpenBadgeById(id: string): Promise<OpenBadgeSchema | null> {
    const badge = await this.prisma.openBadge.findUnique({
      where: { id },
      include: {
        levels: {
          select: { level: true, title: true, description: true },
          orderBy: { level: 'asc' }
        }
      }
    });

    return badge ? (badge as OpenBadgeSchema) : null;
  }

  async listOpenBadgesForAdmin(): Promise<OpenBadgeAdminSchema[]> {
    const badges = await this.prisma.openBadge.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        _count: {
          select: {
            levels: true,
            openBadgeProgresses: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return badges as OpenBadgeAdminSchema[];
  }

  async listOpenBadgesForUser(userId: string): Promise<OpenBadgeProgressSchema[]> {
    const progresses = await this.prisma.openBadgeProgress.findMany({
      where: { userId },
      include: {
        highestLevel: {
          select: { level: true }
        },
        openBadge: {
          include: {
            levels: {
              select: { level: true, title: true, description: true },
              orderBy: { level: 'asc' }
            }
          }
        }
      },
      orderBy: { openBadge: { name: 'asc' } }
    });

    return progresses as OpenBadgeProgressSchema[];
  }

  async awardOpenBadgeLevel(input: {
    userId: string;
    openBadgeId: string;
    level: number;
    awardedById: string;
  }) {
    const openBadgeLevel = await this.prisma.openBadgeLevel.findUnique({
      where: {
        openBadgeId_level: {
          openBadgeId: input.openBadgeId,
          level: input.level
        }
      },
      select: { id: true, level: true }
    });

    if (!openBadgeLevel) {
      throw new Error('Open badge level not found.');
    }

    return this.prisma.$transaction(async (tx) => {
      const progress = await tx.openBadgeProgress.upsert({
        where: {
          userId_openBadgeId: {
            userId: input.userId,
            openBadgeId: input.openBadgeId
          }
        },
        create: {
          userId: input.userId,
          openBadgeId: input.openBadgeId
        },
        update: {}
      });

      const existingLevel = await tx.openBadgeLevelProgress.findUnique({
        where: {
          progressId_openBadgeLevelId: {
            progressId: progress.id,
            openBadgeLevelId: openBadgeLevel.id
          }
        },
        select: { id: true }
      });

      if (!existingLevel) {
        await tx.openBadgeLevelProgress.create({
          data: {
            progressId: progress.id,
            openBadgeLevelId: openBadgeLevel.id,
            awardedById: input.awardedById
          }
        });
      }

      const currentHighest = await tx.openBadgeProgress.findUnique({
        where: { id: progress.id },
        select: {
          highestLevel: {
            select: { id: true, level: true }
          }
        }
      });

      if (
        !currentHighest?.highestLevel ||
        openBadgeLevel.level >= currentHighest.highestLevel.level
      ) {
        await tx.openBadgeProgress.update({
          where: { id: progress.id },
          data: { highestLevelId: openBadgeLevel.id }
        });
      }

      return progress;
    });
  }

  async createOpenBadge(input: {
    name: string;
    type: string;
    category: string;
    description?: string | null;
    coverImage?: string | null;
    status: ActivityStatus;
    creatorId: string;
    levels: Array<{ title: string; description: string }>;
  }): Promise<OpenBadgeSchema> {
    const badge = await this.prisma.openBadge.create({
      data: {
        name: input.name,
        type: input.type,
        category: input.category,
        description: input.description ?? null,
        coverImage: input.coverImage ?? null,
        status: input.status,
        creatorId: input.creatorId,
        levels: {
          create: input.levels.map((level, idx) => ({
            level: idx + 1,
            title: level.title,
            description: level.description ?? null
          }))
        }
      },
      include: {
        levels: {
          select: { level: true, title: true, description: true },
          orderBy: { level: 'asc' }
        }
      }
    });

    return badge as OpenBadgeSchema;
  }
}
