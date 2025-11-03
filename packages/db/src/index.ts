import { PrismaClient, Prisma, Profil, ConsentementType } from "@prisma/client"
import {UtilisateurRepository} from "./utilisateur.repository";

const globalForPrisma = globalThis as unknown as { prismaClient: PrismaClient }

export const prismaClient = globalForPrisma.prismaClient || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaClient = prismaClient

export * from "@prisma/client";

export const utilisateurRepository = new UtilisateurRepository(prismaClient);

export { PrismaClient, Prisma, Profil, ConsentementType };
