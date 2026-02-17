import type { Email } from './email';
import type { ProfileType } from './profile-type';
import type { UserStats } from './user-stats';

export type UserAdmin = {
  id: string;
  email: Email;
  firstName: string;
  lastName?: string;
  username: string;
  profile: ProfileType;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
  stats: UserStats;
};
