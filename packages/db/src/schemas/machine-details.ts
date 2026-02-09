import type { Prisma } from '@prisma/client';

export type MachineDetailsSchema = Prisma.MachineGetPayload<{
  select: {
    id: true;
    category: true;
    name: true;
    description: true;
    imageUrl: true;
    status: true;
    room: {
      select: {
        name: true;
      };
    };
    badgeRequirements: {
      select: {
        id: true;
        ruleType: true;
        requiredOpenBadgeId: true;
        requiredOpenBadge: {
          select: {
            name: true;
          };
        };
        requiredOpenBadgeLevelId: true;
        requiredOpenBadgeLevel: {
          select: {
            title: true;
          };
        };
      };
    };
  };
}>;
