import type { Email } from '@repo/domain/user/email';
import type { UserRole } from '@repo/domain/user/user-role';
import type { UserStats } from '@repo/domain/user/user-stats';
import type { UserAdminPayload } from '../selects/user-admin';

export type UserAdminReadModel = Omit<
  UserAdminPayload,
  'email' | 'profile' | 'studentProfile' | 'externalProfile' | 'lastName' | '_count'
> & {
  email: Email;
  profile: UserRole;
  lastName: string;
  stats: UserStats;
};
