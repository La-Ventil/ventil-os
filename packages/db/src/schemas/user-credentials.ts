import type { Prisma } from '@prisma/client';
import type { EducationLevel } from '@repo/domain/user/education-level';
import type { Email } from '@repo/domain/user/email';
import type { UserRole } from '@repo/domain/user/user-role';

export const selectUserCredentialsSchemaRaw = {
  id: true,
  email: true,
  emailVerified: true,
  image: true,
  password: true,
  salt: true,
  iterations: true,
  profile: true,
  studentProfile: true,
  externalProfile: true,
  username: true,
  educationLevel: true,
  pedagogicalAdmin: true,
  globalAdmin: true,
  lastName: true,
  firstName: true
} as const;

export type UserCredentialsSchemaRaw = Prisma.UserGetPayload<{
  select: typeof selectUserCredentialsSchemaRaw;
}>;

export type UserCredentialsSchema = Omit<
  UserCredentialsSchemaRaw,
  'email' | 'educationLevel' | 'profile' | 'studentProfile' | 'externalProfile'
> & {
  email: Email;
  educationLevel: EducationLevel | null;
  profile: UserRole;
};
