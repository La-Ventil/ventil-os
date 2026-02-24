import type { PrismaClient, ActivityStatus as PrismaActivityStatus } from '@prisma/client';
import { toActivityStatus, type ActivityStatus } from '@repo/domain/activity-status';
import { Machine, MachineReservationSlot } from '@repo/domain/machine/machine';
import { toOpenBadgeRequirementRule } from '@repo/domain/badge/open-badge-requirement-rule';
import type { MachineAdminReadModel, MachineDetailsReadModel, MachineSummaryReadModel } from '../read-models';
import { machineAdminSelect, machineSummarySelect } from '../selects/machine';
import { machineReservationSlotSelect, type MachineReservationSlotPayload } from '../selects/machine-reservation';
import { machineDetailsSelect } from '../selects/machine-details';
import type { MachineAdminPayload, MachineSummaryPayload } from '../selects/machine';
import type { MachineDetailsPayload } from '../selects/machine-details';

export class MachineRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeMachineSummary(machine: MachineSummaryPayload): MachineSummaryReadModel {
    return {
      ...machine,
      status: toActivityStatus(machine.status)
    };
  }

  private normalizeMachineAdmin(machine: MachineAdminPayload): MachineAdminReadModel {
    return {
      ...machine,
      status: toActivityStatus(machine.status)
    };
  }

  private normalizeMachineDetails(machine: MachineDetailsPayload): MachineDetailsReadModel {
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

    return machines.map((machine) => this.normalizeMachineSummary(machine as MachineSummaryPayload));
  }

  async getMachineById(id: string): Promise<MachineSummaryReadModel | null> {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      select: machineSummarySelect
    });

    return machine ? this.normalizeMachineSummary(machine as MachineSummaryPayload) : null;
  }

  async getMachineDetailsById(id: string): Promise<MachineDetailsReadModel | null> {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      select: machineDetailsSelect
    });

    return machine ? this.normalizeMachineDetails(machine as MachineDetailsPayload) : null;
  }

  async listMachinesForAdmin(): Promise<MachineAdminReadModel[]> {
    const machines = await this.prisma.machine.findMany({
      select: machineAdminSelect,
      orderBy: { name: 'asc' }
    });

    return machines.map((machine) => this.normalizeMachineAdmin(machine as MachineAdminPayload));
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

  async updateMachine(input: {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    status: ActivityStatus;
  }): Promise<{ id: string }> {
    const machine = await this.prisma.machine.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        status: input.status as PrismaActivityStatus
      },
      select: { id: true }
    });

    return { id: machine.id };
  }

  async setMachineStatus(
    id: string,
    status: ActivityStatus
  ): Promise<{ id: string; status: ActivityStatus }> {
    const machine = await this.prisma.machine.update({
      where: { id },
      data: { status: status as PrismaActivityStatus },
      select: { id: true, status: true }
    });

    return { id: machine.id, status: toActivityStatus(machine.status) };
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

    const reservations = (machine.reservations as MachineReservationSlotPayload[]).map((reservation) =>
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
