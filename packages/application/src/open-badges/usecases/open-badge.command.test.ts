import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import { setOpenBadgeStatus } from './set-open-badge-status.command';
import { assignOpenBadge } from './assign-open-badge.command';
import { setUserOpenBadgeLevel } from './set-user-open-badge-level.command';
import { updateOpenBadge } from './update-open-badge.command';

const mockOpenBadgeHighest = vi.fn();
const mockAwardOpenBadgeLevel = vi.fn();
const mockSetOpenBadgeLevel = vi.fn();
const mockGetOpenBadgeAdminById = vi.fn();
const mockGetOpenBadgeAssignmentContext = vi.fn();
const mockSetOpenBadgeStatus = vi.fn();
const mockGetOpenBadgeAssignmentPolicyContext = vi.fn();
const mockUserRepositoryExists = vi.fn();
const mockGetOpenBadgeById = vi.fn();
const mockUpdateOpenBadge = vi.fn();

vi.mock('@repo/db', () => ({
  openBadgeRepository: {
    getUserHighestOpenBadgeLevel: (...args: [string, string]) => mockOpenBadgeHighest(...args),
    awardOpenBadgeLevel: (...args: [Record<string, unknown>]) => mockAwardOpenBadgeLevel(...args),
    setUserOpenBadgeLevel: (...args: [Record<string, unknown>]) => mockSetOpenBadgeLevel(...args),
    getOpenBadgeAdminById: (...args: [string]) => mockGetOpenBadgeAdminById(...args),
    setOpenBadgeStatus: (...args: [string, string]) => mockSetOpenBadgeStatus(...args),
    getOpenBadgeById: (...args: [string]) => mockGetOpenBadgeById(...args),
    updateOpenBadge: (...args: [Record<string, unknown>]) => mockUpdateOpenBadge(...args),
    getOpenBadgeAssignmentContext: (...args: [string, string | undefined]) =>
      mockGetOpenBadgeAssignmentContext(...args),
    getOpenBadgeAssignmentPolicyContext: (...args: [string, string | undefined]) =>
      mockGetOpenBadgeAssignmentPolicyContext(...args)
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
    mockAwardOpenBadgeLevel.mockResolvedValue(null);
    mockSetOpenBadgeLevel.mockResolvedValue(null);
    mockSetOpenBadgeStatus.mockResolvedValue({ id: 'badge-id', status: 'inactive' });
    mockGetOpenBadgeAdminById.mockResolvedValue({ status: ActivityStatus.Active, _count: { machines: 0 } });
    mockGetOpenBadgeById.mockResolvedValue({
      id: 'badge-id',
      coverImage: '/badge.png'
    });
    mockUpdateOpenBadge.mockResolvedValue({ id: 'badge-id' });
    mockGetOpenBadgeAssignmentContext.mockResolvedValue({
      badge: { id: 'badge-id', status: ActivityStatus.Active, levels: [] },
      trainerThreshold: 1,
      highestLevel: 1
    });
    mockGetOpenBadgeAssignmentPolicyContext.mockResolvedValue({
      status: ActivityStatus.Active,
      trainerThreshold: 1,
      highestLevel: 1
    });
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

  it('prevents assigning on an inactive badge', async () => {
    mockGetOpenBadgeAssignmentContext.mockResolvedValue({
      badge: { id: 'badge-id', status: ActivityStatus.Inactive, levels: [] },
      trainerThreshold: null,
      highestLevel: null
    });
    mockGetOpenBadgeAssignmentPolicyContext.mockResolvedValue({
      status: ActivityStatus.Inactive,
      trainerThreshold: null,
      highestLevel: null
    });
    mockOpenBadgeHighest.mockResolvedValue(1);

    await expect(assignOpenBadge({ userId: user.id, openBadgeId: 'badge-id', level: 2 }, adminUser)).rejects.toEqual(
      expect.objectContaining({ code: 'openBadge.assign.unauthorized' })
    );
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

  it('persists open badge updates and trims removed trailing levels', async () => {
    await updateOpenBadge({
      id: 'badge-id',
      name: 'Badge mis a jour',
      description: 'Description',
      levels: [{ title: 'Niveau 1', description: 'Description 1' }],
      activationEnabled: true
    });

    expect(mockUpdateOpenBadge).toHaveBeenCalledWith({
      id: 'badge-id',
      name: 'Badge mis a jour',
      description: 'Description',
      coverImage: '/badge.png',
      levels: [{ title: 'Niveau 1', description: 'Description 1' }],
      status: ActivityStatus.Active
    });
  });

  it('surfaces an error when trying to delete a level already in use', async () => {
    mockUpdateOpenBadge.mockRejectedValue(new OpenBadgeError('openBadge.update.levelInUse'));

    await expect(
      updateOpenBadge({
        id: 'badge-id',
        name: 'Badge mis a jour',
        description: 'Description',
        levels: [{ title: 'Niveau 1', description: 'Description 1' }],
        activationEnabled: true
      })
    ).rejects.toEqual(expect.objectContaining({ code: 'openBadge.update.levelInUse' }));
  });
});
