import { messageRepository } from '@repo/db';
import type { MessageReadModel } from '@repo/db/schemas';

export const createMessage = async (content: string): Promise<MessageReadModel> =>
  messageRepository.createMessage(content);
