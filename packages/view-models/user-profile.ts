import type { UserProfile as DomainUserProfile } from '@repo/domain/user/user-profile';

export type UserProfile = DomainUserProfile & { fullName: string };
