import { z } from 'zod';
import { zfd } from 'zod-form-data';
import {passwordSchema} from "./password";

export const profilFormDataSchema = zfd.formData({
    prenom: z.string().min(1, 'Impossible de trouver un projet sans son identifiant.'),
    nom: z.string().min(1, 'Veuillez décrire votre projet.'),
    email: z.string().min(1, 'Veuillez décrire votre projet.'),
    motDePasse: passwordSchema,
    confirmationMotDePasse: z.string().min(1, 'Veuillez décrire votre projet.'),
    profil: z.string().min(1, 'Veuillez décrire votre projet.'),
    cgu: z.string().min(1, 'Veuillez décrire votre projet.'),
    niveauScolaire: z.string().min(1, 'Veuillez décrire votre projet.'),
}).refine(({ motDePasse, confirmationMotDePasse}) => motDePasse === confirmationMotDePasse, {
    message: 'passwordMismatchErrorMessage',
    path: ['confirmPassword'],
});

export type ProfilFormData = z.infer<typeof profilFormDataSchema>;