import type { Prisma } from '../generated/prisma/client';

export const eventInclude = {
  template: {
    select: {
      type: true
    }
  },
  room: {
    select: {
      name: true
    }
  },
  _count: {
    select: {
      registrations: true
    }
  }
} as const;

export type EventPayload = Prisma.EventGetPayload<{
  include: typeof eventInclude;
}>;
