import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { passwordConfirmationSchema, passwordSchema } from './password';
import { emailSchema } from './email';

export const inscriptionFormDataSchema = zfd
  .formData({
    prenom: z.string().min(1, { message: 'validation.inscription.prenomRequired' }),
    nom: z.string().min(1, { message: 'validation.inscription.nomRequired' }),
    email: emailSchema,
    motDePasse: passwordSchema,
    confirmationMotDePasse: passwordConfirmationSchema,
    profil: z.string().min(1, { message: 'validation.inscription.profilRequired' }),
    cgu: z.string().min(1, { message: 'validation.inscription.cguRequired' }),
    niveauScolaire: z.string().min(1, { message: 'validation.inscription.niveauScolaireRequired' })
  })
  .refine(({ motDePasse, confirmationMotDePasse }) => motDePasse === confirmationMotDePasse, {
    message: 'validation.password.confirmationMismatch',
    path: ['confirmationMotDePasse']
  });

export type InscriptionFormData = z.infer<typeof inscriptionFormDataSchema>;
