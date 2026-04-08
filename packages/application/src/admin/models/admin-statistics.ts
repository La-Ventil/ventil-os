import type { UserRole } from '@repo/domain/user/user-role';
import type { AvatarSelection } from '@repo/avatar-system';

export type AdminStatisticsOverviewViewModel = {
  usersCount: number;
  usersByRole: Record<UserRole, number>;
  eventsOrganizedCount: number;
  eventParticipantsCount: number;
  openBadgesCreatedCount: number;
  openBadgesDeliveredCount: number;
  machinesCreatedCount: number;
  machineUsagesCount: number;
};

export type AdminStatisticsNetworkNodeViewModel = {
  userId: string;
  fullName: string;
  avatar: AvatarSelection | null;
  avatarUrl: string | null;
  role: UserRole;
  blocked: boolean;
  productionIndex: number;
  machinesUsedCount: number;
  repairedObjectsCount: number;
  exchangeCount: number;
  inactive: boolean;
};

export type AdminStatisticsNetworkEdgeViewModel = {
  sourceUserId: string;
  targetUserId: string;
  exchanges: number;
  eventExchanges: number;
  openBadgeExchanges: number;
  widthPx: number;
};

export type AdminStatisticsViewModel = {
  overview: AdminStatisticsOverviewViewModel;
  network: {
    generatedAt: string;
    nodes: AdminStatisticsNetworkNodeViewModel[];
    edges: AdminStatisticsNetworkEdgeViewModel[];
  };
};
