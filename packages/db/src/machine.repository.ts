import type { PrismaClient } from '@prisma/client';
import type { MachineSchema } from './schemas/machine';

export class MachineRepository {
  constructor(private prisma: PrismaClient) {}

  async listMachines(): Promise<MachineSchema[]> {
    const machines = await this.prisma.machine.findMany({
      orderBy: { name: 'asc' }
    });

    return machines as MachineSchema[];
  }

  async getMachineById(id: string): Promise<MachineSchema | null> {
    const machine = await this.prisma.machine.findUnique({ where: { id } });

    return machine ? (machine as MachineSchema) : null;
  }
}
