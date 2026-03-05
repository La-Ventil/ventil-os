import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { MachineAvailability } from '@repo/domain/machine/machine-availability';
import { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { viewMachineReservationForm } from './view-machine-reservation-form.query';

const mockViewMachineDetails = vi.fn();
const mockViewMachineReservation = vi.fn();
const mockBrowseUsersForReservation = vi.fn();

vi.mock('./view-machine-details.query', () => ({
  viewMachineDetails: (...args: [string]) => mockViewMachineDetails(...args)
}));

vi.mock('./view-machine-reservation.query', () => ({
  viewMachineReservation: (...args: [string]) => mockViewMachineReservation(...args)
}));

vi.mock('../../users/usecases/browse-users-for-reservation.query', () => ({
  browseUsersForReservation: () => mockBrowseUsersForReservation()
}));

describe('viewMachineReservationForm', () => {
  const machine: MachineDetailsViewModel = {
    id: 'machine-id',
    category: 'printer',
    name: 'Laser Cutter',
    status: ActivityStatus.Active,
    availability: MachineAvailability.Available,
    badgeRequirements: [],
    description: null,
    imageUrl: null,
    roomName: null
  };

  const reservation: MachineReservationViewModel = {
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
      image: null,
      email: 'ada@example.com',
      fullName: 'Ada Lovelace'
    },
    participants: []
  };

  const participants: UserSummaryViewModel[] = [
    {
      id: 'user-id',
      firstName: 'Grace',
      lastName: 'Hopper',
      username: 'grace',
      image: null,
      email: 'grace@example.com',
      fullName: 'Grace Hopper'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockViewMachineDetails.mockResolvedValue(machine);
    mockViewMachineReservation.mockResolvedValue(reservation);
    mockBrowseUsersForReservation.mockResolvedValue(participants);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when machine does not exist', async () => {
    mockViewMachineDetails.mockResolvedValue(null);

    const context = await viewMachineReservationForm({
      machineId: 'missing-machine',
      reservationId: 'reservation-id',
      actor: { id: 'creator-id' }
    });

    expect(context).toBeNull();
  });

  it('returns null when reservation belongs to another machine', async () => {
    mockViewMachineReservation.mockResolvedValue({
      ...reservation,
      machineId: 'other-machine-id'
    });

    const context = await viewMachineReservationForm({
      machineId: 'machine-id',
      reservationId: 'reservation-id',
      actor: { id: 'creator-id' }
    });

    expect(context).toBeNull();
  });

  it('returns null when actor cannot view reservation', async () => {
    const context = await viewMachineReservationForm({
      machineId: 'machine-id',
      reservationId: 'reservation-id',
      actor: { id: 'other-user' }
    });

    expect(context).toBeNull();
  });

  it('returns context for reservation owner', async () => {
    const context = await viewMachineReservationForm({
      machineId: 'machine-id',
      reservationId: 'reservation-id',
      actor: { id: 'creator-id', globalAdmin: false, pedagogicalAdmin: false }
    });

    expect(context).toEqual({
      machine,
      participantOptions: participants,
      startAt: reservation.startsAt,
      reservation,
      currentUserId: 'creator-id',
      canManageReservations: false
    });
  });

  it('falls back to query start date, then now when no reservation is loaded', async () => {
    const now = new Date('2026-03-05T08:00:00.000Z');
    mockViewMachineReservation.mockResolvedValue(null);

    const withQueryStart = await viewMachineReservationForm({
      machineId: 'machine-id',
      reservationId: 'missing-id',
      start: '2026-03-05T09:30:00.000Z',
      actor: { id: 'admin-id', globalAdmin: true },
      now
    });
    const withNowFallback = await viewMachineReservationForm({
      machineId: 'machine-id',
      actor: { id: 'admin-id', globalAdmin: true },
      now
    });

    expect(withQueryStart?.startAt.toISOString()).toBe('2026-03-05T09:30:00.000Z');
    expect(withQueryStart?.canManageReservations).toBe(true);
    expect(withNowFallback?.startAt).toEqual(now);
  });
});
