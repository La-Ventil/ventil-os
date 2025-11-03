import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const resetPasswordFormDataSchema = zfd.formData({
    email: z.string().min(1, 'Vous devez renseigner l\'email utilisé lors de l\'inscription.'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormDataSchema>;