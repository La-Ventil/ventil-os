import type { PrismaClient } from '@prisma/client';
import type { MessageReadModel } from '../schemas/message';

export class MessageRepository {
  constructor(private prisma: PrismaClient) {}

  async createMessage(content: string): Promise<MessageReadModel> {
    return this.prisma.message.create({
      data: { content }
    });
  }
}
