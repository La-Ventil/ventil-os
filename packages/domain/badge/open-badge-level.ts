export type OpenBadgeLevel = {
  level: number;
  title: string;
  description: string;
};

export const formatOpenBadgeLevelLabel = (level: OpenBadgeLevel): string =>
  `${level.level} - ${level.title}`.trim();

export const assertOpenBadgeLevel = (level: number): number => {
  if (!Number.isInteger(level) || level < 1) {
    throw new Error('Level must be a positive integer.');
  }

  return level;
};

export const OpenBadgeLevel = {
  from(level: number, title?: string | null, description?: string | null): OpenBadgeLevel {
    const normalizedLevel = assertOpenBadgeLevel(level);
    return {
      level: normalizedLevel,
      title: title ?? `Niveau ${normalizedLevel}`,
      description: description ?? ''
    };
  },
  fromObject(input: { level: number; title?: string | null; description?: string | null }): OpenBadgeLevel {
    return OpenBadgeLevel.from(input.level, input.title, input.description);
  }
};
