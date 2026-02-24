import { machineRepository } from '@repo/db';
import { ActivityStatus } from '@repo/domain/activity-status';
import type { Command } from '../../usecase';

export type UpdateMachineInput = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  activationEnabled: boolean;
};

type UpdateMachineResult = Awaited<ReturnType<typeof machineRepository.updateMachine>>;

export const updateMachine: Command<[UpdateMachineInput], UpdateMachineResult> = async (
  input: UpdateMachineInput
) => {
  const current = await machineRepository.getMachineById(input.id);
  if (!current) {
    throw new Error('machine.update.notFound');
  }

  const imageUrl = input.imageUrl !== undefined ? input.imageUrl : current.imageUrl ?? null;

  return machineRepository.updateMachine({
    id: input.id,
    name: input.name,
    description: input.description,
    imageUrl,
    status: input.activationEnabled ? ActivityStatus.Active : ActivityStatus.Inactive
  });
};
