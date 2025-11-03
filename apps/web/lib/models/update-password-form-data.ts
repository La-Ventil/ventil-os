import { z } from 'zod';
import { zfd } from 'zod-form-data';
import {passwordSchema} from "./password";

export const updatePasswordFormDataSchema = zfd.formData({
    motDePasse: passwordSchema,
    confirmationMotDePasse: z.string().min(1, 'Veuillez décrire votre projet.'),
}).refine(({ motDePasse, confirmationMotDePasse}) => motDePasse === confirmationMotDePasse, {
    message: 'passwordMismatchErrorMessage',
    path: ['confirmPassword'],
});

export type UpdatePasswordFormData = z.infer<typeof updatePasswordFormDataSchema>;