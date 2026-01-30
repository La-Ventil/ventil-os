import { z } from 'zod';

export const openBadgeCreateFormSchema = z.object({
  name: z.string().min(1, { message: 'validation.openBadge.nameRequired' }),
  description: z.string().min(1, { message: 'validation.openBadge.descriptionRequired' }),
  imageUrl: z.string().min(1, { message: 'validation.openBadge.imageRequired' }),
  levels: z
    .array(
      z.object({
        title: z.string().min(1, { message: 'validation.openBadge.levelTitleRequired' }),
        description: z.string().min(1, { message: 'validation.openBadge.levelDescriptionRequired' })
      })
    )
    .min(1, { message: 'validation.openBadge.levelAtLeastOne' }),
  deliveryEnabled: z.boolean(),
  deliveryLevel: z.string().optional(),
  activationEnabled: z.boolean()
});

export type OpenBadgeCreateFormInput = z.infer<typeof openBadgeCreateFormSchema>;
