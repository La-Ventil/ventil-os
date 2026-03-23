export type OpenBadgeLevelTransition = 'advance' | 'downgrade';

const normalizeHighestLevel = (highestLevel: number | null): number => highestLevel ?? 0;

export const canTransitionOpenBadgeLevel = (
  highestLevel: number | null,
  targetLevel: number,
  transition: OpenBadgeLevelTransition
): boolean => {
  const currentLevel = normalizeHighestLevel(highestLevel);

  if (transition === 'advance') {
    return targetLevel === currentLevel + 1;
  }

  if (currentLevel <= 1) {
    return false;
  }

  return targetLevel === currentLevel - 1;
};

export const canAdvanceOpenBadgeLevel = (highestLevel: number | null, targetLevel: number): boolean =>
  canTransitionOpenBadgeLevel(highestLevel, targetLevel, 'advance');

export const canDowngradeOpenBadgeLevel = (highestLevel: number | null, targetLevel: number): boolean =>
  canTransitionOpenBadgeLevel(highestLevel, targetLevel, 'downgrade');
