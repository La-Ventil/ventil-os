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

export async function getPasswordResetToken(args: AuthFixtureArgs): Promise<string> {
  return getAuthTestRepository(args.dbSlot).getResetTokenByEmail(args.email);
}
