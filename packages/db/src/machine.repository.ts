import type { PrismaClient } from '@prisma/client';
import type { MachineViewModel } from '@repo/domain/view-models/machine';
import { mapMachineToViewModel, type MachineSchema } from './mappers/machine';

export class MachineRepository {
  constructor(private prisma: PrismaClient) {}

  async listMachines(): Promise<MachineViewModel[]> {
    const machines = await this.prisma.machine.findMany({
      orderBy: { name: 'asc' }
    });

    return machines.map((machine) => mapMachineToViewModel(machine as MachineSchema));
  }

  async getMachineById(id: string): Promise<MachineViewModel | null> {
    const machine = await this.prisma.machine.findUnique({ where: { id } });

    return machine ? mapMachineToViewModel(machine as MachineSchema) : null;
  }
}
