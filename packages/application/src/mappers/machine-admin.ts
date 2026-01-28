import type { MachineAdminSchema } from '@repo/db/schemas';
import type { MachineAdminViewModel } from '@repo/view-models/machine-admin';

export const mapMachineAdminToViewModel = (
  machine: MachineAdminSchema
): MachineAdminViewModel => ({
  id: machine.id,
  name: machine.name,
  category: machine.category,
  room: machine.room?.name ?? '-',
  badgeRequirementsCount: machine._count.badgeRequirements,
  status: machine.status
});
