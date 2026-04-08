import type { UserSummary } from '@repo/domain/user/user-summary';
import type { AvatarSelection } from '@repo/avatar-system';

export type UserSummaryViewModel = UserSummary & {
  avatar: AvatarSelection | null;
  fullName: string;
};

export type UserSummaryWithOpenBadgeLevelViewModel = UserSummaryViewModel & {
  currentOpenBadgeLevel: number | null;
};
