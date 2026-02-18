import type { PrismaClient, ActivityStatus as PrismaActivityStatus } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';
import type {
  OpenBadgeAdminSchemaRaw,
  OpenBadgeProgressSchemaRaw,
  OpenBadgeSchemaRaw
} from '../schemas/open-badge';
import {
  includeOpenBadgeProgressSchemaRaw,
  includeOpenBadgeSchemaRaw,
  selectOpenBadgeAdminSchemaRaw
} from '../schemas/open-badge';

export class OpenBadgeRepository {
  constructor(private prisma: PrismaClient) {}

  async listOpenBadges(): Promise<OpenBadgeSchemaRaw[]> {
    const badges = await this.prisma.openBadge.findMany({
      include: includeOpenBadgeSchemaRaw,
      orderBy: { name: 'asc' }
    });

    return badges as OpenBadgeSchemaRaw[];
  }

  async getOpenBadgeById(id: string): Promise<OpenBadgeSchemaRaw | null> {
    const badge = await this.prisma.openBadge.findUnique({
      where: { id },
      include: includeOpenBadgeSchemaRaw
    });

    return (badge as OpenBadgeSchemaRaw) ?? null;
  }

  async getTrainerThresholdLevel(openBadgeId: string): Promise<number | null> {
    const badge = await this.prisma.openBadge.findUnique({
      where: { id: openBadgeId },
      select: {
        trainerThresholdLevel: {
          select: { level: true }
        }
      }
    });

    return badge?.trainerThresholdLevel?.level ?? null;
  }

  async getUserHighestOpenBadgeLevel(userId: string, openBadgeId: string): Promise<number | null> {
    const progress = await this.prisma.openBadgeProgress.findUnique({
      where: {
        userId_openBadgeId: {
          userId,
          openBadgeId
        }
      },
      select: {
        highestLevel: {
          select: { level: true }
        }
      }
    });

    return progress?.highestLevel?.level ?? null;
  }

  async getUserHighestOpenBadgeLevels(
    userId: string,
    openBadgeIds: string[]
  ): Promise<Map<string, number | null>> {
    if (!openBadgeIds.length) {
      return new Map();
    }

    const progresses = await this.prisma.openBadgeProgress.findMany({
      where: {
        userId,
        openBadgeId: {
          in: openBadgeIds
        }
      },
      select: {
        openBadgeId: true,
        highestLevel: {
          select: { level: true }
        }
      }
    });

    const levels = new Map<string, number | null>(openBadgeIds.map((openBadgeId) => [openBadgeId, null]));
    progresses.forEach((progress) => {
      levels.set(progress.openBadgeId, progress.highestLevel?.level ?? null);
    });

    return levels;
  }

  async listOpenBadgesForAdmin(): Promise<OpenBadgeAdminSchemaRaw[]> {
    const badges = await this.prisma.openBadge.findMany({
      select: selectOpenBadgeAdminSchemaRaw,
      orderBy: { name: 'asc' }
    });

    return badges as OpenBadgeAdminSchemaRaw[];
  }

  async listOpenBadgesForUser(userId: string): Promise<OpenBadgeProgressSchemaRaw[]> {
    const progresses = await this.prisma.openBadgeProgress.findMany({
      where: { userId },
      include: includeOpenBadgeProgressSchemaRaw,
      orderBy: { openBadge: { name: 'asc' } }
    });

    return progresses as OpenBadgeProgressSchemaRaw[];
  }

  async awardOpenBadgeLevel(input: { userId: string; openBadgeId: string; level: number; awardedById: string }) {
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

      if (!currentHighest?.highestLevel || openBadgeLevel.level >= currentHighest.highestLevel.level) {
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
  }): Promise<OpenBadgeSchemaRaw> {
    const badge = await this.prisma.openBadge.create({
      data: {
        name: input.name,
        type: input.type,
        category: input.category,
        description: input.description ?? null,
        coverImage: input.coverImage ?? null,
        status: input.status as PrismaActivityStatus,
        creatorId: input.creatorId,
        levels: {
          create: input.levels.map((level, idx) => ({
            level: idx + 1,
            title: level.title,
            description: level.description ?? null
          }))
        }
      },
      include: includeOpenBadgeSchemaRaw
    });

    return badge as OpenBadgeSchemaRaw;
  }

  async updateOpenBadge(input: {
    id: string;
    name: string;
    description?: string | null;
    coverImage?: string | null;
    status: ActivityStatus;
    levels: Array<{ title: string; description: string }>;
  }): Promise<OpenBadgeSchemaRaw> {
    const badge = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.openBadge.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description ?? null,
          coverImage: input.coverImage ?? null,
          status: input.status as PrismaActivityStatus
        }
      });

      await Promise.all(
        input.levels.map((level, idx) =>
          tx.openBadgeLevel.upsert({
            where: {
              openBadgeId_level: {
                openBadgeId: input.id,
                level: idx + 1
              }
            },
            update: {
              title: level.title,
              description: level.description ?? null
            },
            create: {
              openBadgeId: input.id,
              level: idx + 1,
              title: level.title,
              description: level.description ?? null
            }
          })
        )
      );

      return updated;
    });

    const full = await this.prisma.openBadge.findUnique({
      where: { id: badge.id },
      include: includeOpenBadgeSchemaRaw
    });

    return full as OpenBadgeSchemaRaw;
  }

  async deleteOpenBadge(id: string): Promise<{ id: string }> {
    return this.prisma.openBadge.delete({
      where: { id },
      select: { id: true }
    });
  }
}
