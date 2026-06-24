import { RegistrationStatus, type Prisma, type PrismaClient } from '@prisma/client';
import { parseEducationLevel } from '@repo/domain/user/education-level';
import { Email } from '@repo/domain/user/email';
import { deriveUserRole, type UserRole } from '@repo/domain/user/user-role';
import { userProfileSelect } from '../selects/user-profile';
import { userCredentialsSelect } from '../selects/user-credentials';
import { userAdminSelect } from '../selects/user-admin';
import { userPasswordResetSelect } from '../selects/user-password-reset';
import { userSummarySelect } from '../selects/user-summary';
import type { UserCredentialsPayload } from '../selects/user-credentials';
import type { UserAdminPayload } from '../selects/user-admin';
import type { UserPasswordResetPayload } from '../selects/user-password-reset';
import type { UserProfilePayload } from '../selects/user-profile';
import type { UserSummaryPayload } from '../selects/user-summary';
import type { UserCredentialsReadModel } from '../read-models/user-credentials';
import type { UserAdminReadModel } from '../read-models/user-admin';
import type { UserPasswordResetReadModel } from '../read-models/user-password-reset';
import type { UserProfileReadModel } from '../read-models/user-profile';
import type { UserSummaryReadModel, UserSummaryWithOpenBadgeLevelReadModel } from '../read-models/user-summary';
import type { AdminStatisticsReadModel } from '../read-models/admin-statistics';

type ExchangeEdgeAccumulator = {
  sourceUserId: string;
  targetUserId: string;
  eventExchanges: number;
  openBadgeExchanges: number;
  exchanges: number;
};

type ExchangeEdgeRow = { sourceUserId: string; targetUserId: string; count: number };

const MAX_EDGE_WIDTH_PX = 12;
const MACHINE_RESERVATION_STATUS_CONFIRMED = 'confirmed' as const;

