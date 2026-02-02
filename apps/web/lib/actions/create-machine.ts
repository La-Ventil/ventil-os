'use server';

import { getTranslations } from 'next-intl/server';
import { machineCreateFormSchema, type MachineCreateFormInput } from '@repo/application/forms';
import {
  canManageBadgesUser,
  createMachine as createMachineRecord,
  validateAndStoreImage,
  MAX_IMAGE_MB
} from '@repo/application';
import type { FormState } from '@repo/ui/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';

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
      message: t('machine.create.unauthorized'),
      fieldErrors: {},
      values: previousState.values
    };
  }
  const file = formData.get('imageFile');
  const imageResult = await validateAndStoreImage(file as File | null, { maxMb: MAX_IMAGE_MB });
  if ('error' in imageResult) {
    const fieldKey = imageResult.field ?? 'imageUrl';
    const msg = t(`validation.${imageResult.error}`, imageResult.params);
    return {
      success: false,
      valid: false,
      message: msg,
      fieldErrors: { [fieldKey]: [msg] },
      values: previousState.values
    };
  }

  formData.set('imageUrl', imageResult.url);

  const { success, data, error } = machineCreateFormSchema.safeParse(formData);

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return {
      success: false,
      valid: false,
      message: fieldErrorsToSingleMessage(fieldErrors),
      fieldErrors,
      values: previousState.values
    };
  }

  try {
    await createMachineRecord({
      ...data,
      creatorId: session.user.id
    });

    return {
      success: true,
      valid: true,
      values: data,
      message: t('machine.create.success'),
      fieldErrors: {}
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      valid: true,
      message: t('machine.create.error'),
      fieldErrors: {},
      values: data ?? previousState.values
    };
  }
}
