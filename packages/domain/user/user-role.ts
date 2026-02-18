// Notes on visitor meaning:
// - studentProfile=visitor: "external student" to show porosity across schools/fields.
// - externalProfile=visitor: "territorial visitor" to show the school's utility for locals.
// UI can still label both as "Visiteur" when needed.

export const UserRole = {
  Member: 'member',
  Alumni: 'alumni',
  Teacher: 'teacher',
  Contributor: 'contributor',
  Visitor: 'visitor'
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const requiresEducationLevel = (role: UserRole): boolean =>
  role === UserRole.Member || role === UserRole.Alumni;

export type UserProfileFlags = {
  profile: 'student' | 'teacher' | 'external';
  studentProfile?: 'visitor' | 'member' | 'alumni' | null;
  externalProfile?: 'contributor' | 'visitor' | null;
};

export const deriveUserRole = (user: UserProfileFlags): UserRole => {
  if (user.profile === 'teacher') {
    return UserRole.Teacher;
  }

  if (user.profile === 'external') {
    if (user.externalProfile === 'contributor') {
      return UserRole.Contributor;
    }

    return UserRole.Visitor;
  }

  if (user.studentProfile === 'member') {
    return UserRole.Member;
  }

  if (user.studentProfile === 'alumni') {
    return UserRole.Alumni;
  }

  return UserRole.Visitor;
};
