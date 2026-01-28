import type { Email } from '@repo/domain/email';
import type { ProfileType } from '@repo/domain/profile-type';

export type UserAdminViewModel = {
  id: string;
  email: Email;
  firstName: string;
  lastName?: string;
  username: string;
  profile: ProfileType;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
  eventsCount: number;
  openBadgesCount: number;
  machinesCount: number;
};
