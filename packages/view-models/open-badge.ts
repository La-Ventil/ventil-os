import type { BadgeLevel } from '@repo/domain/badge-level';
import type { Level } from '@repo/domain/level';

export type OpenBadgeLevelViewModel = BadgeLevel;

export type OpenBadgeViewModel = {
  id: string;
  type: string;
  name: string;
  coverImage?: string;
  description: string;
  levels: OpenBadgeLevelViewModel[];
  activeLevel: Level | 0;
};
