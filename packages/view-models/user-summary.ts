import type { UserSummary } from '@repo/domain/user/user-summary';

export type UserSummaryViewModel = UserSummary & { fullName: string };

export type UserSummaryWithOpenBadgeLevelViewModel = UserSummaryViewModel & {
  currentOpenBadgeLevel: number | null;
};
