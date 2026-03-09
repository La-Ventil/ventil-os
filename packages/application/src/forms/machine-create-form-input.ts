import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { optionalImageFileSchema } from './image-upload';

export const MACHINE_NAME_MAX_LENGTH = 35;
export const MACHINE_DESCRIPTION_MAX_LENGTH = 100;

export const machineNameSchema = z
  .string()
  .min(1, { message: 'validation.machine.nameRequired' })
  .max(MACHINE_NAME_MAX_LENGTH, { message: 'validation.machine.nameMaxLength' });
export const machineDescriptionSchema = z
  .string()
  .min(1, { message: 'validation.machine.descriptionRequired' })
  .max(MACHINE_DESCRIPTION_MAX_LENGTH, { message: 'validation.machine.descriptionMaxLength' });

const machineCreateFormSchema = z.object({
  name: zfd.text(machineNameSchema),
  description: zfd.text(machineDescriptionSchema),
  imageFile: optionalImageFileSchema,
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
