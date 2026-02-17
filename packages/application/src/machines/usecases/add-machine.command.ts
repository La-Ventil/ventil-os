import { machineRepository } from '@repo/db';
import { ActivityStatus } from '@repo/domain/activity-status';
import type { Command } from '../../usecase';

const DEFAULT_MACHINE_CATEGORY = 'Machine';

export type AddMachineInput = {
  name: string;
  description: string;
  imageUrl: string;
  activationEnabled: boolean;
  creatorId: string;
};

type AddMachineResult = Awaited<ReturnType<typeof machineRepository.createMachine>>;

export const addMachine: Command<[AddMachineInput], AddMachineResult> = async (input: AddMachineInput) =>
  machineRepository.createMachine({
    name: input.name,
    description: input.description,
    imageUrl: input.imageUrl,
    status: input.activationEnabled ? ActivityStatus.Active : ActivityStatus.Inactive,
    creatorId: input.creatorId,
    category: DEFAULT_MACHINE_CATEGORY
  });
