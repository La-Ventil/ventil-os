import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '@repo/domain/user/user-role';
import { EducationLevel } from '@repo/domain/user/education-level';
import { signUp } from './sign-up.command';
import { updateProfile } from './update-profile.command';

const mockCreateUser = vi.fn();
const mockUpdateUserProfile = vi.fn();
const mockMapUserRoleStringToProfileRecord = vi.fn();
const mockMapUserRoleToProfileRecord = vi.fn();
const mockHashSecret = vi.fn();
const mockCreateEmailVerificationToken = vi.fn();

vi.mock('@repo/db', () => ({
  ConsentType: { terms: 'terms' },
  isPrismaUniqueConstraintError: () => false,
  mapUserRoleStringToProfileRecord: (...args: [string]) => mockMapUserRoleStringToProfileRecord(...args),
  mapUserRoleToProfileRecord: (...args: [string]) => mockMapUserRoleToProfileRecord(...args),
  userRepository: {
    createUser: (...args: [Record<string, unknown>]) => mockCreateUser(...args),
    updateUserProfile: (...args: [string, Record<string, unknown>]) => mockUpdateUserProfile(...args)
  }
}));

vi.mock('@repo/crypto', () => ({
  hashSecret: (...args: [string]) => mockHashSecret(...args)
}));

vi.mock('../email-tokens', () => ({
  createEmailVerificationToken: (...args: [string]) => mockCreateEmailVerificationToken(...args)
}));

describe('education level command inputs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapUserRoleStringToProfileRecord.mockReturnValue({
      profile: 'student',
      studentProfile: 'member',
      externalProfile: null
    });
    mockMapUserRoleToProfileRecord.mockReturnValue({
      profile: 'student',
      studentProfile: 'member',
      externalProfile: null
    });
    mockHashSecret.mockResolvedValue({
      salt: 'salt',
      hashedSecret: 'hashed',
      iterations: 1
    });
    mockCreateUser.mockResolvedValue({ id: 'user-id', email: 'user@example.test' });
    mockUpdateUserProfile.mockResolvedValue({ id: 'user-id' });
    mockCreateEmailVerificationToken.mockResolvedValue({
      token: 'token',
      expires: new Date('2026-03-18T00:00:00.000Z')
    });
  });

  it('passes canonical education level values to sign up persistence', async () => {
    await signUp({
      email: 'user@example.test',
      firstName: 'Test',
      lastName: 'User',
      educationLevel: EducationLevel.Terminale,
      profileType: UserRole.Member,
      password: 'ChangeMe123!',
      termsAccepted: true
    });

    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        educationLevel: EducationLevel.Terminale
      })
    );
  });

  it('passes canonical education level values to profile update persistence', async () => {
    await updateProfile('user-id', {
      firstName: 'Test',
      lastName: 'User',
      educationLevel: EducationLevel.Premiere,
      profile: UserRole.Member
    });

    expect(mockUpdateUserProfile).toHaveBeenCalledWith(
      'user-id',
      expect.objectContaining({
        educationLevel: EducationLevel.Premiere
      })
    );
  });
});
