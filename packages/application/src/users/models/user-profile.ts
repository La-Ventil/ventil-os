import type { UserProfile as DomainUserProfile } from '@repo/domain/user/user-profile';
import type { AvatarSelection } from '@repo/avatar-system';

export type UserProfile = DomainUserProfile & {
  avatar: AvatarSelection;
  fullName: string;
};
