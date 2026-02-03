import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { imageFileSchema } from './image-upload';

const levelSchema = z.object({
  title: zfd.text(z.string().trim().min(1, { message: 'validation.openBadge.levelTitleRequired' })),
  description: zfd.text(z.string().trim().min(1, { message: 'validation.openBadge.levelDescriptionRequired' }))
});

const openBadgeFormSchema = z.object({
  name: zfd.text(z.string().min(1, { message: 'validation.openBadge.nameRequired' })),
  description: zfd.text(z.string().min(1, { message: 'validation.openBadge.descriptionRequired' })),
  imageFile: zfd.file(imageFileSchema).optional(),
  levels: zfd.repeatable(z.array(levelSchema).min(1, { message: 'validation.openBadge.levelAtLeastOne' })),
  deliveryEnabled: zfd.checkbox(),
  deliveryLevel: zfd.text(z.string().optional()),
  activationEnabled: zfd.checkbox()
});

const openBadgeFormDataSchema = zfd.formData(openBadgeFormSchema);

export const openBadgeCreateRequestSchema = openBadgeFormDataSchema.superRefine((data, ctx) => {
  if (!data.imageFile) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['imageFile'],
      message: 'validation.openBadge.imageRequired'
    });
  }
});

export const openBadgeUpdateRequestSchema = zfd.formData(
  openBadgeFormSchema.extend({
    id: zfd.text(z.string().min(1, { message: 'validation.openBadge.idRequired' }))
  })
);

export type OpenBadgeCreateRequest = z.infer<typeof openBadgeCreateRequestSchema>;
export type OpenBadgeUpdateRequest = z.infer<typeof openBadgeUpdateRequestSchema>;

export type OpenBadgeCreateData = Omit<OpenBadgeCreateRequest, 'imageFile'> & {
  imageUrl: string;
};
