import { machineRepository, machineReservationRepository } from '@repo/db';
import { Machine } from '@repo/domain/machine/machine';
import { resolveMachineAvailability } from '@repo/domain/machine/machine-availability';
import { resolveMachineBaseAvailability } from '@repo/domain/machine/machine-availability';
import type { ReservationActor } from '@repo/domain/machine/machine-reservation-cancellation-policy';
import type { MachineDetailsViewModel } from '@repo/application/machines/models/machine-details';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import { getDayIntervalForDayKey, formatDayKey } from '../../time/date-time';
import { resolveIsoDateFromQuery } from '../../time/iso-date';
import { mapMachineDetailsToViewModel } from '../../presenters/machine-details';
import type { Query } from '../../usecase';
import { canUserReserve } from '../reservation-eligibility';
import { type MachineReservationFormContext, viewMachineReservationForm } from './view-machine-reservation-form.query';
import { viewMachineReservationsForDayKey } from './view-machine-reservations.query';

type ViewMachineScheduleContextInput = {
  machineId: string;
  at?: string | null;
  reservationId?: string | null;
  step?: 'schedule' | 'create' | 'edit';
  actor?: ReservationActor | null;
  timeZone: string;
  now?: Date;
};

export type MachineScheduleContextView = {
  machine: MachineDetailsViewModel;
  reservations: MachineReservationViewModel[];
  canReserve: boolean;
  focusedAt: Date;
  initialReservationState?: {
    at: Date;
    reservation: MachineReservationViewModel | null;
  };
  reservationFormOptions: {
    participantOptions: MachineReservationFormContext['participantOptions'];
  };
};

const toMachineAggregate = (machine: MachineDetailsViewModel) =>
  Machine.from({
    id: machine.id,
    name: machine.name,
    category: machine.category,
    status: machine.status,
    description: machine.description,
    imageUrl: machine.imageUrl,
    roomName: machine.roomName,
    badgeRequirements: machine.badgeRequirements
  });

export const viewMachineScheduleContext: Query<
  [ViewMachineScheduleContextInput],
  MachineScheduleContextView | null
> = async (input: ViewMachineScheduleContextInput) => {
  const now = input.now ?? new Date();
  const focusedAt = resolveIsoDateFromQuery(input.at) ?? now;
  const todayKey = formatDayKey(now, input.timeZone);
  const selectedDateKey = formatDayKey(focusedAt, input.timeZone);
  const normalizedStep = input.reservationId ? 'edit' : input.step === 'create' ? 'create' : 'schedule';
  const machineRecord = await machineRepository.getMachineDetailsById(input.machineId);

  if (!machineRecord) {
    return null;
  }

  const machine = mapMachineDetailsToViewModel(machineRecord, resolveMachineBaseAvailability(machineRecord.status));
  const machineAggregate = toMachineAggregate(machine);
  const reservationsPromise = viewMachineReservationsForDayKey(input.machineId, selectedDateKey, input.timeZone);
  const todayInterval = getDayIntervalForDayKey(todayKey, input.timeZone);
  // When viewing a past or future day, today's reservations are only needed to
  // compute current machine availability — use the lightweight select instead of
  // the full creator+participants include.
  const reservationsTodayPromise =
    selectedDateKey === todayKey
      ? reservationsPromise
      : machineReservationRepository.listAvailabilityForMachineBetween(
          input.machineId,
          todayInterval.start,
          todayInterval.end
        );
  const reservationFormPromise =
    normalizedStep === 'schedule'
      ? Promise.resolve<MachineReservationFormContext | null>(null)
      : viewMachineReservationForm({
          machineId: input.machineId,
          reservationId: normalizedStep === 'edit' ? input.reservationId : null,
          at: input.at,
          actor: input.actor,
          now,
          machine
        });

  const [reservations, reservationsToday, canReserve, reservationForm] = await Promise.all([
    reservationsPromise,
    reservationsTodayPromise,
    canUserReserve(machineAggregate, input.actor?.id),
    reservationFormPromise
  ]);

  const { end } = getDayIntervalForDayKey(todayKey, input.timeZone);
  const availability = resolveMachineAvailability(machine.availability, reservationsToday, now, end);

  return {
    machine: { ...machine, availability },
    reservations,
    canReserve,
    focusedAt: reservationForm?.startAt ?? focusedAt,
    initialReservationState:
      normalizedStep === 'schedule'
        ? undefined
        : {
            at: reservationForm?.startAt ?? focusedAt,
            reservation: normalizedStep === 'edit' ? (reservationForm?.reservation ?? null) : null
          },
    reservationFormOptions: {
      participantOptions: reservationForm?.participantOptions ?? []
    }
  };
};
