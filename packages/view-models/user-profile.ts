import type { EducationLevel } from '@repo/domain/education-level';
import type { Email } from '@repo/domain/email';
import type { ProfileType } from '@repo/domain/profile-type';

export interface UserProfile {
  id: string;
  profile: ProfileType;
  email: Email;
  image?: string | null;
  username: string;
  educationLevel?: EducationLevel | null;
  lastName?: string;
  firstName: string;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
}
