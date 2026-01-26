import type { PrismaClient } from '@prisma/client';
import type { OpenBadgeProgressSchema, OpenBadgeSchema } from './schemas/open-badge';

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
}
