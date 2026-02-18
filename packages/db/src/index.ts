import { PrismaClient, Profile, ConsentType, StudentProfile, ExternalProfile } from '@prisma/client';
import { EventRepository } from './repositories/event.repository';
import { MessageRepository } from './repositories/message.repository';
import { MachineRepository } from './repositories/machine.repository';
import { MachineReservationRepository } from './repositories/machine-reservation.repository';
import { OpenBadgeRepository } from './repositories/open-badge.repository';
import { UserRepository } from './repositories/user.repository';
import { VerificationTokenRepository } from './repositories/verification-token.repository';

const globalForPrisma = globalThis as unknown as { prismaClient: PrismaClient };

export const prismaClient = globalForPrisma.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaClient = prismaClient;

export * from './schemas';
export * from './user-role-record';
export * from './prisma-errors';

export const userRepository = new UserRepository(prismaClient);
export const eventRepository = new EventRepository(prismaClient);
export const messageRepository = new MessageRepository(prismaClient);
export const machineRepository = new MachineRepository(prismaClient);
export const machineReservationRepository = new MachineReservationRepository(prismaClient);
export const openBadgeRepository = new OpenBadgeRepository(prismaClient);
export const verificationTokenRepository = new VerificationTokenRepository(prismaClient);

export { PrismaClient, Profile, ConsentType, StudentProfile, ExternalProfile };
