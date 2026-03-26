import type { AvatarSelection } from '@repo/avatar-system';
import { resolveAvatarSelection } from '@repo/avatar-system';
import { userRepository } from '@repo/db';
import type { Command } from '../../usecase';

export const updateAvatar: Command<[string, AvatarSelection], AvatarSelection> = async (userId, input) => {
  const avatar = resolveAvatarSelection(input);
  await userRepository.updateUserAvatar(userId, avatar);
  return avatar;
};
