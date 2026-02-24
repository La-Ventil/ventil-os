import { userRepository } from '@repo/db';
import type { Command } from '../../usecase';

export type SetUserBlockedInput = {
  userId: string;
  blocked: boolean;
};

type SetUserBlockedResult = Awaited<ReturnType<typeof userRepository.setUserBlocked>>;

export const setUserBlocked: Command<[SetUserBlockedInput], SetUserBlockedResult> = async (
  input: SetUserBlockedInput
) => userRepository.setUserBlocked(input.userId, input.blocked);
