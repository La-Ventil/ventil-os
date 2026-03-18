import {
  EducationLevel,
  parseEducationLevel,
  type EducationLevel as EducationLevelValue
} from '@repo/domain/user/education-level';
import { UserRole, requiresEducationLevel, type UserRole as UserRoleValue } from '@repo/domain/user/user-role';

export type ResolvedEducationLevel = EducationLevelValue | '';

export const resolveUserRole = (value?: string, fallback: UserRoleValue = UserRole.Member): UserRoleValue => {
  return Object.values(UserRole).includes(value as UserRoleValue) ? (value as UserRoleValue) : fallback;
};

export const resolveEducationLevelForRole = (
  role: UserRoleValue,
  educationLevel?: string | null,
  requiredFallback: EducationLevelValue = EducationLevel.Premiere
): ResolvedEducationLevel => {
  const parsedEducationLevel = parseEducationLevel(educationLevel);

  if (requiresEducationLevel(role)) {
    return parsedEducationLevel ?? requiredFallback;
  }

  return parsedEducationLevel ?? '';
};
