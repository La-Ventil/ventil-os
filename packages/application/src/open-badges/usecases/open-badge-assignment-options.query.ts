import { canAdvanceOpenBadgeLevel } from '@repo/domain/badge/open-badge-level-transition-policy';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import type { Query } from '../../usecase';

export type OpenBadgeAssignableUsersByBadgeIdAndLevel = Record<string, Record<string, string[]>>;

export const filterOpenBadgesAssignableByCurrentLevel: Query<[OpenBadgeViewModel[]], OpenBadgeViewModel[]> = async (
  openBadges: OpenBadgeViewModel[]
) =>
  openBadges
    .map((badge) => ({
      ...badge,
      levels: badge.levels.filter((level) => canAdvanceOpenBadgeLevel(badge.activeLevel, level.level))
    }))
    .filter((badge) => badge.levels.length > 0);

export const buildOpenBadgeAssignableUsersByBadgeIdAndLevel: Query<
  [OpenBadgeViewModel[], UserSummaryWithOpenBadgeLevelViewModel[]],
  OpenBadgeAssignableUsersByBadgeIdAndLevel
> = async (openBadges: OpenBadgeViewModel[], users: UserSummaryWithOpenBadgeLevelViewModel[]) => {
  return Object.fromEntries(
    openBadges.map((badge) => [
      badge.id,
      Object.fromEntries(
        badge.levels.map((level) => {
          const userIds = users
            .filter((user) => canAdvanceOpenBadgeLevel(user.currentOpenBadgeLevel, level.level))
            .map((user) => user.id);
          return [String(level.level), userIds];
        })
      )
    ])
  );
};

export const buildOpenBadgeAssignableUsersForFixedUserByBadgeIdAndLevel: Query<
  [OpenBadgeViewModel[], string],
  OpenBadgeAssignableUsersByBadgeIdAndLevel
> = async (openBadges: OpenBadgeViewModel[], userId: string) => {
  return Object.fromEntries(
    openBadges.map((badge) => [
      badge.id,
      Object.fromEntries(
        badge.levels.map((level) => [
          String(level.level),
          canAdvanceOpenBadgeLevel(badge.activeLevel, level.level) ? [userId] : []
        ])
      )
    ])
  );
};
