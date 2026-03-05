import type { Prisma, PrismaClient, ActivityStatus as PrismaActivityStatus } from '@prisma/client';
import { toActivityStatus, type ActivityStatus } from '@repo/domain/activity-status';
import { OpenBadgeLevel } from '@repo/domain/badge/open-badge-level';
import type {
  OpenBadgeAdminReadModel,
  OpenBadgeProgressReadModel,
  OpenBadgeReadModel
} from '../read-models/open-badge';
import type { OpenBadgeAdminPayload, OpenBadgeProgressPayload, OpenBadgePayload } from '../selects/open-badge';
import { openBadgeProgressInclude, openBadgeInclude, openBadgeAdminSelect } from '../selects/open-badge';

export class OpenBadgeRepository {
  constructor(private prisma: PrismaClient) {}

  private async getOpenBadgeLevelOrThrow(openBadgeId: string, level: number): Promise<{ id: string; level: number }> {
    const openBadgeLevel = await this.prisma.openBadgeLevel.findUnique({
      where: {
        openBadgeId_level: {
          openBadgeId,
          level
        }
      },
      select: { id: true, level: true }
    });

    if (!openBadgeLevel) {
      throw new Error('Open badge level not found.');
    }

    return openBadgeLevel;
  }

  private async replaceUserOpenBadgeProgressAtLevel(
    tx: Prisma.TransactionClient,
    input: {
      userId: string;
      openBadgeId: string;
      openBadgeLevelId: string;
      awardedById: string;
    }
  ) {
    await tx.openBadgeProgress.deleteMany({
      where: {
        userId: input.userId,
        openBadgeId: input.openBadgeId
      }
    });

    return tx.openBadgeProgress.create({
      data: {
        userId: input.userId,
        openBadgeId: input.openBadgeId,
        highestLevelId: input.openBadgeLevelId,
        levelHistory: {
          create: {
            openBadgeLevelId: input.openBadgeLevelId,
            awardedById: input.awardedById
          }
        }
      }
    });
  }

  private normalizeOpenBadge(badge: OpenBadgePayload): OpenBadgeReadModel {
    return {
      ...badge,
      status: toActivityStatus(badge.status),
      levels: badge.levels.map((level) => OpenBadgeLevel.fromObject(level))
    };
  }

  private normalizeOpenBadgeAdmin(badge: OpenBadgeAdminPayload): OpenBadgeAdminReadModel {
    return {
      ...badge,
      status: toActivityStatus(badge.status)
    };
  }

  private normalizeOpenBadgeProgress(progress: OpenBadgeProgressPayload): OpenBadgeProgressReadModel {
    return {
      ...progress,
      openBadge: this.normalizeOpenBadge(progress.openBadge)
    };
  }

  async listOpenBadges(): Promise<OpenBadgeReadModel[]> {
    const badges = await this.prisma.openBadge.findMany({
      include: openBadgeInclude,
      orderBy: { name: 'asc' }
    });

    return (badges as OpenBadgePayload[]).map((badge) => this.normalizeOpenBadge(badge));
  }

  async getOpenBadgeById(id: string): Promise<OpenBadgeReadModel | null> {
    const badge = await this.prisma.openBadge.findUnique({
      where: { id },
      include: openBadgeInclude
    });

    return badge ? this.normalizeOpenBadge(badge as OpenBadgePayload) : null;
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

  async getUserHighestOpenBadgeLevels(userId: string, openBadgeIds: string[]): Promise<Map<string, number | null>> {
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

  async listOpenBadgesForAdmin(): Promise<OpenBadgeAdminReadModel[]> {
    const badges = await this.prisma.openBadge.findMany({
      select: openBadgeAdminSelect,
      orderBy: { name: 'asc' }
    });

    return (badges as OpenBadgeAdminPayload[]).map((badge) => this.normalizeOpenBadgeAdmin(badge));
  }

  async getOpenBadgeAdminById(id: string): Promise<OpenBadgeAdminReadModel | null> {
    const badge = await this.prisma.openBadge.findUnique({
      where: { id },
      select: openBadgeAdminSelect
    });

    return badge ? this.normalizeOpenBadgeAdmin(badge as OpenBadgeAdminPayload) : null;
  }

  async listOpenBadgesForUser(userId: string): Promise<OpenBadgeProgressReadModel[]> {
    const progresses = await this.prisma.openBadgeProgress.findMany({
      where: { userId },
      include: openBadgeProgressInclude,
      orderBy: { openBadge: { name: 'asc' } }
    });

    return (progresses as OpenBadgeProgressPayload[]).map((progress) => this.normalizeOpenBadgeProgress(progress));
  }

  async awardOpenBadgeLevel(input: { userId: string; openBadgeId: string; level: number; awardedById: string }) {
    const openBadgeLevel = await this.getOpenBadgeLevelOrThrow(input.openBadgeId, input.level);

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

      const currentHighest = await tx.openBadgeProgress.findUnique({
        where: { id: progress.id },
        select: {
          highestLevel: {
            select: { id: true, level: true }
          }
        }
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

      if (!currentHighest?.highestLevel || openBadgeLevel.level >= currentHighest.highestLevel.level) {
        await tx.openBadgeProgress.update({
          where: { id: progress.id },
          data: { highestLevelId: openBadgeLevel.id }
        });
      }

      return progress;
    });
  }

  async setUserOpenBadgeLevel(input: { userId: string; openBadgeId: string; level: number; awardedById: string }) {
    const openBadgeLevel = await this.getOpenBadgeLevelOrThrow(input.openBadgeId, input.level);

    return this.prisma.$transaction(async (tx) => {
      return this.replaceUserOpenBadgeProgressAtLevel(tx, {
        userId: input.userId,
        openBadgeId: input.openBadgeId,
        openBadgeLevelId: openBadgeLevel.id,
        awardedById: input.awardedById
      });
    });
  }

  async removeUserOpenBadgeProgress(userId: string, openBadgeId: string): Promise<void> {
    await this.prisma.openBadgeProgress.deleteMany({
      where: {
        userId,
        openBadgeId
      }
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
  }): Promise<OpenBadgeReadModel> {
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
      include: openBadgeInclude
    });

    return this.normalizeOpenBadge(badge as OpenBadgePayload);
  }

  async updateOpenBadge(input: {
    id: string;
    name: string;
    description?: string | null;
    coverImage?: string | null;
    status: ActivityStatus;
    levels: Array<{ title: string; description: string }>;
  }): Promise<OpenBadgeReadModel> {
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
      include: openBadgeInclude
    });

    if (!full) {
      throw new Error('Open badge not found.');
    }

    return this.normalizeOpenBadge(full as OpenBadgePayload);
  }

  async setOpenBadgeStatus(id: string, status: ActivityStatus): Promise<{ id: string; status: ActivityStatus }> {
    const updated = await this.prisma.openBadge.update({
      where: { id },
      data: { status: status as PrismaActivityStatus },
      select: { id: true, status: true }
    });

    return { id: updated.id, status: toActivityStatus(updated.status) };
  }

  async deleteOpenBadge(id: string): Promise<{ id: string }> {
    return this.prisma.openBadge.delete({
      where: { id },
      select: { id: true }
    });
  }
}
