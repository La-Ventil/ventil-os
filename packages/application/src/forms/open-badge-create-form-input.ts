import { z } from 'zod';
import { zfd } from 'zod-form-data';

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

export const openBadgeCreateFormDataSchema = zfd.formData({
  name: zfd.text(),
  description: zfd.text(),
  deliveryEnabled: zfd.checkbox(),
  deliveryLevel: zfd.text(z.string().optional()),
  activationEnabled: zfd.checkbox(),
  levels: zfd.repeatable(
    z.array(
      z.object({
        title: zfd.text(z.string().trim().default('')),
        description: zfd.text(z.string().trim().default(''))
      })
    )
  )
});

export type OpenBadgeCreateFormInput = z.infer<typeof openBadgeCreateFormSchema>;
