import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { OpenBadgeRequirement } from '@repo/domain/badge/open-badge-requirement';
import { OpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';
import { Machine } from '@repo/domain/machine/machine';
import { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import { reserveMachine } from './reserve-machine.command';
import { updateReservation } from './update-reservation.command';

const mockGetReservableMachine = vi.fn();
const mockCreateMachineReservation = vi.fn();
const mockGetUserHighestOpenBadgeLevels = vi.fn();
const mockGetReservationById = vi.fn();
const mockUpdateReservation = vi.fn();

vi.mock('@repo/db', () => ({
  machineRepository: {
    getReservableMachine: (...args: [string, Date, Date]) => mockGetReservableMachine(...args)
  },
  machineReservationRepository: {
    createMachineReservation: (...args: [Record<string, unknown>]) => mockCreateMachineReservation(...args),
    getById: (...args: [string]) => mockGetReservationById(...args),
    updateReservation: (...args: [Record<string, unknown>]) => mockUpdateReservation(...args)
  },
  openBadgeRepository: {
    getUserHighestOpenBadgeLevels: (...args: [string, string[]]) => mockGetUserHighestOpenBadgeLevels(...args)
  }
}));

vi.mock('../../presenters/machine-reservation', () => ({
  mapMachineReservationToViewModel: (reservation: unknown) => reservation
}));

const reservableMachine = Machine.from({
  id: 'machine-1',
  name: 'Bambu Lab X1C',
  category: 'Impression 3D',
  status: ActivityStatus.Active,
  badgeRequirements: [
    OpenBadgeRequirement.from({
      id: 'requirement-1',
      rule: OpenBadgeRequirementRule.All,
      openBadge: {
        id: 'badge-1',
        name: 'Impression 3D Bambu Lab'
      },
      level: {
        id: 'level-2',
        openBadgeId: 'badge-1',
        title: 'Niveau 2',
        level: 2
      }
    })
  ]
});

describe('machine reservation eligibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetReservableMachine.mockResolvedValue(reservableMachine);
    mockGetUserHighestOpenBadgeLevels.mockResolvedValue(new Map([['badge-1', 1]]));
    mockCreateMachineReservation.mockResolvedValue({ id: 'reservation-1' });
    mockUpdateReservation.mockResolvedValue({ id: 'reservation-1' });
    mockGetReservationById.mockResolvedValue({
      id: 'reservation-1',
      machineId: 'machine-1',
      startsAt: new Date('2100-01-01T10:00:00.000Z'),
      endsAt: new Date('2100-01-01T10:30:00.000Z'),
      status: MachineReservationStatus.Confirmed,
      creator: {
        id: 'student-1'
      },
      participants: []
    });
  });

  it('rejects reservation creation when user level is below the machine requirement', async () => {
    await expect(
      reserveMachine({
        machineId: 'machine-1',
        creatorId: 'student-1',
        startsAt: new Date('2100-01-01T10:00:00.000Z'),
        durationMinutes: 30
      })
    ).rejects.toMatchObject({
      code: 'machineReservation.badgeRequired'
    });

    expect(mockCreateMachineReservation).not.toHaveBeenCalled();
  });

  it('rejects reservation update when reservation owner no longer meets the machine requirement', async () => {
    await expect(
      updateReservation({
        reservationId: 'reservation-1',
        startsAt: new Date('2100-01-01T11:00:00.000Z'),
        durationMinutes: 30,
        currentUser: { id: 'student-1' }
      })
    ).rejects.toMatchObject({
      code: 'machineReservation.badgeRequired'
    });

    expect(mockUpdateReservation).not.toHaveBeenCalled();
  });
});
