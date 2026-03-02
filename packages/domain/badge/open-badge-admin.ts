import type { ActivityStatus } from '../activity-status';

export type OpenBadgeAdmin = {
  id: string;
  name: string;
  coverImage?: string | null;
  levelsCount: number;
  assignedCount: number;
  machineLinksCount: number;
  status: ActivityStatus;
};
