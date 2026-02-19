import type { Email } from '@repo/domain/user/email';
import type { UserPasswordResetPayload } from '../selects/user-password-reset';

export type UserPasswordResetReadModel = Omit<UserPasswordResetPayload, 'email' | 'lastName'> & {
  email: Email;
  lastName: string;
};
