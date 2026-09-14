import { hashSecret } from '@repo/crypto';
import type { PrismaClient } from '@repo/db/client';
import { getE2EPrismaClient } from './e2e-prisma';

const MAILPIT_BASE_URL = process.env.MAILPIT_BASE_URL ?? 'http://127.0.0.1:8025';
const RESET_PASSWORD_URL_PATTERN = /\/update-password\/([^\s]+)/i;
const VERIFY_EMAIL_URL_PATTERN = /\/verify-email\/([^\s?]+)/i;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class AuthTestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Waits for a mail sent to `email` after `since` and pulls the token out of its link.
   *
   * The `since` bound is what makes this reliable: mails are sent without being awaited, and
   * Mailpit keeps everything from earlier runs, so the newest mail for an address is not
   * necessarily the one the test just triggered — and an older token has since been invalidated.
   */
  private async findTokenInMail(email: string, pattern: RegExp, since: Date, label: string): Promise<string> {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const response = await fetch(`${MAILPIT_BASE_URL}/api/v1/messages`);
      if (!response.ok) {
        throw new Error(`Mailpit message listing failed with status ${response.status}`);
      }

      const payload = (await response.json()) as {
        messages?: Array<{ ID: string; Created?: string; To?: Array<{ Address?: string | null }> }>;
      };

      const message = payload.messages?.find(
        (entry) =>
          entry.To?.some((recipient) => recipient.Address?.toLowerCase() === email.toLowerCase()) &&
          entry.Created !== undefined &&
          new Date(entry.Created).getTime() >= since.getTime()
      );

      if (message?.ID) {
        const detailResponse = await fetch(`${MAILPIT_BASE_URL}/api/v1/message/${message.ID}`);
        if (!detailResponse.ok) {
          throw new Error(`Mailpit message detail failed with status ${detailResponse.status}`);
        }

        const detail = (await detailResponse.json()) as { Text?: string | null };
        const token = detail.Text?.match(pattern)?.[1];
        if (token) {
          return token;
        }
      }

      await sleep(250);
    }

    throw new Error(`No ${label} email found for ${email} after ${since.toISOString()}`);
  }

  async getResetTokenByEmail(email: string, since: Date): Promise<string> {
    return this.findTokenInMail(email, RESET_PASSWORD_URL_PATTERN, since, 'password reset');
  }

  async getEmailVerificationToken(email: string, since: Date): Promise<string> {
    return this.findTokenInMail(email, VERIFY_EMAIL_URL_PATTERN, since, 'verification');
  }

  async isEmailVerifiedByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true }
    });

    return Boolean(user?.emailVerified);
  }

  /** Lets a test put back a password it changed, so the next spec still knows how to sign in. */
  async setPasswordByEmail(email: string, password: string): Promise<void> {
    const { salt, hashedSecret, iterations } = await hashSecret(password);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedSecret, salt, iterations }
    });
  }

  async setEmailVerifiedByEmail(email: string, verified: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { emailVerified: verified ? new Date() : null }
    });
  }

  async deleteVerificationTokens(email: string): Promise<void> {
    await this.prisma.verificationToken.deleteMany({ where: { identifier: email } });
  }

  async setBlockedByEmail(email: string, blocked: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { blocked }
    });
  }

  async getAdminFlagsByEmail(email: string): Promise<{ globalAdmin: boolean; pedagogicalAdmin: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { globalAdmin: true, pedagogicalAdmin: true }
    });

    if (!user) {
      throw new Error(`User not found for email ${email}`);
    }

    return user;
  }

  async setAdminFlagsByEmail(email: string, flags: { globalAdmin: boolean; pedagogicalAdmin: boolean }): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: flags
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
