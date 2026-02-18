import { describe, expect, it } from 'vitest';
import { User } from '@repo/domain/user/user';
import { Email } from '@repo/domain/user/email';
import { UserRole } from '@repo/domain/user/user-role';

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
    pedagogicalAdmin: false
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
});
