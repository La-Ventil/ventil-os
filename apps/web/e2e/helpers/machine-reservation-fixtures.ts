import type { DateInterval } from '@repo/domain/date-interval';
import { reservationIntervalFor } from '@repo/domain/machine/reservation-rules';
import { getMachineReservationTestRepository } from './machine-reservation-test-repository';

type ReservationFixtureState = 'active' | 'upcoming' | 'past' | 'cancelled';

type ReservationFixtureInput = {
  creatorEmail: string;
  dbSlot?: string;
  durationMinutes?: number;
  machineName?: string;
  now?: Date;
  participantEmails?: string[];
};

type SeededReservationFixture = {
  reservationId: string;
  window: DateInterval;
};

const DEFAULT_MACHINE_NAME = 'Bambu Lab X1C n°1';
const DEFAULT_DURATION_MINUTES = 15;
const MINUTE_MS = 60_000;

const reservationStartOffsetByState: Record<ReservationFixtureState, number> = {
  active: -5,
  upcoming: 30,
  past: -45,
  cancelled: 30
};

const reservationWindowFromState = (args: {
  durationMinutes: number;
  now: Date;
  state: ReservationFixtureState;
}): DateInterval => {
  const startsAt = new Date(args.now.getTime() + reservationStartOffsetByState[args.state] * MINUTE_MS);
  return reservationIntervalFor(startsAt, args.durationMinutes);
};

export async function givenReservationFixture(
  args: ReservationFixtureInput & { state: ReservationFixtureState }
): Promise<SeededReservationFixture> {
  const {
    creatorEmail,
    dbSlot,
    durationMinutes = DEFAULT_DURATION_MINUTES,
    machineName = DEFAULT_MACHINE_NAME,
    now = new Date(),
    participantEmails,
    state
  } = args;

  const repository = getMachineReservationTestRepository(dbSlot);
  const window = reservationWindowFromState({ durationMinutes, now, state });
  const reservationId = await repository.createConfirmedReservation({
    machineName,
    creatorEmail,
    startsAt: window.start,
    durationMinutes,
    participantEmails
  });

  if (state === 'cancelled') {
    await repository.cancelReservation(reservationId);
  }

  return { reservationId, window };
}

export const givenUpcomingReservation = (args: ReservationFixtureInput): Promise<SeededReservationFixture> =>
  givenReservationFixture({ ...args, state: 'upcoming' });

export const givenActiveReservation = (args: ReservationFixtureInput): Promise<SeededReservationFixture> =>
  givenReservationFixture({ ...args, state: 'active' });

export const givenPastReservation = (args: ReservationFixtureInput): Promise<SeededReservationFixture> =>
  givenReservationFixture({ ...args, state: 'past' });

export const givenCancelledReservation = (args: ReservationFixtureInput): Promise<SeededReservationFixture> =>
  givenReservationFixture({ ...args, state: 'cancelled' });
