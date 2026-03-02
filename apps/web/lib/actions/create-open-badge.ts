'use server';

import { getTranslations } from 'next-intl/server';
import {
  openBadgeCreateRequestSchema,
  type OpenBadgeCreateRequest,
  type OpenBadgeCreateData
} from '@repo/application/forms';
import { canManageBadges } from '@repo/application';
import { addOpenBadge } from '@repo/application/open-badges/usecases';
import type { FormState } from '@repo/form/form-state';
import { resolveImageUpload } from '../image-upload';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function createOpenBadgeAction(
  previousState: FormState<OpenBadgeCreateRequest>,
  formData: FormData
): Promise<FormState<OpenBadgeCreateRequest>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const userCanManageBadges = canManageBadges(session?.user);

  if (!session || !userCanManageBadges) {
    return formError(previousState.values, { message: t('openBadge.create.unauthorized') });
  }
  const userId = session.user.id;

  // 1) Validate all fields including imageFile presence
  const parseResult = openBadgeCreateRequestSchema.safeParse(formData);
  if (!parseResult.success) {
    const fieldErrors = zodErrorToFieldErrors(parseResult.error, t);
    return formValidationError(previousState.values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
  }
  const request = parseResult.data as OpenBadgeCreateRequest;
  const responseValues: OpenBadgeCreateRequest = { ...request, imageFile: undefined };

  const imageUpload = await resolveImageUpload(request.imageFile, t, {
    required: true,
    field: 'imageFile',
    requiredMessageKey: 'validation.openBadge.imageRequired'
  });
  if (!imageUpload.ok) {
    return formValidationError(responseValues, { [imageUpload.field]: [imageUpload.message] }, imageUpload.message);
  }

  const values: OpenBadgeCreateData = {
    name: request.name ?? previousState.values.name,
    description: request.description ?? previousState.values.description,
    imageUrl: imageUpload.imageUrl ?? '',
    levels: (request.levels ?? []).filter((level) => level.title || level.description),
    deliveryEnabled: request.deliveryEnabled ?? false,
    deliveryLevel: request.deliveryLevel ?? previousState.values.deliveryLevel,
    activationEnabled: request.activationEnabled ?? false
  };

  try {
    await addOpenBadge({
      ...values,
      creatorId: userId
    });

    return formSuccess(responseValues, t('openBadge.create.success'));
  } catch (err) {
    console.error(err);
    return formError(responseValues ?? previousState.values, { message: t('openBadge.create.error') });
  }
}
