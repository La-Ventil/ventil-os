import type { Email } from '@repo/domain/user/email';
import type { UserRole } from '@repo/domain/user/user-role';
import type { UserAdminPayload } from '../selects/user-admin';

export type UserAdminReadModel = Omit<
  UserAdminPayload,
  'email' | 'profile' | 'studentProfile' | 'externalProfile' | 'lastName'
> & {
  email: Email;
  profile: UserRole;
  lastName: string;
};
