'use server';

import { getTranslations } from 'next-intl/server';
import {
  machineUpdateRequestSchema,
  type MachineUpdateRequest,
  type MachineUpdateData
} from '@repo/application/forms';
import { canManageMachines } from '@repo/application';
import { updateMachine } from '@repo/application/machines/usecases';
import { MAX_IMAGE_MB, validateAndStoreImage } from '@repo/application/server/uploads';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
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
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
  }

  const request = parseResult.data as MachineUpdateRequest;
  const responseValues: MachineUpdateRequest = { ...request, imageFile: undefined };

  let imageUrl: string | null | undefined = undefined;
  if (request.imageFile) {
    const imageResult = await validateAndStoreImage(request.imageFile ?? null, {
      maxMb: MAX_IMAGE_MB,
      field: 'imageFile'
    });
    if ('error' in imageResult) {
      const fieldKey = imageResult.field ?? 'imageFile';
      const msg = t(`validation.${imageResult.error}`, imageResult.params);
      return formValidationError(responseValues, { [fieldKey]: [msg] }, msg);
    }
    imageUrl = imageResult.url;
  }

  const values: MachineUpdateData = {
    id: request.id,
    name: request.name ?? previousState.values.name,
    description: request.description ?? previousState.values.description,
    imageUrl,
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
