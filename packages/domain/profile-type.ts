// Eleve
    // Ventil
    // Ancien
    // Visiteur
// Enseignant
// Externe
    // intervenant
    // Visiteur
    //

export const ProfileType = {
  Member: 'ventilacteur',
  Alumni: 'eleve_lycee',
  Teacher: 'enseignant',
  Contributor: 'intervenant',
  Visitor: 'visiteur'
} as const;

export type ProfileType = (typeof ProfileType)[keyof typeof ProfileType];
