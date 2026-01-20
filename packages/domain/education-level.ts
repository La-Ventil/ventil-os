export const EducationLevel = {
  Seconde: 'seconde',
  Premiere: 'premiere',
  Terminale: 'terminal',
  BTS: 'bts'
} as const;

export type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel];
