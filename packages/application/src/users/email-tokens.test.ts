import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMAIL_VERIFICATION_TOKEN_TTL_MS, createEmailVerificationToken } from './email-tokens';

const mockReplaceToken = vi.fn();

vi.mock('@repo/db', () => ({
  verificationTokenRepository: {
    replaceToken: (...args: [string, string, Date]) => mockReplaceToken(...args)
  }
}));

vi.mock('@repo/crypto', () => ({
  hashToken: (token: string) => `hashed:${token}`
}));

const EMAIL = 'someone@example.org';

// Written out rather than imported: a test that reuses the production constant proves nothing about
// its value, and this duration is a deliberate decision, not an implementation detail.
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const lifetimeOf = (expires: Date) => expires.getTime() - Date.now();

describe('createEmailVerificationToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReplaceToken.mockResolvedValue(undefined);
  });

  it('hands out a link that lives for a day', async () => {
    const { expires } = await createEmailVerificationToken(EMAIL);

    expect(lifetimeOf(expires)).toBeGreaterThan(ONE_DAY_MS - 5_000);
    expect(lifetimeOf(expires)).toBeLessThanOrEqual(ONE_DAY_MS);
  });

  it('stores the hash of the token it hands out, never the token itself', async () => {
    const { token, expires } = await createEmailVerificationToken(EMAIL);

    expect(mockReplaceToken).toHaveBeenCalledWith(EMAIL, `hashed:${token}`, expires);
  });

  it('never issues the same token twice', async () => {
    const first = await createEmailVerificationToken(EMAIL);
    const second = await createEmailVerificationToken(EMAIL);

    expect(first.token).not.toBe(second.token);
    expect(first.token.length).toBeGreaterThan(20);
  });

  it('declares the lifetime it is asked to enforce', () => {
    expect(EMAIL_VERIFICATION_TOKEN_TTL_MS).toBe(ONE_DAY_MS);
  });
});
