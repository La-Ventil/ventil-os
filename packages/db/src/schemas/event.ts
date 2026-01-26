import type { Prisma } from '@prisma/client';

export type EventSchema = Prisma.EventGetPayload<{
  include: {
    template: {
      select: {
        type: true;
      };
    };
    room: {
      select: {
        name: true;
      };
    };
    _count: {
      select: {
        registrations: true;
      };
    };
  };
}>;
