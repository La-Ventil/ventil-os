export const NiveauScolaire = {
    Seconde: 'seconde',
    Premiere: 'premiere',
    Terminal: 'terminal',
    BTS: 'bts',
} as const;

export type NiveauScolaire = (typeof NiveauScolaire)[keyof typeof NiveauScolaire];