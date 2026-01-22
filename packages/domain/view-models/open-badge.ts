export type OpenBadgeLevelViewModel = {
  level: number;
  title: string;
  description: string;
};

export type OpenBadgeViewModel = {
  id: string;
  type: string;
  name: string;
  coverImage?: string;
  description: string;
  levels: OpenBadgeLevelViewModel[];
  activeLevel: number;
};
