import {
  canManageUsers,
  isAdmin,
  isGlobalAdmin,
  type AdminFlags
} from '@repo/domain/authorization';

export const isAdminUser = (user?: AdminFlags | null): boolean => isAdmin(user);

export const isGlobalAdminUser = (user?: AdminFlags | null): boolean => isGlobalAdmin(user);

export const canManageUsersUser = (user?: AdminFlags | null): boolean =>
  canManageUsers(user);
