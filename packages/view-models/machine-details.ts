import { MachineAvailability } from './machine';

export type MachineOpenBadgeRequirementViewModel = {
  id: string;
  badgeId: string;
  badgeName: string;
  badgeLevelId?: string | null;
  badgeLevelTitle?: string | null;
  ruleType: 'all' | 'any';
};

export type MachineDetailsViewModel = {
  id: string;
  category: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  availability: MachineAvailability;
  roomName?: string | null;
  badgeRequirements: MachineOpenBadgeRequirementViewModel[];
};
