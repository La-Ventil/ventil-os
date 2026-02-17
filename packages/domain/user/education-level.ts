export const EducationLevel = {
  Seconde: 'seconde',
  Premiere: 'premiere',
  Terminale: 'terminal',
  BTS: 'bts'
} as const;

export type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel];

const educationLevelValues = new Set<EducationLevel>(Object.values(EducationLevel));

export const parseEducationLevel = (value?: string | null): EducationLevel | null =>
  value && educationLevelValues.has(value as EducationLevel) ? (value as EducationLevel) : null;
