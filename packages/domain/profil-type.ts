// Eleve
    // Ventil
    // Ancien
    // Visiteur
// Enseignant
// Externe
    // intervenant
    // Visiteur
    //

export const ProfilType = {
    Ventilacteur: 'ventilacteur',
    EleveLycee: 'eleve_lycee',
    Enseignant: 'enseignant',
    Intervenant: 'intervenant',
        // externe
    Visiteur: 'visiteur',
} as const;

export type ProfilType = (typeof ProfilType)[keyof typeof ProfilType];