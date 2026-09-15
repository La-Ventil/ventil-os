export type OpenBadgeEdit = {
  id: string;
  name: string;
  description: string;
  coverImage?: string | null;
  levels: Array<{ title: string; description: string }>;
  activationEnabled: boolean;
  /** Lowest level from which holders may deliver the badge; `null` when only admins may. */
  trainerThresholdLevel: number | null;
};
