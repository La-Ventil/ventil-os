import { z } from 'zod';

export const passwordSchema = z
    .string()
    .min(8, { message: 'minLengthErrorMessage' })
    .max(20, { message: 'maxLengthErrorMessage' })
    .refine((password) => /[A-Z]/.test(password), {
        message: 'uppercaseErrorMessage',
    })
    .refine((password) => /[a-z]/.test(password), {
        message: 'lowercaseErrorMessage',
    })
    .refine((password) => /[0-9]/.test(password), { message: 'numberErrorMessage' })
    .refine((password) => /[!@#$%^&*]/.test(password), {
        message: 'specialCharacterErrorMessage',
    });