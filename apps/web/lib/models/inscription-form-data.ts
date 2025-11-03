import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const inscriptionFormDataSchema = zfd.formData({
    prenom: z.string().min(1, 'Impossible de trouver un projet sans son identifiant.'),
    nom: z.string().min(1, 'Veuillez décrire votre projet.'),
    email: z.string().min(1, 'Veuillez décrire votre projet.'),
    motDePasse: z.string().min(1, 'Veuillez décrire votre projet.'),
    confirmationMotDePasse: z.string().min(1, 'Veuillez décrire votre projet.'),
    profil: z.string().min(1, 'Veuillez décrire votre projet.'),
    cgu: z.string().min(1, 'Veuillez décrire votre projet.'),
});

export type InscriptionFormData = z.infer<typeof inscriptionFormDataSchema>;