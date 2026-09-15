import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { viewOpenBadgeEdit } from './view-open-badge-edit.query';

const mockGetOpenBadgeById = vi.fn();
const mockGetTrainerThresholdLevel = vi.fn();

vi.mock('@repo/db', () => ({
  openBadgeRepository: {
    getOpenBadgeById: (...args: [string]) => mockGetOpenBadgeById(...args),
    getTrainerThresholdLevel: (...args: [string]) => mockGetTrainerThresholdLevel(...args)
  }
}));

const badge = {
  id: 'badge-id',
  name: 'Laser cutter',
  description: 'Safe use of the laser cutter',
  coverImage: '/uploads/open-badges/laser.png',
  status: ActivityStatus.Active,
  levels: [
    { id: 'level-1-id', level: 1, title: 'Discover', description: 'First steps' },
    { id: 'level-2-id', level: 2, title: 'Master', description: 'Can teach it' }
  ]
};

describe('viewOpenBadgeEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetOpenBadgeById.mockResolvedValue(badge);
    mockGetTrainerThresholdLevel.mockResolvedValue(null);
  });

  // Without it the edit screen always opened with delivery switched off, and saving it again
  // silently wiped whatever threshold the badge had.
  it('brings back the stored delivery threshold', async () => {
    mockGetTrainerThresholdLevel.mockResolvedValue(2);

    expect(await viewOpenBadgeEdit('badge-id')).toMatchObject({ trainerThresholdLevel: 2 });
    expect(mockGetTrainerThresholdLevel).toHaveBeenCalledWith('badge-id');
  });

  it('reports no threshold for a badge only admins may deliver', async () => {
    expect(await viewOpenBadgeEdit('badge-id')).toMatchObject({ trainerThresholdLevel: null });
  });

  it('returns nothing for an unknown badge', async () => {
    mockGetOpenBadgeById.mockResolvedValue(null);

    expect(await viewOpenBadgeEdit('missing')).toBeNull();
  });
});
