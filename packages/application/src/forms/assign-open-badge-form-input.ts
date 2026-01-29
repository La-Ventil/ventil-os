import { z } from 'zod';

export const assignOpenBadgeFormInputSchema = z.object({
  userId: z.string().min(1),
  openBadgeId: z.string().min(1),
  level: z.coerce.number().int().positive()
});

export type AssignOpenBadgeFormInput = z.infer<typeof assignOpenBadgeFormInputSchema>;
