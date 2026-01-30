import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const openBadgeCreateFormSchema = zfd.formData(
  z.object({
    name: zfd.text(z.string().min(1, { message: 'validation.openBadge.nameRequired' })),
    description: zfd.text(z.string().min(1, { message: 'validation.openBadge.descriptionRequired' })),
    imageUrl: zfd.text(z.string().min(1, { message: 'validation.openBadge.imageRequired' })),
    levels: zfd.repeatable(
      z
        .array(
          z.object({
            title: zfd.text(z.string().trim().min(1, { message: 'validation.openBadge.levelTitleRequired' })),
            description: zfd.text(z.string().trim().min(1, { message: 'validation.openBadge.levelDescriptionRequired' }))
          })
        )
        .min(1, { message: 'validation.openBadge.levelAtLeastOne' })
    ),
    deliveryEnabled: zfd.checkbox(),
    deliveryLevel: zfd.text(z.string().optional()),
    activationEnabled: zfd.checkbox()
  })
);

export type OpenBadgeCreateFormInput = z.infer<typeof openBadgeCreateFormSchema>;
