import type { ActivityStatus } from '@repo/domain/activity-status';
import type { MachineAdminPayload, MachineSummaryPayload } from '../selects/machine';

export type MachineSummaryReadModel = Omit<MachineSummaryPayload, 'status'> & {
  status: ActivityStatus;
};

export type MachineAdminReadModel = Omit<MachineAdminPayload, 'status'> & {
  status: ActivityStatus;
};