const createRoleCountMap = (): Record<UserRole, number> => ({
  member: 0,
  alumni: 0,
  teacher: 0,
  contributor: 0,
  visitor: 0
});

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeUserProfile(user: UserProfilePayload): UserProfileReadModel {
    const { email, pendingEmail, educationLevel, profile, studentProfile, externalProfile, lastName, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email),
      pendingEmail: pendingEmail ? Email.from(pendingEmail) : null,
      educationLevel: parseEducationLevel(educationLevel),
      lastName
    };
  }

  private normalizeUserCredentials(user: UserCredentialsPayload): UserCredentialsReadModel {
    const { email, educationLevel, profile, studentProfile, externalProfile, lastName, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email),
      educationLevel: parseEducationLevel(educationLevel),
      lastName
    };
  }

  private normalizeUserAdmin(user: UserAdminPayload): UserAdminReadModel {
    const { email, profile, studentProfile, externalProfile, lastName, ...rest } = user;

    return {
      ...rest,
      profile: deriveUserRole({ profile, studentProfile, externalProfile }),
      email: Email.from(email),
      lastName,
      stats: {
        eventsCount: user._count.eventRegistrations,
        openBadgesCount: user._count.openBadgeProgresses,
        openBadgesAssignedCount: user._count.openBadgeLevelAwards,
        machinesCount: 0
      }
    };
  }

  private normalizeUserSummary(user: UserSummaryPayload): UserSummaryReadModel {
    const { email, lastName, ...rest } = user;

    return {
      ...rest,
      email: Email.from(email),
      lastName
    };
  }

  private normalizeUserPasswordReset(user: UserPasswordResetPayload): UserPasswordResetReadModel {
    const { email, lastName, ...rest } = user;

    return {
      ...rest,
      email: Email.from(email),
      lastName
    };
  }

  async getUserProfileByEmail(email: string): Promise<UserProfileReadModel | null> {
    const maybeUser = await this.prisma.user.findFirst({
      where: { email },
      select: userProfileSelect
    });

    return maybeUser ? this.normalizeUserProfile(maybeUser as UserProfilePayload) : null;
  }

  async getUserProfileById(userId: string): Promise<UserProfileReadModel | null> {
    const maybeUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userProfileSelect
    });

    return maybeUser ? this.normalizeUserProfile(maybeUser as UserProfilePayload) : null;
  }

  async getUserProfileByEmailOrPending(email: string): Promise<UserProfileReadModel | null> {
    const maybeUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { pendingEmail: email }]
      },
      select: userProfileSelect
    });

    return maybeUser ? this.normalizeUserProfile(maybeUser as UserProfilePayload) : null;
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { blocked: true }
    });

    if (!user) {
      return true;
    }

    return user.blocked;
  }

  async findUserCredentialsByEmail(email: string): Promise<UserCredentialsReadModel | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: userCredentialsSelect
    });

    return user ? this.normalizeUserCredentials(user as UserCredentialsPayload) : null;
  }

  async listUsersForManagement(): Promise<UserAdminReadModel[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: userAdminSelect
    });

    return users.map((user) => this.normalizeUserAdmin(user as UserAdminPayload));
  }

  async listUsersEligibleForOpenBadgeAssignment(
    openBadgeId: string
  ): Promise<UserSummaryWithOpenBadgeLevelReadModel[]> {
    const users = await this.prisma.user.findMany({
      where: {
        blocked: false
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        ...userSummarySelect,
        openBadgeProgresses: {
          where: { openBadgeId },
          take: 1,
          select: {
            highestLevel: {
              select: { level: true }
            }
          }
        }
      }
    });

    return users.map((user) => {
      const { openBadgeProgresses, ...summary } = user;
      return {
        ...this.normalizeUserSummary(summary as UserSummaryPayload),
        currentOpenBadgeLevel: openBadgeProgresses[0]?.highestLevel?.level ?? null
      };
    });
  }

  async listUserSummaries(): Promise<UserSummaryReadModel[]> {
    const users = await this.prisma.user.findMany({
      where: {
        blocked: false
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: userSummarySelect
    });

    return users.map((user) => this.normalizeUserSummary(user as UserSummaryPayload));
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true
      }
    });
  }

  async updateUserProfile(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true }
    });
  }

  async countGlobalAdmins(): Promise<number> {
    return this.prisma.user.count({
      where: { globalAdmin: true }
    });
  }

  async updateUserAvatar(userId: string, avatar: Prisma.UserUpdateInput['avatar']) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: { id: true }
    });
  }

  async setUserBlocked(userId: string, blocked: boolean): Promise<{ id: string; blocked: boolean }> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { blocked },
      select: { id: true, blocked: true }
    });
  }

  async updateUserEmail(userId: string, email: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        email,
        emailVerified: null
      },
      select: { id: true, email: true }
    });
  }

  async isEmailAvailableForUser(userId: string, email: string): Promise<boolean> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { pendingEmail: email }]
      },
      select: { id: true }
    });

    if (!existing) {
      return true;
    }

    return existing.id === userId;
  }

  async updatePendingEmail(userId: string, pendingEmail: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { pendingEmail }
    });
  }

  async confirmUserEmail(
    userId: string,
    data: { email: string; pendingEmail: string | null; emailVerifiedAt: Date }
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        pendingEmail: data.pendingEmail,
        emailVerified: data.emailVerifiedAt
      }
    });
  }

  async findUserForPasswordReset(email: string): Promise<UserPasswordResetReadModel | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: userPasswordResetSelect
    });

    return user ? this.normalizeUserPasswordReset(user as UserPasswordResetPayload) : null;
  }

  async getUserStats(
    userId: string,
    now: Date
  ): Promise<{
    eventsCount: number;
    openBadgesCount: number;
    openBadgesAssignedCount: number;
    machinesCount: number;
  }> {
    const [eventsCount, openBadgesCount, openBadgesAssignedCount, machinesCount] = await Promise.all([
      this.prisma.eventRegistration.count({
        where: { userId }
      }),
      this.prisma.openBadgeProgress.count({
        where: { userId }
      }),
      this.prisma.openBadgeLevelProgress.count({
        where: { awardedById: userId }
      }),
      this.prisma.machineReservation.count({
        where: {
          status: 'confirmed',
          endsAt: {
            lt: now
          },
          OR: [
            { creatorId: userId },
            {
              participants: {
                some: {
                  userId
                }
              }
            }
          ]
        }
      })
    ]);

    return { eventsCount, openBadgesCount, openBadgesAssignedCount, machinesCount };
  }

  async getAdminStatistics(now: Date): Promise<AdminStatisticsReadModel> {
    const activeEventRegistrationStatuses = [RegistrationStatus.registered, RegistrationStatus.attended];

    const [
      users,
      eventsOrganizedCount,
      eventParticipantsCount,
      openBadgesCreatedCount,
      openBadgesDeliveredCount,
      machinesCreatedCount,
      machineUsagesCount,
      machineCreatorUsageRows,
      machineParticipantUsageRows,
      eventEdgeRows,
      openBadgeEdgeRows
    ] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
          avatar: true,
          profile: true,
          studentProfile: true,
          externalProfile: true,
          blocked: true
        }
      }),
      this.prisma.event.count(),
      this.prisma.eventRegistration.count({
        where: {
          status: {
            in: activeEventRegistrationStatuses
          }
        }
      }),
      this.prisma.openBadge.count(),
      this.prisma.openBadgeLevelProgress.count(),
      this.prisma.machine.count(),
      this.prisma.machineReservation.count({
        where: {
          status: MACHINE_RESERVATION_STATUS_CONFIRMED,
          endsAt: { lt: now }
        }
      }),
      this.prisma.machineReservation.groupBy({
        by: ['creatorId'],
        where: {
          status: MACHINE_RESERVATION_STATUS_CONFIRMED,
          endsAt: { lt: now }
        },
        _count: {
          _all: true
        }
      }),
      this.prisma.machineReservationParticipant.groupBy({
        by: ['userId'],
        where: {
          reservation: {
            status: MACHINE_RESERVATION_STATUS_CONFIRMED,
            endsAt: { lt: now }
          }
        },
        _count: {
          _all: true
        }
      }),
      this.prisma.$queryRaw<ExchangeEdgeRow[]>`
        SELECT
          LEAST(er."userId", e."creatorId")    AS "sourceUserId",
          GREATEST(er."userId", e."creatorId") AS "targetUserId",
          COUNT(*)::int                        AS count
        FROM "EventRegistration" er
        JOIN "Event" e ON e.id = er."eventId"
        WHERE er.status IN ('registered', 'attended')
          AND er."userId" != e."creatorId"
        GROUP BY 1, 2
      `,
      this.prisma.$queryRaw<ExchangeEdgeRow[]>`
        SELECT
          LEAST(olp."awardedById", op."userId")    AS "sourceUserId",
          GREATEST(olp."awardedById", op."userId") AS "targetUserId",
          COUNT(*)::int                            AS count
        FROM "OpenBadgeLevelProgress" olp
        JOIN "OpenBadgeProgress" op ON op.id = olp."progressId"
        WHERE olp."awardedById" != op."userId"
        GROUP BY 1, 2
      `
    ]);

    const machineUsagesByUser = new Map<string, number>();
    for (const row of machineCreatorUsageRows) {
      machineUsagesByUser.set(row.creatorId, row._count._all);
    }
    for (const row of machineParticipantUsageRows) {
      const currentCount = machineUsagesByUser.get(row.userId) ?? 0;
      machineUsagesByUser.set(row.userId, currentCount + row._count._all);
    }

    const edgeMap = new Map<string, ExchangeEdgeAccumulator>();

    for (const row of eventEdgeRows) {
      edgeMap.set(`${row.sourceUserId}:${row.targetUserId}`, {
        sourceUserId: row.sourceUserId,
        targetUserId: row.targetUserId,
        eventExchanges: row.count,
        openBadgeExchanges: 0,
        exchanges: row.count
      });
    }

    for (const row of openBadgeEdgeRows) {
      const key = `${row.sourceUserId}:${row.targetUserId}`;
      const existing = edgeMap.get(key);
      if (existing) {
        existing.openBadgeExchanges = row.count;
        existing.exchanges += row.count;
      } else {
        edgeMap.set(key, {
          sourceUserId: row.sourceUserId,
          targetUserId: row.targetUserId,
          eventExchanges: 0,
          openBadgeExchanges: row.count,
          exchanges: row.count
        });
      }
    }

    const exchangesByUser = new Map<string, number>();
    const edges = Array.from(edgeMap.values())
      .map((edge) => {
        exchangesByUser.set(edge.sourceUserId, (exchangesByUser.get(edge.sourceUserId) ?? 0) + edge.exchanges);
        exchangesByUser.set(edge.targetUserId, (exchangesByUser.get(edge.targetUserId) ?? 0) + edge.exchanges);
        return {
          ...edge,
          widthPx: Math.min(MAX_EDGE_WIDTH_PX, Math.max(1, edge.exchanges))
        };
      })
      .sort((left, right) => right.exchanges - left.exchanges);

    const usersByRole = createRoleCountMap();
    const nodes = users
      .map((user) => {
        const role = deriveUserRole({
          profile: user.profile,
          studentProfile: user.studentProfile,
          externalProfile: user.externalProfile
        });
        usersByRole[role] += 1;

        const machinesUsedCount = machineUsagesByUser.get(user.id) ?? 0;
        const repairedObjectsCount = 0;
        const productionIndex = machinesUsedCount + repairedObjectsCount;
        const exchangeCount = exchangesByUser.get(user.id) ?? 0;

        return {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          avatarUrl: user.image,
          role,
          blocked: user.blocked,
          productionIndex,
          machinesUsedCount,
          repairedObjectsCount,
          exchangeCount,
          inactive: productionIndex === 0 && exchangeCount === 0
        };
      })
      .sort((left, right) => {
        if (left.inactive !== right.inactive) {
          return left.inactive ? 1 : -1;
        }
        return right.exchangeCount - left.exchangeCount;
      });

    return {
      overview: {
        usersCount: users.length,
        usersByRole,
        eventsOrganizedCount,
        eventParticipantsCount,
        openBadgesCreatedCount,
        openBadgesDeliveredCount,
        machinesCreatedCount,
        machineUsagesCount
      },
      network: {
        generatedAt: now,
        nodes,
        edges
      }
    };
  }

  async setResetToken(userId: string, resetToken: string, resetTokenExpiry: Date) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken,
        resetTokenExpiry
      },
      select: { id: true }
    });
  }

  async findUserByValidResetToken(resetToken: string) {
    return this.prisma.user.findFirst({
      where: {
        resetToken: { equals: resetToken },
        resetTokenExpiry: { gte: new Date() }
      },
      select: {
        id: true,
        email: true
      }
    });
  }

  async updateUserPassword(
    userId: string,
    data: {
      password: string;
      salt: string;
      iterations: number;
    }
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
        password: data.password,
        salt: data.salt,
        iterations: data.iterations
      },
      select: { id: true, email: true }
    });
  }

  async exists(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
  }

  async getDeleteDependencies(userId: string): Promise<{
    id: string;
    createdMachines: number;
    createdOpenBadges: number;
    createdEvents: number;
    createdEventTemplates: number;
    createdMachineReservations: number;
    openBadgeLevelAwards: number;
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        _count: {
          select: {
            createdMachines: true,
            createdOpenBadges: true,
            createdEvents: true,
            createdEventTemplates: true,
            createdMachineReservations: true,
            openBadgeLevelAwards: true
          }
        }
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      createdMachines: user._count.createdMachines,
      createdOpenBadges: user._count.createdOpenBadges,
      createdEvents: user._count.createdEvents,
      createdEventTemplates: user._count.createdEventTemplates,
      createdMachineReservations: user._count.createdMachineReservations,
      openBadgeLevelAwards: user._count.openBadgeLevelAwards
    };
  }

  async deleteUser(userId: string): Promise<{ id: string }> {
    return this.prisma.$transaction(async (tx) => {
      await tx.userConsent.deleteMany({
        where: { userId }
      });

      return tx.user.delete({
        where: { id: userId },
        select: { id: true }
      });
    });
  }
}
