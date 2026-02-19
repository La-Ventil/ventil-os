import type { EducationLevel } from '@repo/domain/user/education-level';
import type { Email } from '@repo/domain/user/email';
import type { UserRole } from '@repo/domain/user/user-role';
import type { UserProfilePayload } from '../selects/user-profile';

export type UserProfileReadModel = Omit<
  UserProfilePayload,
  'email' | 'pendingEmail' | 'educationLevel' | 'profile' | 'studentProfile' | 'externalProfile' | 'lastName'
> & {
  email: Email;
  pendingEmail: Email | null;
  educationLevel: EducationLevel | null;
  profile: UserRole;
  lastName: string;
};
