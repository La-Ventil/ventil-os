// These are stable domain codes for the French school context supported by Ventil OS.
// They are not end-user labels and are translated at the UI layer.
export const EducationLevel = {
  Seconde: 'seconde',
  Premiere: 'premiere',
  Terminale: 'terminale',
  BTS: 'bts'
} as const;

export type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel];

const educationLevelValues = new Set<EducationLevel>(Object.values(EducationLevel));

const legacyEducationLevelAliases: Record<string, EducationLevel> = {
  seconde: EducationLevel.Seconde,
  'premiere': EducationLevel.Premiere,
  'première': EducationLevel.Premiere,
  terminale: EducationLevel.Terminale,
  terminal: EducationLevel.Terminale,
  bts: EducationLevel.BTS,
  'bts 1ere annee': EducationLevel.BTS,
  'bts 1ère année': EducationLevel.BTS,
  'bts 2eme annee': EducationLevel.BTS,
  'bts 2ème année': EducationLevel.BTS
};

const normalizeEducationLevelAlias = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const parseEducationLevel = (value?: string | null): EducationLevel | null =>
  value
    ? educationLevelValues.has(value as EducationLevel)
      ? (value as EducationLevel)
      : legacyEducationLevelAliases[normalizeEducationLevelAlias(value)] ?? null
    : null;
