import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const connexionFormDataSchema = zfd.formData({
    email: z.string().min(1, 'Vous devez renseigner l\'email utilisé lors de l\'inscription.'),
});

export type ConnexionFormData = z.infer<typeof connexionFormDataSchema>;