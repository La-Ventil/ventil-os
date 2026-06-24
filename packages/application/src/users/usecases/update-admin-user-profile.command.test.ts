import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '@repo/domain/user/user-role';
import { UserError } from '@repo/domain/user/user-errors';
import { updateAdminUserProfile } from './update-admin-user-profile.command';

const mockGetUserProfileById = vi.fn();
const mockCountGlobalAdmins = vi.fn();
const mockUpdateUserProfile = vi.fn();
const mockMapUserRoleToProfileRecord = vi.fn();

vi.mock('@repo/db', () => ({
  mapUserRoleToProfileRecord: (...args: [string]) => mockMapUserRoleToProfileRecord(...args),
  userRepository: {
    getUserProfileById: (...args: [string]) => mockGetUserProfileById(...args),
    countGlobalAdmins: () => mockCountGlobalAdmins(),
    updateUserProfile: (...args: [string, Record<string, unknown>]) => mockUpdateUserProfile(...args)
  }
}));

describe('updateAdminUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapUserRoleToProfileRecord.mockReturnValue({
      profile: 'student',
      studentProfile: 'member',
      externalProfile: null
    });
    mockGetUserProfileById.mockResolvedValue({
      id: 'user-id',
      globalAdmin: false,
      pedagogicalAdmin: false
    });
    mockCountGlobalAdmins.mockResolvedValue(2);
    mockUpdateUserProfile.mockResolvedValue({ id: 'user-id' });
  });

  it('persists admin flags and role mapping', async () => {
    await updateAdminUserProfile('user-id', {
      actorUserId: 'admin-id',
      firstName: 'Ada',
      lastName: 'Lovelace',
      profile: UserRole.Member,
      educationLevel: null,
      globalAdmin: true,
      pedagogicalAdmin: false
    });

    expect(mockUpdateUserProfile).toHaveBeenCalledWith(
      'user-id',
      expect.objectContaining({
        firstName: 'Ada',
        lastName: 'Lovelace',
        globalAdmin: true,
        pedagogicalAdmin: false
      })
    );
  });

  it('rejects demoting the last global admin', async () => {
    mockGetUserProfileById.mockResolvedValue({
      id: 'user-id',
      globalAdmin: true,
      pedagogicalAdmin: false
    });
    mockCountGlobalAdmins.mockResolvedValue(1);

    await expect(
      updateAdminUserProfile('user-id', {
        actorUserId: 'admin-id',
        firstName: 'Ada',
        lastName: 'Lovelace',
        profile: UserRole.Teacher,
        educationLevel: null,
        globalAdmin: false,
        pedagogicalAdmin: true
      })
    ).rejects.toBeInstanceOf(UserError);

    await expect(
      updateAdminUserProfile('user-id', {
        actorUserId: 'admin-id',
        firstName: 'Ada',
        lastName: 'Lovelace',
        profile: UserRole.Teacher,
        educationLevel: null,
        globalAdmin: false,
        pedagogicalAdmin: true
      })
    ).rejects.toMatchObject({ code: 'user.lastGlobalAdmin' });
  });

  it('rejects changing its own admin access', async () => {
    mockGetUserProfileById.mockResolvedValue({
      id: 'user-id',
      globalAdmin: true,
      pedagogicalAdmin: false
    });

    await expect(
      updateAdminUserProfile('user-id', {
        actorUserId: 'user-id',
        firstName: 'Ada',
        lastName: 'Lovelace',
        profile: UserRole.Teacher,
        educationLevel: null,
        globalAdmin: false,
        pedagogicalAdmin: false
      })
    ).rejects.toMatchObject({ code: 'user.cannotChangeOwnAdminAccess' });
  });
});
