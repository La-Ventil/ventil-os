export enum MachineAvailability {
  Available = 'available',
  Reserved = 'reserved',
  Occupied = 'occupied'
}

export type Machine = {
  id: string;
  category: string;
  title: string;
  description: string;
  availability: MachineAvailability;
  illustrationLabel?: string;
};
