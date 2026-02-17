import type { EducationLevel } from './education-level';
import type { Email } from './email';
import type { ProfileType } from './profile-type';

export type UserProfile = {
  id: string;
  profile: ProfileType;
  email: Email;
  pendingEmail?: Email | null;
  image?: string | null;
  username: string;
  educationLevel?: EducationLevel | null;
  lastName?: string;
  firstName: string;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
};
