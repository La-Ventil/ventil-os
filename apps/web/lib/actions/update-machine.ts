'use server';

import { getTranslations } from 'next-intl/server';
import { machineUpdateRequestSchema, type MachineUpdateRequest, type MachineUpdateData } from '@repo/application/forms';
import { canManageMachines } from '@repo/application';
import { updateMachine } from '@repo/application/machines/usecases';
import type { FormState } from '@repo/form/form-state';
import { resolveImageUpload } from '../image-upload';
import { zodErrorToFieldErrors } from '@repo/form/zod-errors';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function updateMachineAction(
  previousState: FormState<MachineUpdateRequest>,
  formData: FormData
): Promise<FormState<MachineUpdateRequest>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const userCanManageMachines = canManageMachines(session?.user);

  if (!session || !userCanManageMachines) {
    return formError(previousState.values, { message: t('machine.update.unauthorized') });
  }

  const parseResult = machineUpdateRequestSchema.safeParse(formData);
  if (!parseResult.success) {
    const fieldErrors = zodErrorToFieldErrors(parseResult.error, t);
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToMessage(fieldErrors));
  }

  const request = parseResult.data as MachineUpdateRequest;
  const responseValues: MachineUpdateRequest = { ...request, imageFile: undefined };
  const imageUpload = await resolveImageUpload(request.imageFile, t, {
    field: 'imageFile',
    emptyValue: undefined
  });
  if (!imageUpload.ok) {
    return formValidationError(responseValues, { [imageUpload.field]: [imageUpload.message] }, imageUpload.message);
  }

  const values: MachineUpdateData = {
    id: request.id,
    name: request.name ?? previousState.values.name,
    description: request.description ?? previousState.values.description,
    imageUrl: imageUpload.imageUrl,
    badgeRequired: request.badgeRequired ?? false,
    badgeQuery: request.badgeQuery ?? '',
    activationEnabled: request.activationEnabled ?? false
  };

  try {
    await updateMachine({
      id: values.id,
      name: values.name,
      description: values.description,
      imageUrl: values.imageUrl,
      activationEnabled: values.activationEnabled
    });

    return formSuccess(responseValues, t('machine.update.success'));
  } catch (err) {
    if (err instanceof Error && err.message === 'machine.update.notFound') {
      return formError(responseValues, { message: t('machine.update.notFound') });
    }
    console.error(err);
    return formError(responseValues ?? previousState.values, { message: t('machine.update.error') });
  }
}
