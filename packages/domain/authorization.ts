export type AdminFlags = {
  globalAdmin?: boolean;
  pedagogicalAdmin?: boolean;
};

export const isAdmin = (flags?: AdminFlags | null): boolean => Boolean(flags?.globalAdmin || flags?.pedagogicalAdmin);

export const isGlobalAdmin = (flags?: AdminFlags | null): boolean => Boolean(flags?.globalAdmin);

export const isPedagogicalAdmin = (flags?: AdminFlags | null): boolean => Boolean(flags?.pedagogicalAdmin);

export const canManageUsers = (flags?: AdminFlags | null): boolean => isGlobalAdmin(flags);

export const canManageBadges = (flags?: AdminFlags | null): boolean => isAdmin(flags);

export const canManageOpenBadges = (flags?: AdminFlags | null): boolean => canManageBadges(flags);

export const canManageMachines = (flags?: AdminFlags | null): boolean => isAdmin(flags);

export const canManageReservations = (flags?: AdminFlags | null): boolean => isAdmin(flags);

export const canManageEvents = (flags?: AdminFlags | null): boolean => isAdmin(flags);
