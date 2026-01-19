export type MachineAvailability = 'available' | 'reserved' | 'occupied';

export type MachineStatus = {
  label: string;
  availability: MachineAvailability;
};

export type Machine = {
  id: string;
  category: string;
  title: string;
  description: string;
  status: MachineStatus;
  illustrationLabel?: string;
};
