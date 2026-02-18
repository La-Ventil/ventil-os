import type { Prisma } from '@prisma/client';

export const includeEventSchemaRaw = {
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

export type EventSchema = Prisma.EventGetPayload<{
  include: typeof includeEventSchemaRaw;
}>;
