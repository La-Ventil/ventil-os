import { verifyAgainstNoSecret, verifySecret } from '@repo/crypto';
import { userRepository } from '@repo/db';
import type { UserProfile } from '@repo/application/users/models/user-profile';
import type { Query } from '../../usecase';
import { viewUserProfile } from './view-user-profile.query';

export type SignInValidationResult =
  { status: 'success'; user: UserProfile } | { status: 'invalid' | 'blocked' | 'unverified' };

export const validateSignIn: Query<[string, string], SignInValidationResult> = async (
  email: string,
  password: string
) => {
  const credentials = await userRepository.findUserCredentialsByEmail(email);

  // The password is checked first, and a miss still pays for a key derivation. Answering the state
  // of an account before that — or faster for an address nobody owns — tells a stranger who has an
  // account here, and in what state, without ever needing a valid password.
  const isValid = credentials?.password
    ? await verifySecret(password, credentials.password, credentials.salt, credentials.iterations)
    : await verifyAgainstNoSecret(password);

  if (!credentials?.password || !isValid) {
    return { status: 'invalid' };
  }

  if (credentials.blocked) {
    return { status: 'blocked' };
  }

  if (!credentials.emailVerified) {
    return { status: 'unverified' };
  }

  const user = await viewUserProfile(email);

  if (!user) {
    return { status: 'invalid' };
  }

  return { status: 'success', user };
};
