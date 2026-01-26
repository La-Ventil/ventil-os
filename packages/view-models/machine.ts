export enum MachineAvailability {
  Available = 'available',
  Reserved = 'reserved',
  Occupied = 'occupied'
}

export type MachineViewModel = {
  id: string;
  category: string;
  name: string;
  description: string;
  availability: MachineAvailability;
  imageUrl?: string;
};
