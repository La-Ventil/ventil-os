import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';

export type MachineDetailsSchemaRaw = Prisma.MachineGetPayload<{
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
        requiredOpenBadge: {
          select: {
            id: true;
            name: true;
            type: true;
            coverImage: true;
          };
        };
        requiredOpenBadgeLevel: {
          select: {
            id: true;
            title: true;
            level: true;
          };
        };
      };
    };
  };
}>;

type BadgeRequirementRaw = MachineDetailsSchemaRaw['badgeRequirements'][number];

type BadgeRequirement = Omit<BadgeRequirementRaw, 'ruleType'> & {
  ruleType: OpenBadgeRequirementRule;
};

export type MachineDetailsSchema = Omit<MachineDetailsSchemaRaw, 'status' | 'badgeRequirements'> & {
  status: ActivityStatus;
  badgeRequirements: BadgeRequirement[];
};
