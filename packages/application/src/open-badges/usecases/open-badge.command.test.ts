import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { setOpenBadgeStatus } from './set-open-badge-status.command';
import { assignOpenBadge } from './assign-open-badge.command';
import { setUserOpenBadgeLevel } from './set-user-open-badge-level.command';

const mockOpenBadgeHighest = vi.fn();
const mockAwardOpenBadgeLevel = vi.fn();
const mockSetOpenBadgeLevel = vi.fn();
const mockGetOpenBadgeAdminById = vi.fn();
const mockSetOpenBadgeStatus = vi.fn();
const mockTrainerThreshold = vi.fn();
const mockUserRepositoryExists = vi.fn();

vi.mock('@repo/db', () => ({
  openBadgeRepository: {
    getUserHighestOpenBadgeLevel: (...args: [string, string]) => mockOpenBadgeHighest(...args),
    awardOpenBadgeLevel: (...args: [Record<string, unknown>]) => mockAwardOpenBadgeLevel(...args),
    setUserOpenBadgeLevel: (...args: [Record<string, unknown>]) => mockSetOpenBadgeLevel(...args),
    getOpenBadgeAdminById: (...args: [string]) => mockGetOpenBadgeAdminById(...args),
    setOpenBadgeStatus: (...args: [string, string]) => mockSetOpenBadgeStatus(...args),
    getTrainerThresholdLevel: (...args: [string]) => mockTrainerThreshold(...args)
  },
  userRepository: {
    exists: (...args: [string]) => mockUserRepositoryExists(...args)
  }
}));

describe('open-badge command invariants', () => {
  const adminUser = { id: 'admin-id', email: 'admin@ventil.local', globalAdmin: true };
  const user = { id: 'user-id', email: 'user@ventil.local' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOpenBadgeHighest.mockResolvedValue(null);
    mockTrainerThreshold.mockResolvedValue(1);
    mockAwardOpenBadgeLevel.mockResolvedValue(null);
    mockSetOpenBadgeLevel.mockResolvedValue(null);
    mockSetOpenBadgeStatus.mockResolvedValue({ id: 'badge-id', status: 'inactive' });
    mockGetOpenBadgeAdminById.mockResolvedValue({ _count: { machines: 0 } });
    mockUserRepositoryExists.mockImplementation(() => true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('prevents assigning a badge level unless it is the next level', async () => {
    mockOpenBadgeHighest.mockResolvedValue(1);

    await expect(assignOpenBadge({ userId: user.id, openBadgeId: 'badge-id', level: 3 }, adminUser)).rejects.toEqual(
      expect.objectContaining({ code: 'openBadge.assign.invalidLevelTransition' })
    );
  });

  it('persists the award for a valid next-level transition', async () => {
    mockOpenBadgeHighest.mockResolvedValue(1);

    await assignOpenBadge({ userId: user.id, openBadgeId: 'badge-id', level: 2 }, adminUser);

    expect(mockAwardOpenBadgeLevel).toHaveBeenCalledWith({
      userId: user.id,
      openBadgeId: 'badge-id',
      level: 2,
      awardedById: adminUser.id
    });
  });

  it('prevents downgrading open badge level by more than one step', async () => {
    mockOpenBadgeHighest.mockResolvedValue(3);
    mockUserRepositoryExists.mockImplementation((id: string) => id !== 'missing-awarder');

    await expect(
      setUserOpenBadgeLevel({ userId: user.id, openBadgeId: 'badge-id', level: 1 }, adminUser)
    ).rejects.toEqual(expect.objectContaining({ code: 'openBadge.assign.invalidLevelTransition' }));
  });

  it('persists downgrade for a valid step', async () => {
    mockOpenBadgeHighest.mockResolvedValue(3);
    mockUserRepositoryExists.mockImplementation((id: string) => id !== 'missing-awarder');

    await setUserOpenBadgeLevel({ userId: user.id, openBadgeId: 'badge-id', level: 2 }, adminUser);

    expect(mockSetOpenBadgeLevel).toHaveBeenCalledWith({
      userId: user.id,
      openBadgeId: 'badge-id',
      level: 2,
      awardedById: adminUser.id
    });
  });

  it('prevents deactivating badge when attached to a machine', async () => {
    mockGetOpenBadgeAdminById.mockResolvedValue({ _count: { machines: 2 } });

    await expect(setOpenBadgeStatus({ id: 'badge-id', status: ActivityStatus.Inactive })).rejects.toEqual(
      expect.objectContaining({ code: 'openBadge.status.attachedToMachines' })
    );
  });

  it('persists status updates for valid changes', async () => {
    mockGetOpenBadgeAdminById.mockResolvedValue({ _count: { machines: 0 } });

    await setOpenBadgeStatus({ id: 'badge-id', status: ActivityStatus.Inactive });

    expect(mockSetOpenBadgeStatus).toHaveBeenCalledWith('badge-id', 'inactive');
  });
});
