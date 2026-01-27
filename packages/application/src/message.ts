import { messageRepository } from '@repo/db';
import type { MessageSchema } from '@repo/db/schemas';

export const createMessage = async (content: string): Promise<MessageSchema> =>
  messageRepository.createMessage(content);
