import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, { message: 'validation.emailRequired' })
  .email({ message: 'validation.emailInvalid' });
