'use server';

import { getTranslations } from 'next-intl/server';
import { machineCreateFormSchema, type MachineCreateFormInput } from '@repo/application/forms';
import { canManageBadgesUser, createMachine as createMachineRecord } from '@repo/application';
import type { FormState } from '@repo/ui/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

const buildValues = (formData: FormData, previousValues: MachineCreateFormInput): MachineCreateFormInput => ({
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
  const session = await getServerSession();
  const canManageBadges = canManageBadgesUser(session?.user);

  if (!session || !canManageBadges) {
    return {
      success: false,
      valid: true,
      isValid: false,
      message: t('machine.create.unauthorized'),
      fieldErrors: {},
      values: previousState.values
    };
  }
  const values = buildValues(formData, previousState.values);
  const { success, data, error } = machineCreateFormSchema.safeParse(values);

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return {
      success: false,
      valid: false,
      isValid: false,
      message: fieldErrorsToSingleMessage(fieldErrors),
      fieldErrors,
      values
    };
  }

  try {
    const parsed: MachineCreateFormInput = data;
    await createMachineRecord({
      ...parsed,
      creatorId: session.user.id
    });

    return {
      success: true,
      valid: true,
      isValid: true,
      values,
      message: t('machine.create.success'),
      fieldErrors: {}
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      valid: true,
      isValid: false,
      message: t('machine.create.error'),
      fieldErrors: {},
      values
    };
  }
}
