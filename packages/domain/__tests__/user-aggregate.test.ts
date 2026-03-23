import { describe, expect, it } from 'vitest';
import { User } from '../user/user';
import { Email } from '../user/email';
import { UserRole } from '../user/user-role';

const baseUser = () =>
  User.from({
    id: 'user-1',
    profile: UserRole.Member,
    email: Email.from('user@example.com'),
    pendingEmail: null,
    emailVerifiedAt: null,
    image: null,
    username: 'user',
    educationLevel: null,
    lastName: 'Doe',
    firstName: 'Jane',
    globalAdmin: false,
    pedagogicalAdmin: false,
    blocked: false
  });

describe('User aggregate', () => {
  it('sets a pending email change', () => {
    const user = baseUser();
    const updated = User.requestEmailChange(user, Email.from('next@example.com'));

    expect(updated.pendingEmail).toBe('next@example.com');
  });

  it('confirms pending email', () => {
    const user = User.requestEmailChange(baseUser(), Email.from('next@example.com'));
    const confirmed = User.confirmEmail(user, Email.from('next@example.com'));

    expect(confirmed.email).toBe('next@example.com');
    expect(confirmed.pendingEmail).toBeNull();
    expect(confirmed.emailVerifiedAt).not.toBeNull();
  });

  it('marks current email verified', () => {
    const user = baseUser();
    const confirmed = User.confirmEmail(user, Email.from('user@example.com'));

    expect(confirmed.email).toBe('user@example.com');
    expect(confirmed.emailVerifiedAt).not.toBeNull();
  });

  describe('canLogin', () => {
    it('returns false when email is not verified', () => {
      const user = baseUser();
      expect(User.canLogin(user)).toBe(false);
    });

    it('returns true when email is verified and not blocked', () => {
      const user = User.markEmailVerified(baseUser());
      expect(User.canLogin(user)).toBe(true);
    });

    it('returns false when verified but blocked', () => {
      const user = User.block(User.markEmailVerified(baseUser()));
      expect(User.canLogin(user)).toBe(false);
    });
  });

  describe('block / unblock', () => {
    it('blocks a user', () => {
      const user = baseUser();
      expect(User.block(user).blocked).toBe(true);
    });

    it('unblocks a user', () => {
      const user = User.block(baseUser());
      expect(User.unblock(user).blocked).toBe(false);
    });
  });
});
