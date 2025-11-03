import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const inscriptionFormDataSchema = zfd.formData({
    email: z.string().min(1, 'Veuillez décrire votre projet.'),
});

export type InscriptionFormData = z.infer<typeof inscriptionFormDataSchema>;