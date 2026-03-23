import type { PrismaClient } from '@prisma/client';
import { getE2EPrismaClient } from './e2e-prisma';

const MAILPIT_BASE_URL = process.env.MAILPIT_BASE_URL ?? 'http://127.0.0.1:8025';
const RESET_PASSWORD_URL_PATTERN = /\/update-password\/([^\s]+)/i;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class AuthTestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getResetTokenByEmail(email: string): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await fetch(`${MAILPIT_BASE_URL}/api/v1/messages`);
      if (!response.ok) {
        throw new Error(`Mailpit message listing failed with status ${response.status}`);
      }

      const payload = (await response.json()) as {
        messages?: Array<{ ID: string; To?: Array<{ Address?: string | null }> }>;
      };

      const message = payload.messages?.find((entry) =>
        entry.To?.some((recipient) => recipient.Address?.toLowerCase() === email.toLowerCase())
      );

      if (message?.ID) {
        const detailResponse = await fetch(`${MAILPIT_BASE_URL}/api/v1/message/${message.ID}`);
        if (!detailResponse.ok) {
          throw new Error(`Mailpit message detail failed with status ${detailResponse.status}`);
        }

        const detail = (await detailResponse.json()) as { Text?: string | null };
        const token = detail.Text?.match(RESET_PASSWORD_URL_PATTERN)?.[1];
        if (token) {
          return token;
        }
      }

      await sleep(250);
    }

    throw new Error(`No reset token email found for ${email}`);
  }

  async setBlockedByEmail(email: string, blocked: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { blocked }
    });
  }
}

const repositoriesBySlot = new Map<string, AuthTestRepository>();

export const getAuthTestRepository = (dbSlot?: string): AuthTestRepository => {
  const key = dbSlot?.trim() || process.env.PLAYWRIGHT_DB_SLOT?.trim() || 'default';
  const cached = repositoriesBySlot.get(key);

  if (cached) {
    return cached;
  }

  const repository = new AuthTestRepository(getE2EPrismaClient(key));
  repositoriesBySlot.set(key, repository);
  return repository;
};
