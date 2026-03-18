import type { MachineDetailsReadModel } from '@repo/db/read-models';
import type { MachineDetailsViewModel } from '@repo/application/view-models/machine-details';
import type { MachineAvailability } from '@repo/application/view-models/machine';

export const mapMachineDetailsToViewModel = (
  machine: MachineDetailsReadModel,
  availability: MachineAvailability
): MachineDetailsViewModel => ({
  id: machine.id,
  category: machine.category,
  name: machine.name,
  description: machine.description ?? null,
  imageUrl: machine.imageUrl ?? null,
  status: machine.status,
  availability,
  roomName: machine.room?.name ?? null,
  badgeRequirements: machine.badgeRequirements
});
