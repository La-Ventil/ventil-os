import type { PrismaClient } from '@prisma/client';
import type { OpenBadgeViewModel } from '@repo/domain/view-models/open-badge';
import { mapOpenBadgeToViewModel, type OpenBadgeSchema } from './mappers/open-badge';

export class OpenBadgeRepository {
  constructor(private prisma: PrismaClient) {}

  async listOpenBadges(): Promise<OpenBadgeViewModel[]> {
    const badges = await this.prisma.openBadge.findMany({
      include: {
        levels: {
          select: { level: true, title: true, description: true },
          orderBy: { level: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    return badges.map((badge) => mapOpenBadgeToViewModel(badge as OpenBadgeSchema));
  }

  async getOpenBadgeById(id: string): Promise<OpenBadgeViewModel | null> {
    const badge = await this.prisma.openBadge.findUnique({
      where: { id },
      include: {
        levels: {
          select: { level: true, title: true, description: true },
          orderBy: { level: 'asc' }
        }
      }
    });

    return badge ? mapOpenBadgeToViewModel(badge as OpenBadgeSchema) : null;
  }

  async listOpenBadgesForUser(userId: string): Promise<OpenBadgeViewModel[]> {
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

    return progresses.map((progress) => ({
      ...mapOpenBadgeToViewModel(progress.openBadge as OpenBadgeSchema),
      activeLevel: progress.highestLevel?.level ?? 0
    }));
  }
}
