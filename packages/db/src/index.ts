import { PrismaClient, Prisma, Profile, ConsentType } from '@prisma/client';
import { EventRepository } from './event.repository';
import { MachineRepository } from './machine.repository';
import { OpenBadgeRepository } from './open-badge.repository';
import { UserRepository } from './user.repository';

const globalForPrisma = globalThis as unknown as { prismaClient: PrismaClient }

export const prismaClient = globalForPrisma.prismaClient || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaClient = prismaClient

export * from "@prisma/client";
export * from "./mappers";

export const userRepository = new UserRepository(prismaClient);
export const eventRepository = new EventRepository(prismaClient);
export const machineRepository = new MachineRepository(prismaClient);
export const openBadgeRepository = new OpenBadgeRepository(prismaClient);

export { PrismaClient, Prisma, Profile, ConsentType };
