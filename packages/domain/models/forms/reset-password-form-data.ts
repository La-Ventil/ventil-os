import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const resetPasswordFormDataSchema = zfd.formData({
    email: z.string().min(1, 'Veuillez décrire votre projet.'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormDataSchema>;