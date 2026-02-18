'use server';

import { getTranslations } from 'next-intl/server';
import { machineCreateFormSchema, type MachineCreateFormInput } from '@repo/application/forms';
import { addMachine, canManageBadges } from '@repo/application';
import { MAX_IMAGE_MB, validateAndStoreImage } from '@repo/application/server/uploads';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function createMachine(
  previousState: FormState<MachineCreateFormInput>,
  formData: FormData
): Promise<FormState<MachineCreateFormInput>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const userCanManageBadges = canManageBadges(session?.user);

  if (!session || !userCanManageBadges) {
    return formError(previousState.values, { message: t('machine.create.unauthorized') });
  }
  const file = formData.get('imageFile');
  const imageResult = await validateAndStoreImage(file as File | null, { maxMb: MAX_IMAGE_MB });
  if ('error' in imageResult) {
    const fieldKey = imageResult.field ?? 'imageUrl';
    const msg = t(`validation.${imageResult.error}`, imageResult.params);
    return formValidationError(previousState.values, { [fieldKey]: [msg] }, msg);
  }

  formData.set('imageUrl', imageResult.url);

  const { success, data, error } = machineCreateFormSchema.safeParse(formData);

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
  }

  try {
    await addMachine({
      ...data,
      creatorId: session.user.id
    });

    return formSuccess(data, t('machine.create.success'));
  } catch (err) {
    console.error(err);
    return formError(data ?? previousState.values, { message: t('machine.create.error') });
  }
}
