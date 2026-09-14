import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resendEmailVerification } from './resend-email-verification.command';
import { EMAIL_VERIFICATION_TOKEN_TTL_MS } from '../email-tokens';

const mockGetUserProfileByEmail = vi.fn();
const mockFindByIdentifier = vi.fn();
const mockReplaceToken = vi.fn();

vi.mock('@repo/db', () => ({
  userRepository: {
    getUserProfileByEmail: (...args: [string]) => mockGetUserProfileByEmail(...args)
  },
  verificationTokenRepository: {
    findByIdentifier: (...args: [string]) => mockFindByIdentifier(...args),
    replaceToken: (...args: [string, string, Date]) => mockReplaceToken(...args)
  }
}));

vi.mock('@repo/crypto', () => ({
  hashToken: (token: string) => `hashed:${token}`
}));

const EMAIL = 'someone@example.org';
const unverifiedUser = {
  email: EMAIL,
  firstName: 'Camille',
  lastName: 'Martin',
  emailVerified: null
};

/** A token issued `agoMs` ago, expressed the way the database stores it: an expiry date. */
const tokenIssuedAgo = (agoMs: number) => ({
  identifier: EMAIL,
  token: 'hashed:whatever',
  expires: new Date(Date.now() - agoMs + EMAIL_VERIFICATION_TOKEN_TTL_MS)
});

describe('resendEmailVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserProfileByEmail.mockResolvedValue(unverifiedUser);
    mockFindByIdentifier.mockResolvedValue(null);
    mockReplaceToken.mockResolvedValue(undefined);
  });

  it('issues a new link for an unverified account', async () => {
    const result = await resendEmailVerification(EMAIL);

    expect(result).toMatchObject({ sent: true, email: EMAIL, firstName: 'Camille', lastName: 'Martin' });
    expect(mockReplaceToken).toHaveBeenCalledTimes(1);
  });

  it('says nothing about an unknown address', async () => {
    mockGetUserProfileByEmail.mockResolvedValue(null);

    expect(await resendEmailVerification(EMAIL)).toEqual({ sent: false });
    expect(mockReplaceToken).not.toHaveBeenCalled();
  });

  it('says nothing about an already verified account', async () => {
    mockGetUserProfileByEmail.mockResolvedValue({ ...unverifiedUser, emailVerified: new Date() });

    expect(await resendEmailVerification(EMAIL)).toEqual({ sent: false });
    expect(mockReplaceToken).not.toHaveBeenCalled();
  });

  it('looks the account up by its own address, never by a pending one', async () => {
    await resendEmailVerification(EMAIL);

    expect(mockGetUserProfileByEmail).toHaveBeenCalledWith(EMAIL);
  });

  it('sends rather than refuse forever when the stored lifetime predates a change of the constant', async () => {
    // Lifetime shortened since: the row expires further ahead than the current constant allows,
    // which naively reads as "issued in the future".
    mockFindByIdentifier.mockResolvedValue({
      identifier: EMAIL,
      token: 'hashed:whatever',
      expires: new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS + 60 * 60 * 1000)
    });

    expect(await resendEmailVerification(EMAIL)).toMatchObject({ sent: true });
  });

  it('refuses to send twice within the cooldown', async () => {
    mockFindByIdentifier.mockResolvedValue(tokenIssuedAgo(60 * 1000));

    expect(await resendEmailVerification(EMAIL)).toEqual({ sent: false });
    expect(mockReplaceToken).not.toHaveBeenCalled();
  });

  it('sends again once the cooldown has passed', async () => {
    mockFindByIdentifier.mockResolvedValue(tokenIssuedAgo(10 * 60 * 1000));

    expect(await resendEmailVerification(EMAIL)).toMatchObject({ sent: true });
    expect(mockReplaceToken).toHaveBeenCalledTimes(1);
  });

  it('sends again for a link that has already expired', async () => {
    mockFindByIdentifier.mockResolvedValue(tokenIssuedAgo(EMAIL_VERIFICATION_TOKEN_TTL_MS + 60 * 1000));

    expect(await resendEmailVerification(EMAIL)).toMatchObject({ sent: true });
  });
});
