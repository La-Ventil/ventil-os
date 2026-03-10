import type { UserRole } from '@repo/domain/user/user-role';

export type AdminStatisticsOverviewReadModel = {
  usersCount: number;
  usersByRole: Record<UserRole, number>;
  eventsOrganizedCount: number;
  eventParticipantsCount: number;
  openBadgesCreatedCount: number;
  openBadgesDeliveredCount: number;
  machinesCreatedCount: number;
  machineUsagesCount: number;
};

export type AdminStatisticsNetworkNodeReadModel = {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
  blocked: boolean;
  productionIndex: number;
  machinesUsedCount: number;
  repairedObjectsCount: number;
  exchangeCount: number;
  inactive: boolean;
};

export type AdminStatisticsNetworkEdgeReadModel = {
  sourceUserId: string;
  targetUserId: string;
  exchanges: number;
  eventExchanges: number;
  openBadgeExchanges: number;
  widthPx: number;
};

export type AdminStatisticsReadModel = {
  overview: AdminStatisticsOverviewReadModel;
  network: {
    generatedAt: Date;
    nodes: AdminStatisticsNetworkNodeReadModel[];
    edges: AdminStatisticsNetworkEdgeReadModel[];
  };
};
