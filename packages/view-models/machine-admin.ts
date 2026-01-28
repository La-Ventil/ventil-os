export type MachineAdminStatus = 'active' | 'inactive';

export type MachineAdminViewModel = {
  id: string;
  name: string;
  category: string;
  room: string;
  badgeRequirementsCount: number;
  status: MachineAdminStatus;
};
