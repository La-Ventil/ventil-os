const normalizeHighestLevel = (highestLevel: number | null): number => highestLevel ?? 0;

export const canAdvanceOpenBadgeLevel = (highestLevel: number | null, targetLevel: number): boolean =>
  targetLevel === normalizeHighestLevel(highestLevel) + 1;

export const canDowngradeOpenBadgeLevel = (highestLevel: number | null, targetLevel: number): boolean => {
  const currentLevel = normalizeHighestLevel(highestLevel);

  if (currentLevel <= 1) {
    return false;
  }

  return targetLevel === currentLevel - 1;
};
