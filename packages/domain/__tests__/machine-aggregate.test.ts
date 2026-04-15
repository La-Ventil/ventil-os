import { describe, expect, it } from 'vitest';
import { ActivityStatus } from '../activity-status';
import { OpenBadgeRequirement } from '../badge/open-badge-requirement';
import { OpenBadgeRequirementRule } from '../badge/open-badge-requirement-rule';
import { MachineAvailability } from '../machine/machine-availability';
import { Machine, MachineReservationSlot } from '../machine/machine';
import { MachineReservationStatus } from '../machine/machine-reservation-status';

const badgeRequirement = OpenBadgeRequirement.from({
  id: 'requirement-1',
  rule: OpenBadgeRequirementRule.All,
  openBadge: {
    id: 'badge-1',
    name: 'Bambu Lab'
  },
  level: {
    id: 'level-2',
    openBadgeId: 'badge-1',
    title: 'Autonome',
    level: 2
  }
});

const baseMachine = (reservations: MachineReservationSlot[] = [], badgeRequirements = [] as OpenBadgeRequirement[]) =>
  Machine.from({
    id: 'machine-1',
    name: 'Laser Cutter',
    category: 'cutting',
    status: ActivityStatus.Active,
    badgeRequirements,
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

    expect(() => Machine.assertNoConflict(machine, reservation, now)).toThrow('machineReservation.startsAtInPast');
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

    expect(() => Machine.assertNoConflict(machine, reservation, existing.startsAt)).toThrow(
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

  it('rejects reservation eligibility when user badge level is below requirement', () => {
    const machine = baseMachine([], [badgeRequirement]);

    expect(() =>
      Machine.assertReservationEligibility(
        machine,
        new Map([
          ['badge-1', 1]
        ])
      )
    ).toThrow('machineReservation.badgeRequired');
  });

  it('accepts reservation eligibility when user badge level meets requirement', () => {
    const machine = baseMachine([], [badgeRequirement]);

    expect(() =>
      Machine.assertReservationEligibility(
        machine,
        new Map([
          ['badge-1', 2]
        ])
      )
    ).not.toThrow();
  });

  it('checks reservation creation through a single aggregate guard', () => {
    const machine = baseMachine([], [badgeRequirement]);
    const candidate = {
      startsAt: new Date('2026-02-17T11:30:00.000Z'),
      endsAt: new Date('2026-02-17T12:00:00.000Z')
    };

    expect(() =>
      Machine.assertCanCreateReservation(machine, candidate, {
        userLevels: new Map([['badge-1', 2]]),
        now: new Date('2026-02-17T09:00:00.000Z')
      })
    ).not.toThrow();

    expect(() =>
      Machine.assertCanCreateReservation(machine, candidate, {
        userLevels: new Map([['badge-1', 1]]),
        now: new Date('2026-02-17T09:00:00.000Z')
      })
    ).toThrow('machineReservation.badgeRequired');
  });

  it('rejects overlapping reservation creation through the aggregate guard', () => {
    const existing = MachineReservationSlot.from({
      id: 'res-1',
      startsAt: new Date('2026-02-17T10:00:00.000Z'),
      endsAt: new Date('2026-02-17T11:00:00.000Z'),
      status: MachineReservationStatus.Confirmed
    });
    const machine = baseMachine([existing], [badgeRequirement]);
    const candidate = {
      startsAt: new Date('2026-02-17T10:30:00.000Z'),
      endsAt: new Date('2026-02-17T11:30:00.000Z')
    };

    expect(() =>
      Machine.assertCanCreateReservation(machine, candidate, {
        userLevels: new Map([['badge-1', 2]]),
        now: new Date('2026-02-17T09:00:00.000Z')
      })
    ).toThrow('machineReservation.overlap');
  });

  it('checks reservation updates through a single aggregate guard', () => {
    const existing = MachineReservationSlot.from({
      id: 'res-1',
      startsAt: new Date('2026-02-17T10:00:00.000Z'),
      endsAt: new Date('2026-02-17T11:00:00.000Z'),
      status: MachineReservationStatus.Confirmed
    });
    const machine = baseMachine([existing], [badgeRequirement]);
    const candidate = {
      startsAt: new Date('2026-02-17T11:30:00.000Z'),
      endsAt: new Date('2026-02-17T12:00:00.000Z')
    };

    expect(() =>
      Machine.assertCanUpdateReservation(machine, candidate, {
        userLevels: new Map([['badge-1', 2]]),
        now: new Date('2026-02-17T09:00:00.000Z'),
        excludeReservationId: 'res-1'
      })
    ).not.toThrow();
  });
});
