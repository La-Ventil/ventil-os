import type { Prisma } from '@prisma/client';
import type { EducationLevel } from '@repo/domain/user/education-level';
import type { Email } from '@repo/domain/user/email';
import type { UserRole } from '@repo/domain/user/user-role';

export type UserProfileSchemaRaw = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    pendingEmail: true;
    emailVerified: true;
    image: true;
    profile: true;
    studentProfile: true;
    externalProfile: true;
    username: true;
    educationLevel: true;
    pedagogicalAdmin: true;
    globalAdmin: true;
    lastName: true;
    firstName: true;
  };
}>;

export type UserProfileSchema = Omit<
  UserProfileSchemaRaw,
  'email' | 'pendingEmail' | 'educationLevel' | 'profile' | 'studentProfile' | 'externalProfile'
> & {
  email: Email;
  pendingEmail: Email | null;
  educationLevel: EducationLevel | null;
  profile: UserRole;
};
