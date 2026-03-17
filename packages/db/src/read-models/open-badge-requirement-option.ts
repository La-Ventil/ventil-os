export type OpenBadgeRequirementOptionLevelReadModel = {
  id: string;
  level: number;
  title: string;
};

export type OpenBadgeRequirementOptionReadModel = {
  id: string;
  name: string;
  type: string;
  coverImage: string | null;
  levels: OpenBadgeRequirementOptionLevelReadModel[];
};
