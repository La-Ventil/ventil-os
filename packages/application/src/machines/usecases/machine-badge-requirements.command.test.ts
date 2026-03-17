import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { OpenBadgeRequirementError } from '@repo/domain/badge/open-badge-requirement';
import { OpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';
import { addMachine } from './add-machine.command';
import { updateMachine } from './update-machine.command';

const mockCreateMachine = vi.fn();
const mockUpdateMachine = vi.fn();
const mockGetMachineById = vi.fn();
const mockGetOpenBadgeRequirementDefinition = vi.fn();

vi.mock('@repo/db', () => ({
  machineRepository: {
    createMachine: (...args: [Record<string, unknown>]) => mockCreateMachine(...args),
    updateMachine: (...args: [Record<string, unknown>]) => mockUpdateMachine(...args),
    getMachineById: (...args: [string]) => mockGetMachineById(...args)
  },
  openBadgeRepository: {
    getOpenBadgeRequirementDefinition: (...args: [Record<string, unknown>]) =>
      mockGetOpenBadgeRequirementDefinition(...args)
  }
}));

describe('machine badge requirement write path', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateMachine.mockResolvedValue({ id: 'machine-id' });
    mockUpdateMachine.mockResolvedValue({ id: 'machine-id' });
    mockGetMachineById.mockResolvedValue({
      id: 'machine-id',
      imageUrl: null
    });
    mockGetOpenBadgeRequirementDefinition.mockResolvedValue({
      id: 'badge-id:level-1',
      rule: OpenBadgeRequirementRule.All,
      openBadge: {
        id: 'badge-id',
        name: 'Impression 3D Bambu Lab',
        type: 'Machine',
        imageUrl: null
      },
      level: {
        id: 'level-1',
        openBadgeId: 'badge-id',
        title: 'Utilisateur autonome',
        level: 1
      }
    });
  });

  it('persists validated badge requirements when creating a machine', async () => {
    await addMachine({
      name: 'Machine test',
      description: 'Description',
      imageUrl: null,
      activationEnabled: true,
      creatorId: 'admin-id',
      badgeRequirements: [
        {
          openBadgeId: 'badge-id',
          openBadgeLevelId: 'level-1'
        }
      ]
    });

    expect(mockCreateMachine).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ActivityStatus.Active,
        badgeRequirements: [
          {
            requiredOpenBadgeId: 'badge-id',
            requiredOpenBadgeLevelId: 'level-1',
            rule: OpenBadgeRequirementRule.All
          }
        ]
      })
    );
  });

  it('rejects mismatched badge and level when updating a machine', async () => {
    mockGetOpenBadgeRequirementDefinition.mockResolvedValue({
      id: 'badge-id:level-1',
      rule: OpenBadgeRequirementRule.All,
      openBadge: {
        id: 'badge-id',
        name: 'Impression 3D Bambu Lab',
        type: 'Machine',
        imageUrl: null
      },
      level: {
        id: 'level-1',
        openBadgeId: 'other-badge-id',
        title: 'Utilisateur autonome',
        level: 1
      }
    });

    await expect(
      updateMachine({
        id: 'machine-id',
        name: 'Machine test',
        description: 'Description',
        activationEnabled: true,
        badgeRequirements: [
          {
            openBadgeId: 'badge-id',
            openBadgeLevelId: 'level-1'
          }
        ]
      })
    ).rejects.toBeInstanceOf(OpenBadgeRequirementError);

    expect(mockUpdateMachine).not.toHaveBeenCalled();
  });
});
