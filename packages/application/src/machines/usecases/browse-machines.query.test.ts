import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { MachineAvailability } from '@repo/domain/machine/machine-availability';
import { browseMachines } from './browse-machines.query';

const mockListMachines = vi.fn();
const mockResolveMachinesAvailability = vi.fn();

vi.mock('@repo/db', () => ({
  machineRepository: {
    listMachines: () => mockListMachines()
  }
}));

vi.mock('./resolve-machines-availability.query', () => ({
  resolveMachinesAvailability: (...args: [unknown]) => mockResolveMachinesAvailability(...args)
}));

describe('browseMachines', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolveMachinesAvailability.mockResolvedValue(new Map([['machine-active', MachineAvailability.Available]]));
  });

  it('filters inactive machines from the hub list', async () => {
    mockListMachines.mockResolvedValue([
      {
        id: 'machine-active',
        name: 'Bambu Lab X1C',
        category: 'Impression 3D',
        description: 'Active machine',
        imageUrl: null,
        status: ActivityStatus.Active
      },
      {
        id: 'machine-inactive',
        name: 'Laserbox',
        category: 'Découpe laser',
        description: 'Inactive machine',
        imageUrl: null,
        status: ActivityStatus.Inactive
      }
    ]);

    const machines = await browseMachines('Europe/Paris');

    expect(machines).toEqual([
      expect.objectContaining({
        id: 'machine-active',
        name: 'Bambu Lab X1C'
      })
    ]);
    expect(mockResolveMachinesAvailability).toHaveBeenCalledWith({
      machines: [
        expect.objectContaining({
          id: 'machine-active',
          name: 'Bambu Lab X1C'
        })
      ],
      timeZone: 'Europe/Paris',
      date: expect.any(Date)
    });
  });
});
