export type OpenBadgeLevel = {
  level: number;
  title?: string;
  body?: string;
};

export type OpenBadge = {
  id: string;
  type: string;
  title: string;
  description: string;
  levels: OpenBadgeLevel[];
  activeLevel: number;
};
