import { Level } from './level';

export type BadgeLevel = {
  level: Level;
  title: string;
  description: string;
};

export const BadgeLevel = {
  from(level: number, title?: string | null, description?: string | null): BadgeLevel {
    return {
      level: Level.from(level),
      title: title ?? `Niveau ${level}`,
      description: description ?? ''
    };
  }
};
