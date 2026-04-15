import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { MachineAvailability } from '@repo/domain/machine/machine-availability';
import { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import { viewMachineModalContext } from './view-machine-modal-context.query';

const mockGetMachineDetailsById = vi.fn();
const mockViewMachineReservationsForDayKey = vi.fn();
const mockViewMachineReservationForm = vi.fn();
const mockCheckReservationEligibilityForMachine = vi.fn();

vi.mock('@repo/db', () => ({
  machineRepository: {
    getMachineDetailsById: (...args: [string]) => mockGetMachineDetailsById(...args)
  }
}));

vi.mock('./view-machine-reservations.query', () => ({
  viewMachineReservationsForDayKey: (...args: [string, string, string]) => mockViewMachineReservationsForDayKey(...args)
}));

vi.mock('./view-machine-reservation-form.query', () => ({
  viewMachineReservationForm: (...args: [Record<string, unknown>]) => mockViewMachineReservationForm(...args)
}));

vi.mock('../reservation-eligibility', () => ({
  checkReservationEligibilityForMachine: (...args: [unknown, string | undefined]) =>
    mockCheckReservationEligibilityForMachine(...args)
}));

describe('viewMachineModalContext', () => {
  const machine = {
    id: 'machine-id',
    category: 'printer',
    name: 'Laser Cutter',
    status: ActivityStatus.Active,
    description: null,
    imageUrl: null,
    room: { name: 'Fab Lab' },
    badgeRequirements: []
  };

  const reservations: MachineReservationViewModel[] = [
    {
      id: 'reservation-id',
      machineId: 'machine-id',
      startsAt: new Date('2026-03-05T10:00:00.000Z'),
      endsAt: new Date('2026-03-05T10:30:00.000Z'),
      status: MachineReservationStatus.Confirmed,
      creator: {
        id: 'creator-id',
        firstName: 'Ada',
        lastName: 'Lovelace',
        username: 'ada',
        avatar: null,
        image: null,
        email: 'ada@example.com',
        fullName: 'Ada Lovelace'
      },
      participants: []
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMachineDetailsById.mockResolvedValue(machine);
    mockViewMachineReservationsForDayKey.mockResolvedValue(reservations);
    mockViewMachineReservationForm.mockResolvedValue({
      machine: {
        id: machine.id,
        category: machine.category,
        name: machine.name,
        status: machine.status,
        availability: MachineAvailability.Available,
        badgeRequirements: [],
        description: null,
        imageUrl: null,
        roomName: 'Fab Lab'
      },
      participantOptions: [],
      startAt: new Date('2026-03-05T09:30:00.000Z'),
      reservation: null,
      currentUserId: 'user-id',
      canManageReservations: false
    });
    mockCheckReservationEligibilityForMachine.mockResolvedValue(true);
  });

  it('skips reservation form preloading for the schedule step', async () => {
    const now = new Date('2026-03-05T08:00:00.000Z');

    const context = await viewMachineModalContext({
      machineId: 'machine-id',
      timeZone: 'Europe/Paris',
      step: 'schedule',
      at: '2026-03-05T09:00:00.000Z',
      actor: { id: 'user-id' },
      now
    });

    expect(context?.reservationFormOptions.participantOptions).toEqual([]);
    expect(context?.initialReservationState).toBeUndefined();
    expect(mockViewMachineReservationForm).not.toHaveBeenCalled();
  });

  it('preloads the form only when opening create or edit flows', async () => {
    const now = new Date('2026-03-05T08:00:00.000Z');

    await viewMachineModalContext({
      machineId: 'machine-id',
      timeZone: 'Europe/Paris',
      step: 'create',
      at: '2026-03-05T09:00:00.000Z',
      actor: { id: 'user-id' },
      now
    });

    expect(mockViewMachineReservationForm).toHaveBeenCalledWith({
      machineId: 'machine-id',
      reservationId: null,
      at: '2026-03-05T09:00:00.000Z',
      actor: { id: 'user-id' },
      now,
      machine: {
        id: machine.id,
        category: machine.category,
        name: machine.name,
        status: machine.status,
        availability: MachineAvailability.Available,
        badgeRequirements: [],
        description: null,
        imageUrl: null,
        roomName: 'Fab Lab'
      }
    });
  });
});
