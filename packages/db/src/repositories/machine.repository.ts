import type { PrismaClient, ActivityStatus as PrismaActivityStatus } from '@prisma/client';
import { toActivityStatus, type ActivityStatus } from '@repo/domain/activity-status';
import { Machine, MachineReservationSlot } from '@repo/domain/machine/machine';
import { toOpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';
import type { MachineAdminReadModel, MachineDetailsReadModel, MachineSummaryReadModel } from '../schemas';
import { machineAdminSelect, machineSummarySelect } from '../schemas/machine';
import {
  machineReservationSlotSelect,
  type MachineReservationSlotRow
} from '../schemas/machine-reservation';
import { machineDetailsSelect } from '../schemas/machine-details';
import type { MachineAdminRow, MachineSummaryRow } from '../schemas/machine';
import type { MachineDetailsRow } from '../schemas/machine-details';

export class MachineRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeMachineSummary(machine: MachineSummaryRow): MachineSummaryReadModel {
    return {
      ...machine,
      status: toActivityStatus(machine.status)
    };
  }

  private normalizeMachineAdmin(machine: MachineAdminRow): MachineAdminReadModel {
    return {
      ...machine,
      status: toActivityStatus(machine.status)
    };
  }

  private normalizeMachineDetails(machine: MachineDetailsRow): MachineDetailsReadModel {
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

  async listMachines(): Promise<MachineSummaryReadModel[]> {
    const machines = await this.prisma.machine.findMany({
      select: machineSummarySelect,
      orderBy: { name: 'asc' }
    });

    return machines.map((machine) => this.normalizeMachineSummary(machine as MachineSummaryRow));
  }

  async getMachineById(id: string): Promise<MachineSummaryReadModel | null> {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      select: machineSummarySelect
    });

    return machine ? this.normalizeMachineSummary(machine as MachineSummaryRow) : null;
  }

  async getMachineDetailsById(id: string): Promise<MachineDetailsReadModel | null> {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      select: machineDetailsSelect
    });

    return machine ? this.normalizeMachineDetails(machine as MachineDetailsRow) : null;
  }

  async listMachinesForAdmin(): Promise<MachineAdminReadModel[]> {
    const machines = await this.prisma.machine.findMany({
      select: machineAdminSelect,
      orderBy: { name: 'asc' }
    });

    return machines.map((machine) => this.normalizeMachineAdmin(machine as MachineAdminRow));
  }

  async createMachine(input: {
    name: string;
    category: string;
    description?: string | null;
    imageUrl?: string | null;
    status: ActivityStatus;
    creatorId: string;
  }): Promise<{ id: string }> {
    const machine = await this.prisma.machine.create({
      data: {
        name: input.name,
        category: input.category,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        status: input.status as PrismaActivityStatus,
        creatorId: input.creatorId
      },
      select: { id: true }
    });

    return { id: machine.id };
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
        ...machineSummarySelect,
        reservations: {
          where: {
            startsAt: {
              lt: windowEnd
            },
            endsAt: {
              gt: windowStart
            }
          },
          select: machineReservationSlotSelect
        }
      }
    });

    if (!machine) {
      return null;
    }

    const reservations = (machine.reservations as MachineReservationSlotRow[]).map((reservation) =>
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
