import type { OpenBadgeLevel } from './open-badge-level';
export type { OpenBadgeLevel } from './open-badge-level';

export type OpenBadge = {
  id: string;
  type: string;
  name: string;
  coverImage?: string;
  description: string;
  levels: OpenBadgeLevel[];
  activeLevel: number;
};

const sortLevels = (levels: OpenBadgeLevel[]): OpenBadgeLevel[] =>
  [...levels].sort((left, right) => left.level - right.level);

const assertLevels = (levels: OpenBadgeLevel[]): OpenBadgeLevel[] => {
  if (levels.length === 0) {
    throw new Error('Open badge must define at least one level.');
  }

  const sorted = sortLevels(levels);
  const seen = new Set<number>();
  sorted.forEach((level) => {
    if (seen.has(level.level)) {
      throw new Error(`Open badge level ${level.level} is duplicated.`);
    }
    seen.add(level.level);
  });

  return sorted;
};

const assertActiveLevel = (activeLevel: number, levels: OpenBadgeLevel[]): number => {
  if (activeLevel < 0) {
    throw new Error('Open badge active level cannot be negative.');
  }

  if (activeLevel === 0) {
    return activeLevel;
  }

  if (!levels.some((level) => level.level === activeLevel)) {
    throw new Error(`Open badge active level ${activeLevel} does not exist in levels.`);
  }

  return activeLevel;
};

export const OpenBadge = {
  from(input: OpenBadge): OpenBadge {
    const levels = assertLevels(input.levels);
    const activeLevel = assertActiveLevel(input.activeLevel, levels);
    return {
      ...input,
      levels,
      activeLevel
    };
  },
  getActiveLevel(badge: OpenBadge): OpenBadgeLevel | null {
    if (badge.activeLevel <= 0) {
      return null;
    }

    return badge.levels.find((level) => level.level === badge.activeLevel) ?? null;
  },
  hasLevel(badge: OpenBadge, level: number): boolean {
    return badge.levels.some((item) => item.level === level);
  },
  isActiveLevel(badge: OpenBadge, level: number): boolean {
    return badge.activeLevel === level;
  }
};
