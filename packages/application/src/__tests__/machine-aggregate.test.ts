import { describe, expect, it } from 'vitest';
import { ActivityStatus } from '@repo/domain/activity-status';
import { MachineAvailability } from '@repo/domain/machine/machine-availability';
import { Machine, MachineReservationSlot } from '@repo/domain/machine/machine';
import { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';

const baseMachine = (reservations: MachineReservationSlot[] = []) =>
  Machine.from({
    id: 'machine-1',
    name: 'Laser Cutter',
    category: 'cutting',
    status: ActivityStatus.Active,
    reservations
  });

describe('Machine aggregate', () => {
  it('rejects reservations in the past', () => {
    const machine = baseMachine();
    const now = new Date('2026-02-17T10:00:00.000Z');
    const reservation = {
      startsAt: new Date('2026-02-17T09:00:00.000Z'),
      endsAt: new Date('2026-02-17T10:30:00.000Z')
    };

    expect(() => Machine.assertCanReserve(machine, reservation, now)).toThrow('machineReservation.startsAtInPast');
  });

  it('rejects overlapping reservations', () => {
    const existing = MachineReservationSlot.from({
      id: 'res-1',
      startsAt: new Date('2026-02-17T10:00:00.000Z'),
      endsAt: new Date('2026-02-17T11:00:00.000Z'),
      status: MachineReservationStatus.Confirmed
    });
    const machine = baseMachine([existing]);
    const reservation = {
      startsAt: new Date('2026-02-17T10:30:00.000Z'),
      endsAt: new Date('2026-02-17T11:30:00.000Z')
    };

    expect(() => Machine.assertCanReserve(machine, reservation, existing.startsAt)).toThrow(
      'machineReservation.overlap'
    );
  });

  it('resolves availability from reservations', () => {
    const now = new Date('2026-02-17T10:15:00.000Z');
    const dayEnd = new Date('2026-02-17T23:59:59.000Z');
    const existing = MachineReservationSlot.from({
      id: 'res-1',
      startsAt: new Date('2026-02-17T10:00:00.000Z'),
      endsAt: new Date('2026-02-17T11:00:00.000Z'),
      status: MachineReservationStatus.Confirmed
    });

    const machine = baseMachine([existing]);
    expect(Machine.resolveAvailability(machine, now, dayEnd)).toBe(MachineAvailability.Occupied);
  });
});
