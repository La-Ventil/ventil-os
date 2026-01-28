'use server';

import { getTranslations } from 'next-intl/server';
import {
  machineCreateFormSchema,
  type MachineCreateFormInput
} from '@repo/application/forms';
import type { FormState } from '@repo/ui/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';

const buildValues = (
  formData: FormData,
  previousValues: MachineCreateFormInput
): MachineCreateFormInput => ({
  name: formData.get('name')?.toString() ?? previousValues.name,
  description: formData.get('description')?.toString() ?? previousValues.description,
  imageUrl: formData.get('imageUrl')?.toString() ?? previousValues.imageUrl,
  badgeRequired: formData.get('badgeRequired') === 'on',
  badgeQuery: formData.get('badgeQuery')?.toString() ?? previousValues.badgeQuery,
  activationEnabled: formData.get('activationEnabled') === 'on'
});

export async function createMachine(
  previousState: FormState<MachineCreateFormInput>,
  formData: FormData
): Promise<FormState<MachineCreateFormInput>> {
  const t = await getTranslations();
  const values = buildValues(formData, previousState.values);
  const { success, data, error } = machineCreateFormSchema.safeParse(formData);

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return {
      message: fieldErrorsToSingleMessage(fieldErrors),
      isValid: false,
      fieldErrors,
      values
    };
  }

  try {
    const parsed: MachineCreateFormInput = data;
    void parsed;

    return {
      values,
      message: t('machine.create.success', {
        defaultMessage: 'La machine a bien été enregistrée.'
      }),
      isValid: true,
      fieldErrors: {}
    };
  } catch (err) {
    console.error(err);
    return {
      message: t('machine.create.error', {
        defaultMessage: "Impossible d'enregistrer la machine."
      }),
      isValid: false,
      fieldErrors: {},
      values
    };
  }
}
