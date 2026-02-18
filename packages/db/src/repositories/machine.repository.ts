import type { PrismaClient, ActivityStatus as PrismaActivityStatus } from '@prisma/client';
import { toActivityStatus, type ActivityStatus } from '@repo/domain/activity-status';
import { Machine, MachineReservationSlot } from '@repo/domain/machine/machine';
import { toOpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';
import type { MachineAdminSchema, MachineDetailsSchema, MachineSummarySchema } from '../schemas';
import { selectMachineAdminSchemaRaw, selectMachineSummarySchemaRaw } from '../schemas/machine';
import {
  selectMachineReservationSlotSchemaRaw,
  type MachineReservationSlotSchemaRaw
} from '../schemas/machine-reservation';
import { selectMachineDetailsSchemaRaw } from '../schemas/machine-details';
import type { MachineAdminSchemaRaw, MachineSummarySchemaRaw } from '../schemas/machine';
import type { MachineDetailsSchemaRaw } from '../schemas/machine-details';

export class MachineRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeMachineSummary(machine: MachineSummarySchemaRaw): MachineSummarySchema {
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
        id: requirement.id,
        rule: toOpenBadgeRequirementRule(requirement.rule),
        openBadge: {
          id: requirement.requiredOpenBadge.id,
          name: requirement.requiredOpenBadge.name,
          type: requirement.requiredOpenBadge.type ?? null,
          imageUrl: requirement.requiredOpenBadge.coverImage ?? null
        },
        level: requirement.requiredOpenBadgeLevel
          ? {
              id: requirement.requiredOpenBadgeLevel.id,
              title: requirement.requiredOpenBadgeLevel.title ?? null,
              level: requirement.requiredOpenBadgeLevel.level
            }
          : null
      }))
    };
  }

  async listMachines(): Promise<MachineSummarySchema[]> {
    const machines = await this.prisma.machine.findMany({
      select: selectMachineSummarySchemaRaw,
      orderBy: { name: 'asc' }
    });

    return machines.map((machine) => this.normalizeMachineSummary(machine as MachineSummarySchemaRaw));
  }

  async getMachineById(id: string): Promise<MachineSummarySchema | null> {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      select: selectMachineSummarySchemaRaw
    });

    return machine ? this.normalizeMachineSummary(machine as MachineSummarySchemaRaw) : null;
  }

  async getMachineDetailsById(id: string): Promise<MachineDetailsSchema | null> {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      select: selectMachineDetailsSchemaRaw
    });

    return machine ? this.normalizeMachineDetails(machine as MachineDetailsSchemaRaw) : null;
  }

  async listMachinesForAdmin(): Promise<MachineAdminSchema[]> {
    const machines = await this.prisma.machine.findMany({
      select: selectMachineAdminSchemaRaw,
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
  }): Promise<MachineSummarySchema> {
    const machine = await this.prisma.machine.create({
      data: {
        name: input.name,
        category: input.category,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        status: input.status as PrismaActivityStatus,
        creatorId: input.creatorId
      },
      select: selectMachineSummarySchemaRaw
    });

    return this.normalizeMachineSummary(machine as MachineSummarySchemaRaw);
  }

  async deleteMachine(id: string): Promise<{ id: string }> {
    return this.prisma.machine.delete({
      where: { id },
      select: { id: true }
    });
  }

  async getReservableMachine(
    machineId: string,
    windowStart: Date,
    windowEnd: Date
  ): Promise<Machine | null> {
    const machine = await this.prisma.machine.findUnique({
      where: { id: machineId },
      select: {
        ...selectMachineSummarySchemaRaw,
        reservations: {
          where: {
            startsAt: {
              lt: windowEnd
            },
            endsAt: {
              gt: windowStart
            }
          },
          select: selectMachineReservationSlotSchemaRaw
        }
      }
    });

    if (!machine) {
      return null;
    }

    const reservations = (machine.reservations as MachineReservationSlotSchemaRaw[]).map((reservation) =>
      MachineReservationSlot.from(reservation)
    );

    return Machine.from({
      id: machine.id,
      name: machine.name,
      category: machine.category,
      status: toActivityStatus(machine.status),
      description: machine.description ?? null,
      imageUrl: machine.imageUrl ?? null,
      reservations
    });
  }
}
