import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import { addOpenBadge } from './add-open-badge.command';

const mockCreateOpenBadge = vi.fn();

vi.mock('@repo/db', () => ({
  openBadgeRepository: {
    createOpenBadge: (...args: [Record<string, unknown>]) => mockCreateOpenBadge(...args)
  }
}));

const twoLevels = [
  { title: 'Discover', description: 'First steps' },
  { title: 'Master', description: 'Can teach it' }
];

const input = {
  name: 'Laser cutter',
  description: 'Safe use of the laser cutter',
  imageUrl: '/uploads/open-badges/laser.png',
  levels: twoLevels,
  activationEnabled: true,
  creatorId: 'admin-id'
};

describe('addOpenBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateOpenBadge.mockResolvedValue({ id: 'badge-id' });
  });

  it('stores the level from which holders may deliver the badge', async () => {
    await addOpenBadge({ ...input, trainerThresholdLevel: 2 });

    expect(mockCreateOpenBadge).toHaveBeenCalledWith(expect.objectContaining({ trainerThresholdLevel: 2 }));
  });

  it('stores no threshold when only admins may deliver it', async () => {
    await addOpenBadge({ ...input, trainerThresholdLevel: null });

    expect(mockCreateOpenBadge).toHaveBeenCalledWith(expect.objectContaining({ trainerThresholdLevel: null }));
  });

  it('refuses a threshold above the levels the badge actually has', async () => {
    await expect(addOpenBadge({ ...input, trainerThresholdLevel: 3 })).rejects.toEqual(
      expect.objectContaining({ code: 'openBadge.delivery.invalidLevel' })
    );
    await expect(addOpenBadge({ ...input, trainerThresholdLevel: 3 })).rejects.toBeInstanceOf(OpenBadgeError);
    expect(mockCreateOpenBadge).not.toHaveBeenCalled();
  });
});
