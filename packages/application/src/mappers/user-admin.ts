import type { UserAdminSchema } from '@repo/db/schemas';
import { Email } from '@repo/domain/email';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import { resolveProfileType } from './profile-type';

export const mapUserAdminToViewModel = (user: UserAdminSchema): UserAdminViewModel => ({
  id: user.id,
  email: Email.from(user.email),
  firstName: user.firstName,
  lastName: user.lastName ?? undefined,
  username: user.username,
  profile: resolveProfileType(user),
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin,
  eventsCount: user._count.eventRegistrations,
  openBadgesCount: user._count.openBadgeProgresses,
  machinesCount: 0
});
