import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setUserBlocked } from './set-user-blocked.command';

const mockGetUserProfileById = vi.fn();
const mockSetUserBlocked = vi.fn();

vi.mock('@repo/db', () => ({
  userRepository: {
    getUserProfileById: (...args: [string]) => mockGetUserProfileById(...args),
    setUserBlocked: (...args: [string, boolean]) => mockSetUserBlocked(...args)
  }
}));

describe('setUserBlocked', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetUserBlocked.mockResolvedValue({ id: 'user-id', blocked: true });
    mockGetUserProfileById.mockResolvedValue({
      id: 'user-id',
      globalAdmin: false,
      pedagogicalAdmin: false
    });
  });

  it('blocks a non-admin user', async () => {
    await setUserBlocked({ actorUserId: 'admin-id', userId: 'user-id', blocked: true });

    expect(mockSetUserBlocked).toHaveBeenCalledWith('user-id', true);
  });

  it('rejects self-blocking', async () => {
    await expect(setUserBlocked({ actorUserId: 'user-id', userId: 'user-id', blocked: true })).rejects.toMatchObject({
      code: 'user.cannotBlockSelf'
    });
  });

  it('rejects blocking an admin user', async () => {
    mockGetUserProfileById.mockResolvedValue({
      id: 'user-id',
      globalAdmin: false,
      pedagogicalAdmin: true
    });

    await expect(setUserBlocked({ actorUserId: 'admin-id', userId: 'user-id', blocked: true })).rejects.toMatchObject({
      code: 'user.cannotBlockAdmin'
    });
  });
});
