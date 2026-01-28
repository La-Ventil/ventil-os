import { isAdmin, type AdminFlags } from '@repo/domain/authorization';

export const isAdminUser = (user?: AdminFlags | null): boolean => isAdmin(user);
