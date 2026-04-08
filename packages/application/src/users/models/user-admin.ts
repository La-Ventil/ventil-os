import type { UserAdmin } from '@repo/domain/user/user-admin';
import type { AvatarSelection } from '@repo/avatar-system';

export type UserAdminViewModel = UserAdmin & {
  avatar: AvatarSelection | null;
  fullName: string;
};
