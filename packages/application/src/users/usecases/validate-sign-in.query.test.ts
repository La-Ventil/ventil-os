import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateSignIn } from './validate-sign-in.query';

const mockFindUserCredentialsByEmail = vi.fn();
const mockVerifySecret = vi.fn();
const mockVerifyAgainstNoSecret = vi.fn();
const mockViewUserProfile = vi.fn();

vi.mock('@repo/db', () => ({
  userRepository: {
    findUserCredentialsByEmail: (...args: [string]) => mockFindUserCredentialsByEmail(...args)
  }
}));

vi.mock('@repo/crypto', () => ({
  verifySecret: (...args: [string, string, string, number]) => mockVerifySecret(...args),
  verifyAgainstNoSecret: (...args: [string]) => mockVerifyAgainstNoSecret(...args)
}));

vi.mock('./view-user-profile.query', () => ({
  viewUserProfile: (...args: [string]) => mockViewUserProfile(...args)
}));

const EMAIL = 'someone@example.org';
const PASSWORD = 'a-password';
const credentials = {
  password: 'stored-hash',
  salt: 'stored-salt',
  iterations: 600000,
  blocked: false,
  emailVerified: new Date()
};

describe('validateSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUserCredentialsByEmail.mockResolvedValue(credentials);
    mockVerifySecret.mockResolvedValue(true);
    mockVerifyAgainstNoSecret.mockResolvedValue(false);
    mockViewUserProfile.mockResolvedValue({ id: 'user-id', email: EMAIL });
  });

  it('accepts a verified account with the right password', async () => {
    expect(await validateSignIn(EMAIL, PASSWORD)).toMatchObject({ status: 'success' });
  });

  it('rejects a wrong password', async () => {
    mockVerifySecret.mockResolvedValue(false);

    expect(await validateSignIn(EMAIL, PASSWORD)).toEqual({ status: 'invalid' });
  });

  // The next three are one property: how long the answer takes, and what it says, must not depend on
  // whether an account exists here or what state it is in. Deriving a key is the expensive half of
  // signing in, so every path has to pay for it.
  it('derives a key even when no account matches the address', async () => {
    mockFindUserCredentialsByEmail.mockResolvedValue(null);

    expect(await validateSignIn(EMAIL, PASSWORD)).toEqual({ status: 'invalid' });
    expect(mockVerifyAgainstNoSecret).toHaveBeenCalledWith(PASSWORD);
  });

  it('checks the password before telling a blocked account apart', async () => {
    mockFindUserCredentialsByEmail.mockResolvedValue({ ...credentials, blocked: true });

    expect(await validateSignIn(EMAIL, PASSWORD)).toEqual({ status: 'blocked' });
    expect(mockVerifySecret).toHaveBeenCalled();
  });

  it('checks the password before telling an unverified account apart', async () => {
    mockFindUserCredentialsByEmail.mockResolvedValue({ ...credentials, emailVerified: null });

    expect(await validateSignIn(EMAIL, PASSWORD)).toEqual({ status: 'unverified' });
    expect(mockVerifySecret).toHaveBeenCalled();
  });

  it('never reveals a blocked account to someone without the password', async () => {
    mockFindUserCredentialsByEmail.mockResolvedValue({ ...credentials, blocked: true });
    mockVerifySecret.mockResolvedValue(false);

    expect(await validateSignIn(EMAIL, PASSWORD)).toEqual({ status: 'invalid' });
  });

  it('never reveals an unverified account to someone without the password', async () => {
    mockFindUserCredentialsByEmail.mockResolvedValue({ ...credentials, emailVerified: null });
    mockVerifySecret.mockResolvedValue(false);

    expect(await validateSignIn(EMAIL, PASSWORD)).toEqual({ status: 'invalid' });
  });
});
