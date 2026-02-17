import type { ActivityStatus } from '../activity-status';
import type { OpenBadgeRequirement } from '../badge/open-badge-requirement';
import type { MachineAvailability } from './machine-availability';

export type MachineDetails = {
  id: string;
  category: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  status: ActivityStatus;
  availability: MachineAvailability;
  roomName?: string | null;
  badgeRequirements: OpenBadgeRequirement[];
};
