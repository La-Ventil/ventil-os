import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { imageFileSchema } from './image-upload';

const machineCreateFormSchema = z.object({
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
  imageFile: zfd.file(imageFileSchema).optional(),
  badgeRequired: zfd.checkbox(),
  badgeQuery: zfd.text(z.string().optional()),
  activationEnabled: zfd.checkbox()
});

export const machineCreateRequestSchema = zfd.formData(machineCreateFormSchema);

export type MachineCreateRequest = z.infer<typeof machineCreateRequestSchema>;
export type MachineCreateData = Omit<MachineCreateRequest, 'imageFile'> & {
  imageUrl: string | null;
};

export type MachineCreateFormInput = MachineCreateRequest;
