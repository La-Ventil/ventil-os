import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { optionalImageFileSchema } from './image-upload';

const machineUpdateFormSchema = z
  .object({
    id: zfd.text(z.string().min(1)),
    name: zfd.text(
      z
        .string()
        .min(1, { message: 'validation.machine.nameRequired' })
        .max(35, { message: 'validation.machine.nameMaxLength' })
    ),
    description: zfd.text(
      z
        .string()
        .min(1, { message: 'validation.machine.descriptionRequired' })
        .max(100, { message: 'validation.machine.descriptionMaxLength' })
    ),
    imageFile: optionalImageFileSchema,
    badgeRequired: zfd.checkbox(),
    requiredOpenBadgeId: zfd.text(z.string().optional()),
    requiredOpenBadgeLevelId: zfd.text(z.string().optional()),
    activationEnabled: zfd.checkbox()
  })
  .superRefine((data, context) => {
    if (data.badgeRequired && !data.requiredOpenBadgeId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['requiredOpenBadgeId'],
        message: 'validation.machine.requiredOpenBadge'
      });
    }
  });

export const machineUpdateRequestSchema = zfd.formData(machineUpdateFormSchema);

export type MachineUpdateRequest = z.infer<typeof machineUpdateRequestSchema>;
export type MachineUpdateData = Omit<MachineUpdateRequest, 'imageFile'> & {
  imageUrl?: string | null;
};

export type MachineUpdateFormInput = MachineUpdateRequest;
