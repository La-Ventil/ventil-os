import type { UserAdminReadModel } from '@repo/db/schemas';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';

export const mapUserAdminToViewModel = (user: UserAdminReadModel): UserAdminViewModel => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName ?? undefined,
  username: user.username,
  profile: user.profile,
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin,
  stats: {
    eventsCount: user._count.eventRegistrations,
    openBadgesCount: user._count.openBadgeProgresses,
    machinesCount: 0
  }
});
