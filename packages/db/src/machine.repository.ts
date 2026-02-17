import type { PrismaClient, ActivityStatus as PrismaActivityStatus } from '@prisma/client';
import { toActivityStatus, type ActivityStatus } from '@repo/domain/activity-status';
import { toOpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';
import type { MachineAdminSchema, MachineDetailsSchema, MachineSchema } from './schemas';
import type { MachineAdminSchemaRaw, MachineSchemaRaw } from './schemas/machine';
import type { MachineDetailsSchemaRaw } from './schemas/machine-details';

export class MachineRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeMachine(machine: MachineSchemaRaw): MachineSchema {
    return {
      ...machine,
      status: toActivityStatus(machine.status)
    };
  }

  private normalizeMachineAdmin(machine: MachineAdminSchemaRaw): MachineAdminSchema {
    return {
      ...machine,
      status: toActivityStatus(machine.status)
    };
  }

  private normalizeMachineDetails(machine: MachineDetailsSchemaRaw): MachineDetailsSchema {
    return {
      ...machine,
      status: toActivityStatus(machine.status),
      badgeRequirements: machine.badgeRequirements.map((requirement) => ({
        ...requirement,
        ruleType: toOpenBadgeRequirementRule(requirement.ruleType)
      }))
    };
  }

  async listMachines(): Promise<MachineSchema[]> {
    const machines = await this.prisma.machine.findMany({
      orderBy: { name: 'asc' }
    });

    return machines.map((machine) => this.normalizeMachine(machine as MachineSchemaRaw));
  }

  async getMachineById(id: string): Promise<MachineSchema | null> {
    const machine = await this.prisma.machine.findUnique({ where: { id } });

    return machine ? this.normalizeMachine(machine as MachineSchemaRaw) : null;
  }

  async getMachineDetailsById(id: string): Promise<MachineDetailsSchema | null> {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      select: {
        id: true,
        category: true,
        name: true,
        description: true,
        imageUrl: true,
        status: true,
        room: {
          select: { name: true }
        },
        badgeRequirements: {
          select: {
            id: true,
            ruleType: true,
            requiredOpenBadge: {
              select: { id: true, name: true, type: true, coverImage: true }
            },
            requiredOpenBadgeLevel: {
              select: { id: true, title: true, level: true }
            }
          }
        }
      }
    });

    return machine ? this.normalizeMachineDetails(machine as MachineDetailsSchemaRaw) : null;
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

    return machines.map((machine) => this.normalizeMachineAdmin(machine as MachineAdminSchemaRaw));
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
        status: input.status as PrismaActivityStatus,
        creatorId: input.creatorId
      }
    });

    return this.normalizeMachine(machine as MachineSchemaRaw);
  }

  async deleteMachine(id: string): Promise<{ id: string }> {
    return this.prisma.machine.delete({
      where: { id },
      select: { id: true }
    });
  }
}
