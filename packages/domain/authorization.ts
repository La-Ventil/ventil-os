export type AdminFlags = {
  globalAdmin?: boolean;
  pedagogicalAdmin?: boolean;
};

export const isAdmin = (flags?: AdminFlags | null): boolean =>
  Boolean(flags?.globalAdmin || flags?.pedagogicalAdmin);

export const isGlobalAdmin = (flags?: AdminFlags | null): boolean =>
  Boolean(flags?.globalAdmin);

export const canManageUsers = (flags?: AdminFlags | null): boolean =>
  isGlobalAdmin(flags);

export const canManageBadges = (flags?: AdminFlags | null): boolean =>
  isAdmin(flags);
