import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const openBadgeCreateFormSchema = zfd.formData({
  name: z.string().min(1, { message: 'validation.openBadge.nameRequired' }),
  description: z.string().min(1, { message: 'validation.openBadge.descriptionRequired' }),
  imageUrl: z.string().min(1, { message: 'validation.openBadge.imageRequired' }),
  levelTitle: z.string().min(1, { message: 'validation.openBadge.levelTitleRequired' }),
  levelDescription: z
    .string()
    .min(1, { message: 'validation.openBadge.levelDescriptionRequired' }),
  deliveryEnabled: zfd.checkbox(),
  deliveryLevel: z.string().optional(),
  activationEnabled: zfd.checkbox()
});

export type OpenBadgeCreateFormInput = z.infer<typeof openBadgeCreateFormSchema>;
