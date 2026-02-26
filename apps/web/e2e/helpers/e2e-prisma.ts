import { PrismaClient } from '@prisma/client';
import { resolveE2EDatabaseTarget } from './e2e-db';

const prismaClientsBySlot = new Map<string, PrismaClient>();

export function getE2EPrismaClient(dbSlot?: string): PrismaClient {
  const target = resolveE2EDatabaseTarget(dbSlot);
  const cachedClient = prismaClientsBySlot.get(target.slot);

  if (cachedClient) {
    return cachedClient;
  }

  const client = new PrismaClient({
    datasources: {
      db: {
        url: target.url
      }
    }
  });

  prismaClientsBySlot.set(target.slot, client);
  return client;
}

