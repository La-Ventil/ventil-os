'use server';

import { getTranslations } from 'next-intl/server';
import {
  machineCreateRequestSchema,
  type MachineCreateData,
  type MachineCreateRequest
} from '@repo/application/forms';
import { canManageMachines } from '@repo/application';
import { addMachine } from '@repo/application/machines/usecases';
import { MAX_IMAGE_MB, validateAndStoreImage } from '@repo/application/server/uploads';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function createMachineAction(
  previousState: FormState<MachineCreateRequest>,
  formData: FormData
): Promise<FormState<MachineCreateRequest>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const userCanManageMachines = canManageMachines(session?.user);

  if (!session || !userCanManageMachines) {
    return formError(previousState.values, { message: t('machine.create.unauthorized') });
  }
  const parseResult = machineCreateRequestSchema.safeParse(formData);
  if (!parseResult.success) {
    const fieldErrors = zodErrorToFieldErrors(parseResult.error, t);
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
  }

  const request = parseResult.data as MachineCreateRequest;
  const responseValues: MachineCreateRequest = { ...request, imageFile: undefined };
  let imageUrl: string | null = null;

  if (request.imageFile) {
    const imageResult = await validateAndStoreImage(request.imageFile, {
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

  const values: MachineCreateData = {
    name: request.name ?? previousState.values.name,
    description: request.description ?? previousState.values.description,
    imageUrl,
    badgeRequired: request.badgeRequired ?? false,
    badgeQuery: request.badgeQuery ?? '',
    activationEnabled: request.activationEnabled ?? false
  };

  try {
    await addMachine({
      name: values.name,
      description: values.description,
      imageUrl: values.imageUrl,
      activationEnabled: values.activationEnabled,
      creatorId: session.user.id
    });

    return formSuccess(responseValues, t('machine.create.success'));
  } catch (err) {
    console.error(err);
    return formError(responseValues ?? previousState.values, { message: t('machine.create.error') });
  }
}
