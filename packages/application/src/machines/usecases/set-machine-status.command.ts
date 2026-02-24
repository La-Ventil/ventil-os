import { machineRepository } from '@repo/db';
import type { ActivityStatus } from '@repo/domain/activity-status';
import type { Command } from '../../usecase';

export type SetMachineStatusInput = {
  id: string;
  status: ActivityStatus;
};

type SetMachineStatusResult = Awaited<ReturnType<typeof machineRepository.setMachineStatus>>;

export const setMachineStatus: Command<[SetMachineStatusInput], SetMachineStatusResult> = async (
  input: SetMachineStatusInput
) => {
  const current = await machineRepository.getMachineById(input.id);
  if (!current) {
    throw new Error('machine.update.notFound');
  }

  return machineRepository.setMachineStatus(input.id, input.status);
};
