import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { optionalImageFileSchema } from './image-upload';

export const OPEN_BADGE_NAME_MAX_LENGTH = 35;
export const OPEN_BADGE_DESCRIPTION_MAX_LENGTH = 100;
export const OPEN_BADGE_LEVEL_TITLE_MAX_LENGTH = 35;

export const openBadgeNameSchema = z
  .string()
  .min(1, { message: 'validation.openBadge.nameRequired' })
  .max(OPEN_BADGE_NAME_MAX_LENGTH, { message: 'validation.openBadge.nameMaxLength' });
export const openBadgeDescriptionSchema = z
  .string()
  .min(1, { message: 'validation.openBadge.descriptionRequired' })
  .max(OPEN_BADGE_DESCRIPTION_MAX_LENGTH, { message: 'validation.openBadge.descriptionMaxLength' });
export const openBadgeLevelTitleSchema = z
  .string()
  .trim()
  .min(1, { message: 'validation.openBadge.levelTitleRequired' })
  .max(OPEN_BADGE_LEVEL_TITLE_MAX_LENGTH, { message: 'validation.openBadge.levelTitleMaxLength' });
export const openBadgeLevelDescriptionSchema = z
  .string()
  .trim()
  .min(1, { message: 'validation.openBadge.levelDescriptionRequired' });

const levelSchema = z.object({
  title: zfd.text(openBadgeLevelTitleSchema),
  description: zfd.text(openBadgeLevelDescriptionSchema)
});

const openBadgeFormSchema = z.object({
  name: zfd.text(openBadgeNameSchema),
  description: zfd.text(openBadgeDescriptionSchema),
  imageFile: optionalImageFileSchema,
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
