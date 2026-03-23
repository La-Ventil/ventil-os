import type { EducationLevel } from './education-level';
import type { Email } from './email';
import { requiresEducationLevel, type UserRole } from './user-role';

export type UserProfile = {
  id: string;
  profile: UserRole;
  email: Email;
  pendingEmail?: Email | null;
  image?: string | null;
  username: string;
  educationLevel?: EducationLevel | null;
  lastName: string;
  firstName: string;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
};

export const resolvePersistedEducationLevel = (
  role: UserRole | undefined,
  educationLevel?: EducationLevel | null
): EducationLevel | null | undefined => {
  if (role === undefined) {
    return educationLevel;
  }

  return requiresEducationLevel(role) ? (educationLevel ?? null) : null;
};
