import type { PrismaClient } from '@prisma/client';
import type { VerificationTokenReadModel } from '../read-models/verification-token';
import { verificationTokenSelect } from '../selects/verification-token';

export class VerificationTokenRepository {
  constructor(private prisma: PrismaClient) {}

  async replaceToken(identifier: string, token: string, expires: Date): Promise<void> {
    await this.prisma.verificationToken.deleteMany({
      where: { identifier }
    });

    await this.prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires
      }
    });
  }

  async findByIdentifierAndToken(identifier: string, token: string): Promise<VerificationTokenReadModel | null> {
    return this.prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token
        }
      },
      select: verificationTokenSelect
    });
  }

  async deleteByIdentifier(identifier: string): Promise<void> {
    await this.prisma.verificationToken.deleteMany({
      where: { identifier }
    });
  }

  async deleteByIdentifierAndToken(identifier: string, token: string): Promise<void> {
    await this.prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier,
          token
        }
      }
    });
  }
}
