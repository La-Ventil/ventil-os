import type { EducationLevel } from '@repo/domain/user/education-level';
import { UserRole, requiresEducationLevel } from '@repo/domain/user/user-role';
import { resolveEducationLevelForRole, resolveUserRole } from '@repo/application/forms';

export type ProfileEducationState = {
  selectedProfile: UserRole;
  showEducationLevel: boolean;
  resolvedEducationLevel: EducationLevel | '';
};

type UseProfileEducationOptions = {
  profile?: string;
  educationLevel?: string | null;
};

export function useProfileEducation({ profile, educationLevel }: UseProfileEducationOptions): ProfileEducationState {
  const selectedProfile = resolveUserRole(profile);
  const showEducationLevel = requiresEducationLevel(selectedProfile);
  const resolvedEducationLevel = resolveEducationLevelForRole(selectedProfile, educationLevel);

  return {
    selectedProfile,
    showEducationLevel,
    resolvedEducationLevel
  };
}
