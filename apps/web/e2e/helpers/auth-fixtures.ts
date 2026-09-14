import { getAuthTestRepository } from './auth-test-repository';

type AuthFixtureArgs = {
  dbSlot?: string;
  email: string;
};

export async function givenBlockedUser(args: AuthFixtureArgs): Promise<void> {
  await getAuthTestRepository(args.dbSlot).setBlockedByEmail(args.email, true);
}

export async function givenActiveUser(args: AuthFixtureArgs): Promise<void> {
  await getAuthTestRepository(args.dbSlot).setBlockedByEmail(args.email, false);
}

export async function getPasswordResetToken(args: AuthFixtureArgs & { since: Date }): Promise<string> {
  return getAuthTestRepository(args.dbSlot).getResetTokenByEmail(args.email, args.since);
}

export async function givenUnverifiedUser(args: AuthFixtureArgs): Promise<void> {
  const repository = getAuthTestRepository(args.dbSlot);
  await repository.setEmailVerifiedByEmail(args.email, false);
  await repository.deleteVerificationTokens(args.email);
}

export async function givenVerifiedUser(args: AuthFixtureArgs): Promise<void> {
  const repository = getAuthTestRepository(args.dbSlot);
  await repository.setEmailVerifiedByEmail(args.email, true);
  await repository.deleteVerificationTokens(args.email);
}

export async function getEmailVerificationToken(args: AuthFixtureArgs & { since: Date }): Promise<string> {
  return getAuthTestRepository(args.dbSlot).getEmailVerificationToken(args.email, args.since);
}

export async function givenPassword(args: AuthFixtureArgs & { password: string }): Promise<void> {
  await getAuthTestRepository(args.dbSlot).setPasswordByEmail(args.email, args.password);
}

export async function isEmailVerified(args: AuthFixtureArgs): Promise<boolean> {
  return getAuthTestRepository(args.dbSlot).isEmailVerifiedByEmail(args.email);
}
