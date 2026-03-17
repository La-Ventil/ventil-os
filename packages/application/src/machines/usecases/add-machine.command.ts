import { machineRepository } from '@repo/db';
import { ActivityStatus } from '@repo/domain/activity-status';
import type { Command } from '../../usecase';
import { resolveMachineBadgeRequirements, type MachineBadgeRequirementInput } from '../machine-badge-requirements';

const DEFAULT_MACHINE_CATEGORY = 'Machine';

export type AddMachineInput = {
  name: string;
  description: string;
  imageUrl: string | null;
  activationEnabled: boolean;
  creatorId: string;
  badgeRequirements?: MachineBadgeRequirementInput[];
};

type AddMachineResult = Awaited<ReturnType<typeof machineRepository.createMachine>>;

export const addMachine: Command<[AddMachineInput], AddMachineResult> = async (input: AddMachineInput) => {
  const badgeRequirements = await resolveMachineBadgeRequirements(input.badgeRequirements);

  return machineRepository.createMachine({
    name: input.name,
    description: input.description,
    imageUrl: input.imageUrl,
    status: input.activationEnabled ? ActivityStatus.Active : ActivityStatus.Inactive,
    creatorId: input.creatorId,
    category: DEFAULT_MACHINE_CATEGORY,
    badgeRequirements
  });
};
