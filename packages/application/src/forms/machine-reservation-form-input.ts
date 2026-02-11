import { z } from 'zod';
import { zfd } from 'zod-form-data';

const startsAtSchema = z
  .string()
  .min(1, { message: 'validation.machineReservation.startsAtRequired' })
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'validation.machineReservation.startsAtInvalid'
  });

const durationSchema = z.coerce
  .number()
  .int()
  .min(1, { message: 'validation.machineReservation.durationRequired' });

export const machineReservationFormSchema = zfd.formData({
  machineId: zfd.text(z.string().min(1, { message: 'validation.machineReservation.machineRequired' })),
  startsAt: zfd.text(startsAtSchema),
  durationMinutes: zfd.text(durationSchema),
  participantIds: zfd.repeatableOfType(zfd.text(z.string().min(1))).optional()
});

export type MachineReservationFormInput = z.infer<typeof machineReservationFormSchema>;
