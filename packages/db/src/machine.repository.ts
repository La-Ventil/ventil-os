import type { PrismaClient } from '@prisma/client';
import type { ActivityStatus } from '@prisma/client';
import type { MachineAdminSchema, MachineSchema } from './schemas/machine';

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

  async listMachinesForAdmin(): Promise<MachineAdminSchema[]> {
    const machines = await this.prisma.machine.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        status: true,
        room: {
          select: { name: true }
        },
        _count: {
          select: {
            badgeRequirements: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return machines as MachineAdminSchema[];
  }

  async createMachine(input: {
    name: string;
    category: string;
    description?: string | null;
    imageUrl?: string | null;
    status: ActivityStatus;
    creatorId: string;
  }): Promise<MachineSchema> {
    const machine = await this.prisma.machine.create({
      data: {
        name: input.name,
        category: input.category,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        status: input.status,
        creatorId: input.creatorId
      }
    });

    return machine as MachineSchema;
  }
}
