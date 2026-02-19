import type { Email } from '@repo/domain/user/email';
import type { UserSummaryPayload } from '../selects/user-summary';

export type UserSummaryReadModel = Omit<UserSummaryPayload, 'email' | 'lastName'> & {
  email: Email;
  lastName: string;
};
