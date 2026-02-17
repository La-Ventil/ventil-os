import type { ActivityStatus } from '../activity-status';

export type OpenBadgeAdmin = {
  id: string;
  name: string;
  levelsCount: number;
  assignedCount: number;
  status: ActivityStatus;
};
