import { MachineAvailability } from '@repo/view-models/machine';
import type { MachineViewModel } from '@repo/view-models/machine';

const machines: MachineViewModel[] = [
  {
    id: 'machine-1',
    category: 'Categorie',
    name: 'Machine 1',
    description:
      "La machine permet d'imprimer par dépôt de fil polymère fondu des pièces en 3D.",
    availability: MachineAvailability.Available,
    imageUrl: undefined
  },
  {
    id: 'machine-2',
    category: 'Categorie',
    name: 'Machine 2',
    description:
      "La machine permet d'imprimer par dépôt de fil polymère fondu des pièces en 3D.",
    availability: MachineAvailability.Reserved,
    imageUrl: undefined
  },
  {
    id: 'machine-3',
    category: 'Categorie',
    name: 'Machine 3',
    description:
      "La machine permet d'imprimer par dépôt de fil polymère fondu des pièces en 3D.",
    availability: MachineAvailability.Occupied,
    imageUrl: undefined
  }
];

export class MachineRepositoryMock {
  async listMachines(): Promise<MachineViewModel[]> {
    return machines;
  }

  async getMachineById(id: string): Promise<MachineViewModel | null> {
    return machines.find((machine) => machine.id === id) ?? null;
  }
}
