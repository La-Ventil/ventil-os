import { describe, expect, it } from 'vitest';
import { MachineAvailability, resolveMachineAvailability } from '../machine/machine-availability';
import { MachineReservationStatus } from '../machine/machine-reservation-status';

const now = new Date('2026-02-16T10:00:00.000Z');
const dayEnd = new Date('2026-02-16T23:59:59.000Z');

describe('machine-availability', () => {
  it('keeps occupied machines occupied', () => {
    const availability = resolveMachineAvailability(MachineAvailability.Occupied, [], now, dayEnd);
    expect(availability).toBe(MachineAvailability.Occupied);
  });

  it('marks as occupied when a confirmed reservation is ongoing', () => {
    const availability = resolveMachineAvailability(
      MachineAvailability.Available,
      [
        {
          startsAt: new Date('2026-02-16T09:00:00.000Z'),
          endsAt: new Date('2026-02-16T11:00:00.000Z'),
          status: MachineReservationStatus.Confirmed
        }
      ],
      now,
      dayEnd
    );
    expect(availability).toBe(MachineAvailability.Occupied);
  });

  it('marks as reserved when a confirmed reservation is later today', () => {
    const availability = resolveMachineAvailability(
      MachineAvailability.Available,
      [
        {
          startsAt: new Date('2026-02-16T12:00:00.000Z'),
          endsAt: new Date('2026-02-16T13:00:00.000Z'),
          status: MachineReservationStatus.Confirmed
        }
      ],
      now,
      dayEnd
    );
    expect(availability).toBe(MachineAvailability.Reserved);
  });

  it('ignores cancelled reservations', () => {
    const availability = resolveMachineAvailability(
      MachineAvailability.Available,
      [
        {
          startsAt: new Date('2026-02-16T09:00:00.000Z'),
          endsAt: new Date('2026-02-16T11:00:00.000Z'),
          status: MachineReservationStatus.Cancelled
        }
      ],
      now,
      dayEnd
    );
    expect(availability).toBe(MachineAvailability.Available);
  });

  it('does not mark reserved when the next reservation is after day end', () => {
    const availability = resolveMachineAvailability(
      MachineAvailability.Available,
      [
        {
          startsAt: new Date('2026-02-17T00:10:00.000Z'),
          endsAt: new Date('2026-02-17T01:00:00.000Z'),
          status: MachineReservationStatus.Confirmed
        }
      ],
      now,
      dayEnd
    );
    expect(availability).toBe(MachineAvailability.Available);
  });
});
