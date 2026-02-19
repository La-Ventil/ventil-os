import type { UserAdmin } from '@repo/domain/user/user-admin';

export type UserAdminViewModel = UserAdmin & { fullName: string };
