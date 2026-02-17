import type { MachineDetailsSchema } from '@repo/db/schemas';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import type { MachineAvailability } from '@repo/view-models/machine';

export const mapMachineDetailsToViewModel = (
  machine: MachineDetailsSchema,
  availability: MachineAvailability
): MachineDetailsViewModel => ({
  id: machine.id,
  category: machine.category,
  name: machine.name,
  description: machine.description ?? null,
  imageUrl: machine.imageUrl ?? null,
  status: machine.status,
  availability,
  roomName: machine.room?.name ?? null,
  badgeRequirements: machine.badgeRequirements.map(mapBadgeRequirement)
});

const mapBadgeRequirement = (requirement: MachineDetailsSchema['badgeRequirements'][number]) => ({
  id: requirement.id,
  badge: {
    id: requirement.requiredOpenBadge.id,
    name: requirement.requiredOpenBadge.name,
    type: requirement.requiredOpenBadge.type ?? null,
    imageUrl: requirement.requiredOpenBadge.coverImage ?? null
  },
  level: requirement.requiredOpenBadgeLevel
    ? {
        id: requirement.requiredOpenBadgeLevel.id,
        title: requirement.requiredOpenBadgeLevel.title ?? null,
        level: requirement.requiredOpenBadgeLevel.level
      }
    : null,
  rule: requirement.ruleType
});
