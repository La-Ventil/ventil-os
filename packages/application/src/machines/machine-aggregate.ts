import type { MachineSchema, MachineReservationSchema } from '@repo/db/schemas';
import { Machine, MachineReservationSlot } from '@repo/domain/machine/machine';

export type MachineAggregateReservationInput = Pick<
  MachineReservationSchema,
  'id' | 'startsAt' | 'endsAt' | 'status'
>;

export const buildMachineAggregate = (
  machine: MachineSchema,
  reservations: MachineAggregateReservationInput[] = []
): Machine =>
  Machine.from({
    id: machine.id,
    name: machine.name,
    category: machine.category,
    description: machine.description ?? null,
    imageUrl: machine.imageUrl ?? null,
    status: machine.status,
    reservations: reservations.map((reservation) => MachineReservationSlot.from(reservation))
  });
