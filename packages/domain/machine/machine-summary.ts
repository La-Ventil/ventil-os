import type { MachineAvailability } from './machine-availability';

export type MachineSummary = {
  id: string;
  category: string;
  name: string;
  description: string;
  availability: MachineAvailability;
  imageUrl?: string;
};
