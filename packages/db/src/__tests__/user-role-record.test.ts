import { UserRole, deriveUserRole } from '@repo/domain/user/user-role';
import { mapUserRoleToProfileRecord } from '../user-role-record';

describe('mapUserRoleToProfileRecord', () => {
  it('round-trips user roles through deriveUserRole', () => {
    for (const role of Object.values(UserRole)) {
      const record = mapUserRoleToProfileRecord(role);
      expect(deriveUserRole(record)).toBe(role);
    }
  });
});
