import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { imageFileSchema } from './image-upload';

const machineUpdateFormSchema = z.object({
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
  imageFile: z.preprocess((value) => {
    if (value instanceof File) {
      return value.size === 0 ? undefined : value;
    }
    return value === '' || value == null ? undefined : value;
  }, imageFileSchema.optional()),
  badgeRequired: zfd.checkbox(),
  badgeQuery: zfd.text(z.string().optional()),
  activationEnabled: zfd.checkbox()
});

export const machineUpdateRequestSchema = zfd.formData(machineUpdateFormSchema);

export type MachineUpdateRequest = z.infer<typeof machineUpdateRequestSchema>;
export type MachineUpdateData = Omit<MachineUpdateRequest, 'imageFile'> & {
  imageUrl?: string | null;
};

export type MachineUpdateFormInput = MachineUpdateRequest;
