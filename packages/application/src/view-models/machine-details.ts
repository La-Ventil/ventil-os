import type { MachineDetails } from '@repo/domain/machine/machine-details';
import type { OpenBadgeRequirement } from '@repo/domain/badge/open-badge-requirement';
export { OpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';
export { ActivityStatus } from '@repo/domain/activity-status';

export type MachineOpenBadgeRequirementViewModel = OpenBadgeRequirement;
export type MachineDetailsViewModel = MachineDetails;
