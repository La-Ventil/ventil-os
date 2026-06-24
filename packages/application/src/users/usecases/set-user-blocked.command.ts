import { userRepository } from '@repo/db';
import { isAdmin } from '@repo/domain/authorization';
import { UserError } from '@repo/domain/user/user-errors';
import type { Command } from '../../usecase';

export type SetUserBlockedInput = {
  actorUserId: string;
  userId: string;
  blocked: boolean;
};

type SetUserBlockedResult = Awaited<ReturnType<typeof userRepository.setUserBlocked>>;

export const setUserBlocked: Command<[SetUserBlockedInput], SetUserBlockedResult> = async (
  input: SetUserBlockedInput
) => {
  const targetUser = await userRepository.getUserProfileById(input.userId);
  if (!targetUser) {
    throw new UserError('user.notFound');
  }

  if (input.blocked) {
    if (input.actorUserId === input.userId) {
      throw new UserError('user.cannotBlockSelf');
    }

    if (isAdmin(targetUser)) {
      throw new UserError('user.cannotBlockAdmin');
    }
  }

  return userRepository.setUserBlocked(input.userId, input.blocked);
};
