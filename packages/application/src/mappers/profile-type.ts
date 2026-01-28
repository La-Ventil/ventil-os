import { ExternalProfile, Profile, StudentProfile } from '@repo/db';
import { ProfileType } from '@repo/domain/profile-type';

export type ProfileTypeSource = {
  profile: Profile;
  studentProfile: StudentProfile | null;
  externalProfile: ExternalProfile | null;
};

export const resolveProfileType = (user: ProfileTypeSource): ProfileType => {
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
