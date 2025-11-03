import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const updatePasswordFormDataSchema = zfd.formData({
    motDePasse: z.string().min(1, 'Veuillez décrire votre projet.'),
    confirmationMotDePasse: z.string().min(1, 'Veuillez décrire votre projet.'),
});

export type UpdatePasswordFormData = z.infer<typeof updatePasswordFormDataSchema>;