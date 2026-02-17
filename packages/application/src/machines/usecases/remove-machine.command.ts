import { machineRepository } from '@repo/db';
import type { Command } from '../../usecase';

export type RemoveMachineResult = { ok: true } | { ok: false; reason: 'not-found' };

export const removeMachine: Command<[string], RemoveMachineResult> = async (machineId: string) => {
  const existing = await machineRepository.getMachineById(machineId);
  if (!existing) {
    return { ok: false, reason: 'not-found' };
  }

  await machineRepository.deleteMachine(machineId);
  return { ok: true };
};
