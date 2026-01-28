import { ExternalProfile, Profile, StudentProfile } from '@repo/db';
import type { UserProfileSchema } from '@repo/db/schemas';
import { parseEducationLevel } from '@repo/domain/education-level';
import { Email } from '@repo/domain/email';
import { ProfileType } from '@repo/domain/profile-type';
import type { UserProfile } from '@repo/view-models/user-profile';

const resolveProfileType = (user: UserProfileSchema): ProfileType => {
  if (user.profile === Profile.teacher) {
    return ProfileType.Teacher;
  }

  if (user.profile === Profile.external) {
    if (user.externalProfile === ExternalProfile.contributor) {
      return ProfileType.Contributor;
    }

    return ProfileType.Visitor;
  }

  if (user.studentProfile === StudentProfile.member) {
    return ProfileType.Member;
  }

  if (user.studentProfile === StudentProfile.alumni) {
    return ProfileType.Alumni;
  }

  return ProfileType.Visitor;
};

export const mapUserProfileToViewModel = (
  user: UserProfileSchema
): UserProfile => ({
  id: user.id,
  profile: resolveProfileType(user),
  email: Email.from(user.email),
  username: user.username,
  educationLevel: parseEducationLevel(user.educationLevel),
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin,
  lastName: user.lastName ?? undefined,
  firstName: user.firstName
});
