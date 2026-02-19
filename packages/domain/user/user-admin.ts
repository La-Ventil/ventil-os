import type { Email } from './email';
import type { UserRole } from './user-role';
import type { UserStats } from './user-stats';

export type UserAdmin = {
  id: string;
  email: Email;
  firstName: string;
  lastName: string;
  username: string;
  profile: UserRole;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
  stats: UserStats;
};
