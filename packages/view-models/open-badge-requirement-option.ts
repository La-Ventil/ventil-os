export type OpenBadgeRequirementOptionLevelViewModel = {
  id: string;
  level: number;
  title: string;
  label: string;
};

export type OpenBadgeRequirementOptionViewModel = {
  id: string;
  name: string;
  type: string;
  coverImage: string | null;
  levels: OpenBadgeRequirementOptionLevelViewModel[];
};
