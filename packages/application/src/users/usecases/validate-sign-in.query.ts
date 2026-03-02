import { verifySecret } from '@repo/crypto';
import { userRepository } from '@repo/db';
import type { UserProfile } from '@repo/view-models/user-profile';
import type { Query } from '../../usecase';
import { viewUserProfile } from './view-user-profile.query';

export type SignInValidationResult =
  | { status: 'success'; user: UserProfile }
  | { status: 'invalid' | 'blocked' | 'unverified' };

export const validateSignIn: Query<[string, string], SignInValidationResult> = async (
  email: string,
  password: string
) => {
  const credentials = await userRepository.findUserCredentialsByEmail(email);

  if (!credentials?.password) {
    return { status: 'invalid' };
  }

  if (credentials.blocked) {
    return { status: 'blocked' };
  }

  if (!credentials.emailVerified) {
    return { status: 'unverified' };
  }

  const isValid = await verifySecret(password, credentials.password, credentials.salt, credentials.iterations);

  if (!isValid) {
    return { status: 'invalid' };
  }

  const user = await viewUserProfile(email);

  if (!user) {
    return { status: 'invalid' };
  }

  return { status: 'success', user };
};
