import { ExternalProfile, Profile, StudentProfile } from '@repo/db';
import { UserRole, deriveUserRole } from '@repo/domain/user/user-role';
import { Email } from '@repo/domain/user/email';
import { parseEducationLevel } from '@repo/domain/user/education-level';
import { User } from '@repo/domain/user/user';

export type DomainUserRecord = {
  id: string;
  email: string;
  pendingEmail: string | null;
  emailVerified: Date | null;
  image: string | null;
  username: string;
  educationLevel: string | null;
  lastName: string | null;
  firstName: string;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
  profile: Profile;
  studentProfile: StudentProfile | null;
  externalProfile: ExternalProfile | null;
};

export const selectDomainUser = {
  id: true,
  email: true,
  pendingEmail: true,
  emailVerified: true,
  image: true,
  username: true,
  educationLevel: true,
  lastName: true,
  firstName: true,
  globalAdmin: true,
  pedagogicalAdmin: true,
  profile: true,
  studentProfile: true,
  externalProfile: true
} as const;

export const toDomainUser = (user: DomainUserRecord): User =>
  User.from({
    id: user.id,
    profile: deriveUserRole(user),
    email: Email.from(user.email),
    pendingEmail: user.pendingEmail ? Email.from(user.pendingEmail) : null,
    emailVerifiedAt: user.emailVerified ?? null,
    image: user.image ?? null,
    username: user.username,
    educationLevel: parseEducationLevel(user.educationLevel),
    lastName: user.lastName,
    firstName: user.firstName,
    globalAdmin: user.globalAdmin,
    pedagogicalAdmin: user.pedagogicalAdmin
  });

export const resolveProfile = (profileType: string) => {
  let profile: Profile = Profile.student;
  let studentProfile: StudentProfile | null = null;
  let externalProfile: ExternalProfile | null = null;

  switch (profileType) {
    case UserRole.Member:
      profile = Profile.student;
      studentProfile = StudentProfile.member;
      break;
    case UserRole.Alumni:
      profile = Profile.student;
      studentProfile = StudentProfile.alumni;
      break;
    case UserRole.Teacher:
      profile = Profile.teacher;
      break;
    case UserRole.Contributor:
      profile = Profile.external;
      externalProfile = ExternalProfile.contributor;
      break;
    case UserRole.Visitor:
      profile = Profile.external;
      externalProfile = ExternalProfile.visitor;
      break;
    default:
      profile = Profile.student;
      studentProfile = StudentProfile.visitor;
  }

  return { profile, studentProfile, externalProfile };
};

export const isUniqueConstraintError = (error: unknown): error is { code: string } => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return 'code' in error && (error as { code?: string }).code === 'P2002';
};
