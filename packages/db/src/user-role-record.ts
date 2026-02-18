import { ExternalProfile, Profile, StudentProfile } from '@prisma/client';
import { UserRole } from '@repo/domain/user/user-role';

export type UserProfileRecord = {
  profile: Profile;
  studentProfile: StudentProfile | null;
  externalProfile: ExternalProfile | null;
};

export const mapUserRoleToProfileRecord = (role: UserRole): UserProfileRecord => {
  switch (role) {
    case UserRole.Member:
      return { profile: Profile.student, studentProfile: StudentProfile.member, externalProfile: null };
    case UserRole.Alumni:
      return { profile: Profile.student, studentProfile: StudentProfile.alumni, externalProfile: null };
    case UserRole.Teacher:
      return { profile: Profile.teacher, studentProfile: null, externalProfile: null };
    case UserRole.Contributor:
      return { profile: Profile.external, studentProfile: null, externalProfile: ExternalProfile.contributor };
    case UserRole.Visitor:
      return { profile: Profile.external, studentProfile: null, externalProfile: ExternalProfile.visitor };
  }
};

const userRoles = new Set(Object.values(UserRole));

export const mapProfileTypeToProfileRecord = (profileType: string): UserProfileRecord => {
  if (!userRoles.has(profileType as UserRole)) {
    return { profile: Profile.student, studentProfile: StudentProfile.visitor, externalProfile: null };
  }

  return mapUserRoleToProfileRecord(profileType as UserRole);
};
