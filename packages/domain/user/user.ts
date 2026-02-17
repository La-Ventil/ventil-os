import type { AdminFlags } from '../authorization';
import type { EducationLevel } from './education-level';
import type { Email } from './email';
import type { ProfileType } from './profile-type';

export type User = {
  id: string;
  profile: ProfileType;
  email: Email;
  pendingEmail?: Email | null;
  emailVerifiedAt?: Date | null;
  image?: string | null;
  username: string;
  educationLevel?: EducationLevel | null;
  lastName?: string | null;
  firstName: string;
  globalAdmin: boolean;
  pedagogicalAdmin: boolean;
};

const assertPendingEmail = (email: Email, pendingEmail?: Email | null): void => {
  if (pendingEmail && pendingEmail === email) {
    throw new Error('Pending email must differ from the current email.');
  }
};

export const User = {
  from(input: User): User {
    assertPendingEmail(input.email, input.pendingEmail ?? null);
    return {
      ...input,
      pendingEmail: input.pendingEmail ?? null,
      emailVerifiedAt: input.emailVerifiedAt ?? null
    };
  },
  hasPendingEmail(user: User): boolean {
    return Boolean(user.pendingEmail);
  },
  requestEmailChange(user: User, nextEmail: Email): User {
    if (user.email === nextEmail) {
      throw new Error('New email must differ from the current email.');
    }

    if (user.pendingEmail === nextEmail) {
      return user;
    }

    return {
      ...user,
      pendingEmail: nextEmail
    };
  },
  clearPendingEmail(user: User): User {
    if (!user.pendingEmail) {
      return user;
    }

    return {
      ...user,
      pendingEmail: null
    };
  },
  confirmEmail(user: User, email: Email, verifiedAt: Date = new Date()): User {
    if (user.pendingEmail && user.pendingEmail === email) {
      return {
        ...user,
        email,
        pendingEmail: null,
        emailVerifiedAt: verifiedAt
      };
    }

    if (user.email === email) {
      return {
        ...user,
        emailVerifiedAt: verifiedAt
      };
    }

    throw new Error('Email does not match user email.');
  },
  markEmailVerified(user: User, verifiedAt: Date = new Date()): User {
    return {
      ...user,
      emailVerifiedAt: verifiedAt
    };
  },
  canLogin(user: User): boolean {
    return Boolean(user.emailVerifiedAt);
  },
  toAdminFlags(user: User): AdminFlags {
    return {
      globalAdmin: user.globalAdmin,
      pedagogicalAdmin: user.pedagogicalAdmin
    };
  }
};
