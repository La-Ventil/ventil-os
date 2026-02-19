import type { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeLevel } from '@repo/domain/badge/open-badge-level';
import type { OpenBadgeAdminPayload, OpenBadgeProgressPayload, OpenBadgePayload } from '../selects/open-badge';

export type OpenBadgeReadModel = Omit<OpenBadgePayload, 'levels' | 'status'> & {
  levels: OpenBadgeLevel[];
  status: ActivityStatus;
};

export type OpenBadgeLevelReadModel = OpenBadgeReadModel['levels'][number];

export type OpenBadgeProgressReadModel = Omit<OpenBadgeProgressPayload, 'openBadge'> & {
  openBadge: OpenBadgeReadModel;
};

export type OpenBadgeAdminReadModel = Omit<OpenBadgeAdminPayload, 'status'> & {
  status: ActivityStatus;
};
