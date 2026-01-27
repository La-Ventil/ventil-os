import type { PrismaClient } from '@prisma/client';
import type { MessageSchema } from './schemas/message';

export class MessageRepository {
  constructor(private prisma: PrismaClient) {}

  async createMessage(content: string): Promise<MessageSchema> {
    return this.prisma.message.create({
      data: { content }
    });
  }
}
