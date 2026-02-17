export type DomainEvent<Type extends string = string, Payload = unknown> = {
  type: Type;
  payload: Payload;
  occurredAt: Date;
};

export const createDomainEvent = <Type extends string, Payload>(
  type: Type,
  payload: Payload,
  occurredAt: Date = new Date()
): DomainEvent<Type, Payload> => ({
  type,
  payload,
  occurredAt
});

export type MachineReservationCreatedEvent = DomainEvent<
  'machineReservation.created',
  {
    reservationId: string;
    machineId: string;
    creatorId: string;
    startsAt: Date;
    endsAt: Date;
  }
>;

export type MachineReservationCancelledEvent = DomainEvent<
  'machineReservation.cancelled',
  {
    reservationId: string;
    machineId: string;
    cancelledById: string;
  }
>;

export type EmailChangeRequestedEvent = DomainEvent<
  'user.emailChangeRequested',
  {
    userId: string;
    email: string;
  }
>;

export type EmailVerifiedEvent = DomainEvent<
  'user.emailVerified',
  {
    userId: string;
    email: string;
  }
>;
