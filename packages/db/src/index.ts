import {
  createPrismaClient,
  Profile,
  ConsentType,
  StudentProfile,
  ExternalProfile,
  type PrismaClient
} from './prisma-client';
import { EventRepository } from './repositories/event.repository';
import { MessageRepository } from './repositories/message.repository';
import { MachineRepository } from './repositories/machine.repository';
import { MachineReservationRepository } from './repositories/machine-reservation.repository';
import { OpenBadgeRepository } from './repositories/open-badge.repository';
import { UserRepository } from './repositories/user.repository';
import { VerificationTokenRepository } from './repositories/verification-token.repository';

const globalForPrisma = globalThis as unknown as { prismaClient: PrismaClient };

// Cached on globalThis in every environment: Next bundles this module into several server chunks, and each
// copy would otherwise open its own pool and load its own query compiler. In dev it also survives hot reloads.
export const prismaClient = (globalForPrisma.prismaClient ??= createPrismaClient());

export * from './read-models';
export * from './selects';
export * from './user-role-record';
export * from './prisma-errors';

export const userRepository = new UserRepository(prismaClient);
export const eventRepository = new EventRepository(prismaClient);
export const messageRepository = new MessageRepository(prismaClient);
export const machineRepository = new MachineRepository(prismaClient);
export const machineReservationRepository = new MachineReservationRepository(prismaClient);
export const openBadgeRepository = new OpenBadgeRepository(prismaClient);
export const verificationTokenRepository = new VerificationTokenRepository(prismaClient);

export { type PrismaClient, Profile, ConsentType, StudentProfile, ExternalProfile };
