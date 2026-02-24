import type { MachineAdminReadModel } from '@repo/db/read-models';
import type { MachineAdminViewModel } from '@repo/view-models/machine-admin';

export const mapMachineAdminToViewModel = (machine: MachineAdminReadModel): MachineAdminViewModel => ({
  id: machine.id,
  name: machine.name,
  category: machine.category,
  room: machine.room?.name ?? '-',
  imageUrl: machine.imageUrl ?? null,
  badgeRequirementsCount: machine._count.badgeRequirements,
  status: machine.status
});
