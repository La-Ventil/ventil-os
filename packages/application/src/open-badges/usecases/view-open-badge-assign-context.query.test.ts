import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { viewOpenBadgeAssignContext } from './view-open-badge-assign-context.query';

const mockBrowseAssignableUsersForOpenBadge = vi.fn();
const mockBuildMap = vi.fn();
const mockGetOpenBadgeById = vi.fn();
const mockGetTrainerThresholdLevel = vi.fn();
const mockGetUserHighestOpenBadgeLevel = vi.fn();

vi.mock('@repo/db', () => ({
  openBadgeRepository: {
    getOpenBadgeById: (...args: [string]) => mockGetOpenBadgeById(...args),
    getTrainerThresholdLevel: (...args: [string]) => mockGetTrainerThresholdLevel(...args),
    getUserHighestOpenBadgeLevel: (...args: [string, string]) => mockGetUserHighestOpenBadgeLevel(...args)
  }
}));

vi.mock('./browse-assignable-users-for-open-badge.query', () => ({
  browseAssignableUsersForOpenBadge: (...args: [string]) => mockBrowseAssignableUsersForOpenBadge(...args)
}));

vi.mock('./open-badge-assignment-options.query', () => ({
  buildOpenBadgeAssignableUsersByBadgeIdAndLevel: (...args: [unknown[], unknown[]]) => mockBuildMap(...args)
}));

describe('viewOpenBadgeAssignContext', () => {
  const badge = {
    id: 'badge-id',
    name: 'Open Badge',
    activeLevel: 1,
    status: ActivityStatus.Active,
    levels: [{ id: 'level-id', level: 1, title: 'Niveau 1', description: 'Première étape' }],
    type: 'open-badge',
    description: 'desc',
    coverImage: undefined
  };

  const userSummary = {
    id: 'user-id',
    firstName: 'Ada',
    lastName: 'Lovelace',
    username: 'ada',
    image: null,
    email: 'ada@example.com',
    currentOpenBadgeLevel: 0
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetOpenBadgeById.mockResolvedValue(badge);
    mockGetTrainerThresholdLevel.mockResolvedValue(null);
    mockGetUserHighestOpenBadgeLevel.mockResolvedValue(null);
    mockBrowseAssignableUsersForOpenBadge.mockResolvedValue([userSummary]);
    mockBuildMap.mockResolvedValue({
      [badge.id]: {
        '1': ['user-id']
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when badge does not exist', async () => {
    mockGetOpenBadgeById.mockResolvedValue(null);

    const context = await viewOpenBadgeAssignContext('missing-id', null);

    expect(context).toBeNull();
    expect(mockBrowseAssignableUsersForOpenBadge).not.toHaveBeenCalled();
    expect(mockBuildMap).not.toHaveBeenCalled();
  });

  it('returns null for inactive badges', async () => {
    mockGetOpenBadgeById.mockResolvedValue({
      ...badge,
      status: ActivityStatus.Inactive
    });

    const context = await viewOpenBadgeAssignContext('badge-id', {
      id: 'admin-id',
      globalAdmin: true
    });

    expect(context).toBeNull();
    expect(mockBrowseAssignableUsersForOpenBadge).not.toHaveBeenCalled();
    expect(mockBuildMap).not.toHaveBeenCalled();
  });

  it('returns assignment context for active badges', async () => {
    const context = await viewOpenBadgeAssignContext('badge-id', {
      id: 'admin-id',
      globalAdmin: true
    });

    expect(context).toEqual({
      openBadge: expect.objectContaining({
        id: badge.id,
        name: badge.name,
        levels: [
          expect.objectContaining({
            level: 1,
            title: 'Niveau 1',
            description: 'Première étape'
          })
        ],
        activeLevel: 0
      }),
      users: [userSummary],
      userIdsByOpenBadgeIdAndLevel: {
        [badge.id]: {
          '1': ['user-id']
        }
      }
    });
    expect(mockBrowseAssignableUsersForOpenBadge).toHaveBeenCalledWith('badge-id');
    expect(mockBuildMap).toHaveBeenCalledWith([expect.objectContaining({ id: badge.id })], [userSummary]);
    expect(mockGetOpenBadgeById).toHaveBeenCalledTimes(1);
  });

  it('returns null when actor is not authorized to assign this badge', async () => {
    mockGetTrainerThresholdLevel.mockResolvedValue(2);
    mockGetUserHighestOpenBadgeLevel.mockResolvedValue(1);

    const context = await viewOpenBadgeAssignContext('badge-id', {
      id: 'student-id',
      globalAdmin: false
    });

    expect(context).toBeNull();
    expect(mockGetUserHighestOpenBadgeLevel).toHaveBeenCalledWith('student-id', 'badge-id');
    expect(mockBrowseAssignableUsersForOpenBadge).not.toHaveBeenCalled();
    expect(mockBuildMap).not.toHaveBeenCalled();
  });
});
