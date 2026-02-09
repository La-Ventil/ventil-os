import type { Prisma } from '@prisma/client';

export type MachineReservationSchema = Prisma.MachineReservationGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        username: true;
        image: true;
        email: true;
      };
    };
    participants: {
      select: {
        id: true;
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            username: true;
            image: true;
            email: true;
          };
        };
      };
    };
  };
}>;
