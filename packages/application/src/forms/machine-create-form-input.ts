import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const machineCreateFormSchema = zfd.formData({
  name: z
    .string()
    .min(1, { message: 'validation.machine.nameRequired' })
    .max(35, { message: 'validation.machine.nameMaxLength' }),
  description: z
    .string()
    .min(1, { message: 'validation.machine.descriptionRequired' })
    .max(100, { message: 'validation.machine.descriptionMaxLength' }),
  imageUrl: z.string().min(1, { message: 'validation.machine.imageRequired' }),
  badgeRequired: zfd.checkbox(),
  badgeQuery: z.string().optional(),
  activationEnabled: zfd.checkbox()
});

export type MachineCreateFormInput = z.infer<typeof machineCreateFormSchema>;
