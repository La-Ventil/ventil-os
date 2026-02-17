import type { ActivityStatus } from '@repo/domain/activity-status';
export { ActivityStatus as MachineAdminStatus } from '@repo/domain/activity-status';

export type MachineAdminViewModel = {
  id: string;
  name: string;
  category: string;
  room: string;
  badgeRequirementsCount: number;
  status: ActivityStatus;
};
