'use server';

import { getTranslations } from 'next-intl/server';
import {
  openBadgeCreateRequestSchema,
  type OpenBadgeCreateRequest,
  type OpenBadgeCreateData
} from '@repo/application/forms';
import { canManageBadges, createOpenBadge as createOpenBadgeRecord } from '@repo/application';
import { MAX_IMAGE_MB, validateAndStoreImage } from '@repo/application/server/uploads';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function createOpenBadge(
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

  // 2) Handle image upload / validation (file already type-checked)
  const imageResult = await validateAndStoreImage(request.imageFile ?? null, { maxMb: MAX_IMAGE_MB });
  if ('error' in imageResult) {
    const fieldKey = imageResult.field ?? 'imageUrl';
    const msg = t(`validation.${imageResult.error}`, imageResult.params);
    return formValidationError(responseValues, { [fieldKey]: [msg] }, msg);
  }

  // 3) Build final values
  const values: OpenBadgeCreateData = {
    name: request.name ?? previousState.values.name,
    description: request.description ?? previousState.values.description,
    imageUrl: imageResult.url,
    levels: (request.levels ?? []).filter((level) => level.title || level.description),
    deliveryEnabled: request.deliveryEnabled ?? false,
    deliveryLevel: request.deliveryLevel ?? previousState.values.deliveryLevel,
    activationEnabled: request.activationEnabled ?? false
  };

  try {
    await createOpenBadgeRecord({
      ...values,
      creatorId: userId
    });

    return formSuccess(responseValues, t('openBadge.create.success'));
  } catch (err) {
    console.error(err);
    return formError(responseValues ?? previousState.values, { message: t('openBadge.create.error') });
  }
}
