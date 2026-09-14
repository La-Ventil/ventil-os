import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetPassword } from './reset-password.command';

const mockFindUserByValidResetToken = vi.fn();
const mockMarkEmailVerified = vi.fn();
const mockSetNewPassword = vi.fn();

vi.mock('@repo/db', () => ({
  userRepository: {
    findUserByValidResetToken: (...args: [string]) => mockFindUserByValidResetToken(...args),
    markEmailVerified: (...args: [string]) => mockMarkEmailVerified(...args)
  }
}));

vi.mock('@repo/crypto', () => ({
  hashToken: (token: string) => `hashed:${token}`
}));

vi.mock('../passwords', () => ({
  setNewPassword: (...args: [string, string]) => mockSetNewPassword(...args)
}));

const TOKEN = 'a-reset-token';
const NEW_PASSWORD = 'Renewed123';
const verifiedUser = { id: 'user-id', email: 'someone@example.org', emailVerified: new Date() };

describe('resetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUserByValidResetToken.mockResolvedValue(verifiedUser);
    mockSetNewPassword.mockResolvedValue({ id: 'user-id', email: 'someone@example.org' });
    mockMarkEmailVerified.mockResolvedValue(undefined);
  });

  it('looks the reset token up by its hash, never in clear', async () => {
    await resetPassword(TOKEN, NEW_PASSWORD);

    expect(mockFindUserByValidResetToken).toHaveBeenCalledWith(`hashed:${TOKEN}`);
  });

  it('sets the new password', async () => {
    expect(await resetPassword(TOKEN, NEW_PASSWORD)).toEqual({ ok: true, email: 'someone@example.org' });
    expect(mockSetNewPassword).toHaveBeenCalledWith('user-id', NEW_PASSWORD);
  });

  it('refuses an unknown or expired token without touching the account', async () => {
    mockFindUserByValidResetToken.mockResolvedValue(null);

    expect(await resetPassword(TOKEN, NEW_PASSWORD)).toEqual({ ok: false, reason: 'invalid-token' });
    expect(mockSetNewPassword).not.toHaveBeenCalled();
    expect(mockMarkEmailVerified).not.toHaveBeenCalled();
  });

  it('verifies the address of an account that had never confirmed it', async () => {
    // Following the link proves the mailbox is theirs; refusing the sign-in afterwards would strand
    // them for no reason.
    mockFindUserByValidResetToken.mockResolvedValue({ ...verifiedUser, emailVerified: null });

    await resetPassword(TOKEN, NEW_PASSWORD);

    expect(mockMarkEmailVerified).toHaveBeenCalledWith('user-id');
  });

  it('leaves an already verified address alone', async () => {
    await resetPassword(TOKEN, NEW_PASSWORD);

    expect(mockMarkEmailVerified).not.toHaveBeenCalled();
  });
});
