import type { MachineDetailsSchema } from '@repo/db/schemas';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import { mapMachineStatus } from './machine';

export const mapMachineDetailsToViewModel = (machine: MachineDetailsSchema): MachineDetailsViewModel => ({
  id: machine.id,
  category: machine.category,
  name: machine.name,
  description: machine.description ?? null,
  imageUrl: machine.imageUrl ?? null,
  availability: mapMachineStatus(machine.status),
  roomName: machine.room?.name ?? null,
  badgeRequirements: machine.badgeRequirements.map(mapBadgeRequirement)
});

const mapBadgeRequirement = (requirement: MachineDetailsSchema['badgeRequirements'][number]) => ({
  id: requirement.id,
  badgeId: requirement.requiredOpenBadgeId,
  badgeName: requirement.requiredOpenBadge.name,
  badgeType: requirement.requiredOpenBadge.type ?? null,
  badgeImageUrl: requirement.requiredOpenBadge.coverImage ?? null,
  badgeLevelId: requirement.requiredOpenBadgeLevelId ?? null,
  badgeLevelTitle: requirement.requiredOpenBadgeLevel?.title ?? null,
  ruleType: requirement.ruleType
});
