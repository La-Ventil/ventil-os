import { describe, expect, it } from 'vitest';
import { ActivityStatus } from '../activity-status';
import { canAssignOpenBadge } from '../badge/open-badge-assignment-policy';

describe('open-badge assignment policy', () => {
  it('disallows assignment when badge is inactive', () => {
    expect(
      canAssignOpenBadge({
        userId: 'user-id',
        admin: null,
        trainerThreshold: 1,
        highestLevel: 1,
        badgeStatus: ActivityStatus.Inactive
      })
    ).toBe(false);

    expect(
      canAssignOpenBadge({
        userId: undefined,
        admin: { globalAdmin: true },
        trainerThreshold: null,
        highestLevel: null,
        badgeStatus: ActivityStatus.Inactive
      })
    ).toBe(false);
  });

  it('allows assignment for active badges according to existing constraints', () => {
    expect(
      canAssignOpenBadge({
        userId: 'user-id',
        admin: null,
        trainerThreshold: 1,
        highestLevel: 1,
        badgeStatus: ActivityStatus.Active
      })
    ).toBe(true);

    expect(
      canAssignOpenBadge({
        userId: undefined,
        admin: { globalAdmin: true },
        trainerThreshold: null,
        highestLevel: null,
        badgeStatus: ActivityStatus.Active
      })
    ).toBe(true);
  });
});
