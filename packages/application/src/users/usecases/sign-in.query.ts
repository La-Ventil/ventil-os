import { verifySecret } from '@repo/crypto';
import { userRepository } from '@repo/db';
import type { UserProfile } from '@repo/view-models/user-profile';
import type { Query } from '../../usecase';
import { viewUserProfile } from './view-user-profile.query';

export const signIn: Query<[string, string], UserProfile | null> = async (email: string, password: string) => {
  const credentials = await userRepository.findUserCredentialsByEmail(email);

  if (!credentials?.password) {
    return null;
  }

  if (!credentials.emailVerified) {
    return null;
  }

  const isValid = await verifySecret(password, credentials.password, credentials.salt, credentials.iterations);

  if (!isValid) {
    return null;
  }

  return viewUserProfile(email);
};
