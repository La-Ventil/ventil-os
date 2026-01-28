export type OpenBadgeAdminStatus = 'active' | 'inactive';

export type OpenBadgeAdminViewModel = {
  id: string;
  name: string;
  levelsCount: number;
  assignedCount: number;
  status: OpenBadgeAdminStatus;
};
