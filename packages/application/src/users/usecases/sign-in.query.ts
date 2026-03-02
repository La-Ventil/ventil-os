import type { UserProfile } from '@repo/view-models/user-profile';
import type { Query } from '../../usecase';
import { validateSignIn } from './validate-sign-in.query';

export const signIn: Query<[string, string], UserProfile | null> = async (email: string, password: string) => {
  const result = await validateSignIn(email, password);

  return result.status === 'success' ? result.user : null;
};
