import type { OpenBadgeRequirementRule } from './open-badge-requirement-rule.js';

export type OpenBadgeRequirement = {
  id: string;
  rule: OpenBadgeRequirementRule;
  openBadge: {
    id: string;
    name: string;
    type?: string | null;
    imageUrl?: string | null;
  };
  level?: {
    id: string;
    title?: string | null;
    level?: number | null;
  } | null;
};


export type OpenBadgeLevelCheck = {
  requiredLevel: number;
  userLevel: number | null;
};
