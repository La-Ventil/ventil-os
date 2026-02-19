import type { EducationLevel } from '@repo/domain/user/education-level';
import type { Email } from '@repo/domain/user/email';
import type { UserRole } from '@repo/domain/user/user-role';
import type { UserCredentialsPayload } from '../selects/user-credentials';

export type UserCredentialsReadModel = Omit<
  UserCredentialsPayload,
  'email' | 'educationLevel' | 'profile' | 'studentProfile' | 'externalProfile' | 'lastName'
> & {
  email: Email;
  educationLevel: EducationLevel | null;
  profile: UserRole;
  lastName: string;
};
