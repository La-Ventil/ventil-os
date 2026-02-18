import type { PrismaClient } from '@prisma/client';

export type VerificationTokenRecord = {
  identifier: string;
  token: string;
  expires: Date;
};

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

  async findByIdentifierAndToken(identifier: string, token: string): Promise<VerificationTokenRecord | null> {
    return this.prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token
        }
      }
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
