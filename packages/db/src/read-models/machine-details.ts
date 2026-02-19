import type { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeRequirement } from '@repo/domain/badge/open-badge-requirement';
import type { MachineDetailsPayload } from '../selects/machine-details';

export type MachineDetailsReadModel = Omit<MachineDetailsPayload, 'status' | 'badgeRequirements'> & {
  status: ActivityStatus;
  badgeRequirements: OpenBadgeRequirement[];
};
