'use server';

import { getTranslations } from 'next-intl/server';
import { machineCreateRequestSchema, type MachineCreateData, type MachineCreateRequest } from '@repo/application/forms';
import { canManageMachines } from '@repo/application';
import { addMachine } from '@repo/application/machines/usecases';
import type { FormState } from '@repo/form/form-state';
import { resolveImageUpload } from '../image-upload';
import { zodErrorToFieldErrors } from '@repo/form/zod-errors';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
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
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToMessage(fieldErrors));
  }

  const request = parseResult.data as MachineCreateRequest;
  const responseValues: MachineCreateRequest = { ...request, imageFile: undefined };
  const imageUpload = await resolveImageUpload(request.imageFile, t, {
    field: 'imageFile',
    emptyValue: null
  });
  if (!imageUpload.ok) {
    return formValidationError(responseValues, { [imageUpload.field]: [imageUpload.message] }, imageUpload.message);
  }

  const values: MachineCreateData = {
    name: request.name ?? previousState.values.name,
    description: request.description ?? previousState.values.description,
    imageUrl: imageUpload.imageUrl ?? null,
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
